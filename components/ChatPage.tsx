"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
    Loader2, Send, Volume2, PlayCircle, Clock, CheckCircle2, Wifi, WifiOff
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { SUPPORTED_LANGUAGES, normalizeLanguageCode, getLanguageData } from '@/lib/i18n';

interface ChatPageProps {
    currentLang?: string;
    langLabel?: string;
    voiceGender?: 'male' | 'female';
    mode?: 'interpretation' | 'private';
    onLastManagerText?: (text: string) => void;
    quickBroadcast?: string;
    onQuickBroadcastDone?: () => void;
    reBroadcastTrigger?: number;
    lastManagerKR?: string;
    forcedWorkerName?: string;
    onVoiceGenderChange?: (gender: 'male' | 'female') => void;
    theme?: 'dark' | 'light';
}

interface Message {
    id: number | string;
    text: string;
    role: 'mgr' | 'wrk';
    translation?: string;
    pronunciation?: string;
    timestamp: Date;
    isOptimistic?: boolean;
    workerLanguage?: string;
}

export default function ChatPage({
    currentLang = 'VN',
    langLabel = 'Vietnamese',
    voiceGender = 'female',
    mode = 'interpretation',
    onLastManagerText,
    quickBroadcast,
    onQuickBroadcastDone,
    reBroadcastTrigger = 0,
    lastManagerKR,
    forcedWorkerName,
    onVoiceGenderChange,
    theme = 'light',
}: ChatPageProps) {
    const searchParams = useSearchParams();
    const forcedRole = searchParams.get('role') as 'manager' | 'worker' | null;

    const [messages, setMessages] = useState<Message[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingRole, setRecordingRole] = useState<'mgr' | 'wrk' | null>(null);
    const [transcript, setTranscript] = useState("");
    const [timerValue, setTimerValue] = useState(0);
    const [inputText, setInputText] = useState("");
    const [isUrgent, setIsUrgent] = useState(false);
    const [isSyncActive, setIsSyncActive] = useState(true);
    const [isTranslatingId, setIsTranslatingId] = useState<string | number | null>(null);

    const [viewerRole, setViewerRole] = useState<'manager' | 'worker'>('manager');
    const [inputRole, setInputRole] = useState<'mgr' | 'wrk'>('mgr');
    const [userName, setUserName] = useState("Loading...");
    const [isMounted, setIsMounted] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const wakeLockRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isSyncingRef = useRef(false);
    const lastPlayedIdRef = useRef<string | number | null>(null);

    // Initial Hydration & Role Setup
    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem('user');
        let role: 'manager' | 'worker' = 'worker';
        let name = "현장직원";

        if (forcedRole === 'manager' || forcedRole === 'worker') {
            role = forcedRole;
            name = role === 'manager' ? '본부장' : '현장직원';
        } else if (saved) {
            try {
                const u = JSON.parse(saved);
                role = u.role === 'manager' ? 'manager' : 'worker';
                name = u.name || (role === 'manager' ? '본부장' : '현장직원');
            } catch (e) { }
        }
        setViewerRole(role);
        setUserName(name);
    }, [forcedRole]);

    // 🛑 Field-First: WakeLock & Landscape Billboard Detector
    useEffect(() => {
        if (!isMounted) return;

        const handleResize = () => {
            const landscape = window.innerWidth > window.innerHeight && window.innerWidth < 1024;
            setIsLandscape(landscape);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
                } catch (err) { }
            }
        };
        requestWakeLock();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (wakeLockRef.current) wakeLockRef.current.release();
        };
    }, [isMounted]);

    // 🔊 MediaSession API (Field-First: 화면 잠금 시에도 오디오 제어 가능)
    useEffect(() => {
        if (!isMounted || typeof navigator === 'undefined') return;
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: 'SAFE-LINK 실시간 통역',
                artist: '서원토건 안전관리',
                album: '현장 안전 소통'
            });
            navigator.mediaSession.setActionHandler('play', () => {
                if (audioRef.current) audioRef.current.play();
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                if (audioRef.current) audioRef.current.pause();
            });
        }
    }, [isMounted]);

    // 🔊 Audio Session Stabilization (Silent Loop trick to keep background audio alive)
    useEffect(() => {
        if (!isAudioEnabled) return;
        const interval = setInterval(() => {
            const silent = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
            silent.volume = 0.01;
            silent.play().catch(() => { });
        }, 20000);
        return () => clearInterval(interval);
    }, [isAudioEnabled]);

    // 🔊 TTS Playback Engine
    const playTTS = useCallback(async (text: string, langCode: string) => {
        if (!text || !isAudioEnabled) return;
        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, langCode, gender: voiceGender, emotion: isUrgent ? 'urgent' : undefined })
            });
            const data = await res.json();

            if (data.audioContent) {
                if (audioRef.current) audioRef.current.pause();
                const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
                audioRef.current = audio;
                if (isUrgent) audio.volume = 1.0;
                audio.play().catch(e => console.warn("Playback blocked:", e));
            }
        } catch (e) {
            console.error("TTS Error:", e);
        }
    }, [voiceGender, isUrgent, isAudioEnabled]);

    // 🔄 Message Synchronization
    const fetchMessages = useCallback(async () => {
        if (isSyncingRef.current) return;
        isSyncingRef.current = true;

        try {
            const targetName = forcedWorkerName || (mode === 'private' ? userName : 'SITE_GENERAL');
            if (targetName === 'Loading...') return;

            const res = await fetch(`/api/worker/message?workerName=${encodeURIComponent(targetName)}&t=${Date.now()}`);
            const data = await res.json();

            if (data.success && data.messages) {
                const serverMsgs: Message[] = data.messages.map((m: any) => ({
                    id: m.id,
                    text: m.originalText || "",
                    translation: m.translatedText || m.originalText,
                    pronunciation: m.pronunciation || "",
                    role: m.senderRole === 'manager' ? 'mgr' : 'wrk',
                    timestamp: new Date(m.createdAt),
                    workerLanguage: m.workerLanguage,
                    isOptimistic: false
                }));

                setMessages(prev => {
                    const existingIds = new Set(prev.map(p => p.id.toString()));
                    const newOnes = serverMsgs.filter(m => !existingIds.has(m.id.toString()));

                    // Simple merge strategy
                    if (newOnes.length === 0) return prev;

                    const merged = [...prev.filter(p => !p.isOptimistic), ...newOnes];
                    return merged.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
                });
                setIsSyncActive(true);
            }
        } catch (e) {
            setIsSyncActive(false);
        } finally {
            isSyncingRef.current = false;
        }
    }, [mode, userName, forcedWorkerName]);

    useEffect(() => {
        const interval = setInterval(fetchMessages, 1000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    // 🔊 Auto-Play logic
    useEffect(() => {
        if (messages.length === 0) return;
        const last = messages[messages.length - 1];
        if (!last.isOptimistic && last.id !== lastPlayedIdRef.current) {
            const myRoleTag = viewerRole === 'manager' ? 'mgr' : 'wrk';
            if (last.role !== myRoleTag && isAudioEnabled) {
                const langToPlay = last.role === 'mgr' ? (normalizeLanguageCode(last.workerLanguage || currentLang)) : 'ko';
                playTTS(last.translation || last.text, langToPlay);
            }
            lastPlayedIdRef.current = last.id;
        }
    }, [messages, viewerRole, currentLang, playTTS, isAudioEnabled]);

    // 🚀 STT -> THINK -> TTS Final Input Flow
    const handleFinalInput = async (text: string, role: 'mgr' | 'wrk') => {
        if (!text.trim()) return;
        const tempId = `temp-${Date.now()}`;
        setMessages(prev => [...prev, { id: tempId, text, role, timestamp: new Date(), isOptimistic: true }]);
        if (role === 'mgr' && onLastManagerText) onLastManagerText(text);

        try {
            const threadName = forcedWorkerName || (mode === 'private' ? userName : (role === 'wrk' ? userName : 'SITE_GENERAL'));
            const res = await fetch('/api/worker/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workerName: threadName,
                    workerLanguage: currentLang,
                    message: text,
                    isUrgent,
                    senderRole: role === 'mgr' ? 'manager' : 'worker'
                })
            });
            const data = await res.json();
            if (data.success) {
                // Update with server details
                setMessages(prev => prev.map(m => m.id === tempId ? {
                    ...m,
                    id: data.message.id,
                    translation: data.message.translatedText,
                    pronunciation: data.message.pronunciation,
                    isOptimistic: false
                } : m));
            }
        } catch (e) { }
    };

    // STT Recording Logic
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async (role: 'mgr' | 'wrk') => {
        setIsAudioEnabled(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
            mediaRecorder.onstop = async () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setTranscript("생각 중...");
                const fd = new FormData();
                const langData = getLanguageData(currentLang);
                fd.append('audio', blob);
                fd.append('langCode', role === 'mgr' ? 'ko-KR' : langData.sttCode);
                const res = await fetch('/api/stt', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.success) handleFinalInput(data.transcript, role);
                setIsRecording(false);
                setRecordingRole(null);
                stream.getTracks().forEach(t => t.stop());
            };
            mediaRecorder.start();
            setIsRecording(true);
            setRecordingRole(role);
            setTimerValue(0);
            const interval = setInterval(() => setTimerValue(v => v + 1), 100);
            return () => clearInterval(interval);
        } catch (e) { console.error(e); }
    };

    const stopRecording = () => mediaRecorderRef.current?.stop();

    useEffect(() => {
        if (quickBroadcast) handleFinalInput(quickBroadcast, 'mgr');
        if (onQuickBroadcastDone) onQuickBroadcastDone();
    }, [quickBroadcast]);

    useEffect(() => {
        if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages, transcript]);

    if (!isMounted) return null;

    // 🚨 BILLBOARD MODE
    if (isLandscape && messages.length > 0) {
        const last = messages[messages.length - 1];
        return (
            <div className="fixed inset-0 z-[9999] bg-white text-black flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h1 className="text-[14vh] font-black leading-[1.1] mb-8 uppercase break-words px-4">
                        {last.translation || last.text}
                    </h1>
                    {last.pronunciation && (
                        <div className="text-[6vh] font-black bg-yellow-400 text-black px-12 py-4 rounded-full shadow-2xl">
                            {last.pronunciation}
                        </div>
                    )}
                </div>
                <div className="mt-8 opacity-40 font-black text-2xl uppercase tracking-[1em]">Safe-Link Billboard</div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white text-slate-900 font-sans p-2 overflow-hidden"
            onClick={() => !isAudioEnabled && setIsAudioEnabled(true)}>

            {/* Header / Status Bar */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", isSyncActive ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-red-500 animate-pulse")}></span>
                    <span className="text-[10px] font-black uppercase text-slate-400">Sync Live</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => onVoiceGenderChange?.(voiceGender === 'male' ? 'female' : 'male')}
                        className={cn("px-4 py-1.5 rounded-full text-[10px] font-black border-2 transition-all",
                            voiceGender === 'male' ? "bg-blue-600 border-blue-600 text-white" : "bg-pink-600 border-pink-600 text-white")}>
                        {voiceGender === 'male' ? '👨 Male' : '👩 Female'}
                    </button>
                    <button onClick={() => setIsUrgent(!isUrgent)}
                        className={cn("px-4 py-1.5 rounded-full text-[10px] font-black border-2 transition-all",
                            isUrgent ? "bg-red-600 border-red-600 text-white shadow-lg animate-pulse" : "bg-slate-100 border-slate-200 text-slate-400")}>
                        {isUrgent ? '긴급' : '일반'}
                    </button>
                </div>
            </div>

            {/* 💬 Chat Area (High Contrast) */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 space-y-8 no-scrollbar bg-slate-50/50 rounded-[2rem] py-8">
                {messages.map((msg) => {
                    const isMgr = msg.role === 'mgr';
                    const isMe = (viewerRole === 'manager' && isMgr) || (viewerRole === 'worker' && !isMgr);

                    return (
                        <div key={msg.id} className={cn("flex flex-col group animate-in slide-in-from-bottom-4 duration-500", isMe ? "items-end" : "items-start")}>
                            <div className={cn("flex items-center gap-2 px-4 mb-2 text-[11px] font-black uppercase tracking-widest", isMgr ? "text-indigo-600" : "text-orange-600")}>
                                {isMgr ? "Management" : "Workforce"}
                                {msg.isOptimistic ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                            </div>

                            {/* Field-First: High Contrast Bubbles for Outdoor Visibility */}
                            <div className={cn("max-w-[88%] p-6 rounded-[2.5rem] shadow-xl border-[6px] transition-all relative",
                                isMgr ? "bg-indigo-600 border-indigo-500 text-white rounded-tr-none"
                                    : "bg-orange-50 border-orange-400 text-slate-900 rounded-tl-none")}>

                                {/* Pronunciation Highlight (Field-First) */}
                                {!isMe && msg.pronunciation && (
                                    <div className="bg-yellow-400 text-black px-4 py-1.5 rounded-2xl text-lg font-black mb-4 inline-block shadow-lg border-2 border-black/10">
                                        🔊 "{msg.pronunciation}"
                                    </div>
                                )}

                                {/* Main Text (High Contrast Large) */}
                                <div className={cn("font-black tracking-tight break-words",
                                    isMe ? "text-2xl" : "text-3xl")}>
                                    {isMe ? msg.text : msg.translation}
                                </div>

                                {/* Original/Secondary Text (Small) */}
                                <div className={cn("mt-4 pt-4 border-t border-white/20 text-sm font-bold opacity-60 italic",
                                    isMgr && isMe ? "text-indigo-100" : "text-slate-400")}>
                                    {isMe ? msg.translation : msg.text}
                                </div>

                                {/* Quick Play Button */}
                                <button
                                    onClick={() => {
                                        const code = isMgr ? normalizeLanguageCode(currentLang) : 'ko';
                                        playTTS(msg.translation || msg.text, code);
                                    }}
                                    title="Play audio"
                                    className="absolute -bottom-4 right-4 bg-white text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl border-2 border-indigo-100 active:scale-90 transition-transform"
                                >
                                    <Volume2 size={24} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 🎤 Controls Area */}
            <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-4">
                <div className="flex justify-center gap-12 items-center h-28">
                    <div className="flex flex-col items-center gap-2">
                        <button onClick={() => isRecording ? stopRecording() : startRecording('mgr')}
                            title="Manager Recording"
                            className={cn("w-24 h-24 rounded-[3rem] transition-all active:scale-95 shadow-2xl flex items-center justify-center text-5xl border-[8px]",
                                isRecording && recordingRole === 'mgr' ? "bg-red-600 border-red-400 animate-pulse" : "bg-indigo-600 border-indigo-500")}>
                            👨‍💼
                        </button>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Manager</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <button onClick={() => isRecording ? stopRecording() : startRecording('wrk')}
                            title="Worker Recording"
                            className={cn("w-24 h-24 rounded-[3rem] transition-all active:scale-95 shadow-2xl flex items-center justify-center text-5xl border-[8px]",
                                isRecording && recordingRole === 'wrk' ? "bg-red-600 border-red-400 animate-pulse" : "bg-slate-100 border-slate-200")}>
                            👷
                        </button>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Worker</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-100 p-4 rounded-full px-8 shadow-inner border border-slate-200">
                    <button onClick={() => setInputRole(prev => prev === 'mgr' ? 'wrk' : 'mgr')}
                        className={cn("px-6 py-2 rounded-full text-[10px] font-black transition-all text-white shadow-lg",
                            inputRole === 'mgr' ? "bg-indigo-600" : "bg-orange-600")}>
                        {inputRole === 'mgr' ? 'MGR' : 'WRK'}
                    </button>
                    <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { handleFinalInput(inputText, inputRole); setInputText(''); } }}
                        placeholder="Type message..."
                        className="flex-1 bg-transparent border-none outline-none font-black text-lg text-slate-800 placeholder-slate-400" />
                    <button
                        onClick={() => { handleFinalInput(inputText, inputRole); setInputText(''); }}
                        title="Send Message"
                        className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white",
                            inputRole === 'mgr' ? "bg-indigo-600" : "bg-orange-600")}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>

            {/* Overlay Recording */}
            {isRecording && (
                <div onClick={stopRecording} className="fixed inset-0 z-[10000] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-10 cursor-pointer animate-in fade-in duration-300">
                    <div className="text-[200px] mb-8 drop-shadow-[0_0_80px_rgba(255,255,255,0.2)]">
                        {recordingRole === 'mgr' ? '👨‍💼' : '👷'}
                    </div>
                    <div className="text-white text-9xl font-black mb-12 tabular-nums">
                        {Math.floor(timerValue / 600).toString().padStart(2, '0')}:{Math.floor((timerValue % 600) / 10).toString().padStart(2, '0')}
                    </div>
                    <div className="w-full max-w-5xl bg-white/5 border border-white/10 p-16 rounded-[4rem] text-center">
                        <div className="bg-red-600 text-white px-8 py-2 rounded-full font-black text-2xl inline-block mb-8 animate-bounce">RECORDING</div>
                        <p className="text-7xl font-black text-white italic leading-tight">{transcript || "Listening..."}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
