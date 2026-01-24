"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Props based on usage in app/page.tsx
interface ChatPageProps {
    currentLang: string;
    langLabel: string;
    quickBroadcast: string;
    onQuickBroadcastDone: () => void;
    voiceGender: 'male' | 'female';
    onVoiceGenderChange: (gender: 'male' | 'female') => void;
    lastManagerKR: string;
    onLastManagerText: (text: string) => void;
    reBroadcastTrigger: number;
}

interface Message {
    id: number;
    text: string;
    role: 'mgr' | 'wrk';
    verification?: string; // Back-translation
    timestamp: Date;
}

export default function ChatPage({
    currentLang,
    langLabel,
    quickBroadcast,
    onQuickBroadcastDone,
    voiceGender,
    onVoiceGenderChange,
    lastManagerKR,
    onLastManagerText,
    reBroadcastTrigger
}: ChatPageProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingRole, setRecordingRole] = useState<'mgr' | 'wrk' | null>(null);
    const [transcript, setTranscript] = useState("");
    const [timer, setTimer] = useState(0);
    const [aiStatus, setAiStatus] = useState<'READY' | 'PROCESSING' | 'DELAYED'>('READY');
    const [inputManagerText, setInputManagerText] = useState("");
    const [lastSourceText, setLastSourceText] = useState(""); // Wonmun Preview

    const recognitionRef = useRef<any>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // AudioContext 초기화 (사용자 상호작용 후 생성)
    const getAudioContext = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContextRef.current;
    };

    // PCM L16 오디오 재생 함수 (원본 HTML 코드와 동일)
    const playPCM = (int16Array: Int16Array, sampleRate: number) => {
        const audioContext = getAudioContext();
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 32768;
        }
        const audioBuffer = audioContext.createBuffer(1, float32Array.length, sampleRate);
        audioBuffer.copyToChannel(float32Array, 0);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
    };

    // Google Cloud TTS / Gemini TTS API 호출
    const playGeminiTTS = async (text: string, langCode: string) => {
        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, langCode, gender: voiceGender })
            });

            const data = await response.json();

            if (data.audioContent) {
                // MP3 또는 PCM 오디오 재생
                if (data.mimeType === 'audio/mp3') {
                    // MP3 재생 (Google Cloud TTS)
                    const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
                    audio.play();
                    console.log('✅ Neural2 TTS 재생:', data.voiceName);
                } else {
                    // PCM L16 재생 (Gemini TTS)
                    const binaryString = atob(data.audioContent);
                    const buffer = new Int16Array(binaryString.length / 2);
                    for (let i = 0; i < buffer.length; i++) {
                        buffer[i] = (binaryString.charCodeAt(i * 2) & 0xFF) | (binaryString.charCodeAt(i * 2 + 1) << 8);
                    }
                    playPCM(buffer, data.sampleRate || 24000);
                    console.log('✅ TTS 재생 완료');
                }
            } else if (data.fallback) {
                console.log('⚠️ 서버 TTS 실패, 브라우저 TTS 사용');
                fallbackBrowserTTS(text, langCode);
            }
        } catch (error) {
            console.error('TTS 오류:', error);
            fallbackBrowserTTS(text, langCode);
        }
    };

    // 브라우저 TTS (고품질 음성 우선 선택)
    const fallbackBrowserTTS = (text: string, langCode: string) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(text);

            // 언어 코드 매핑 (중국어는 표준어/북경어로)
            const langMap: Record<string, string> = {
                'zh-CN': 'cmn-CN',  // 표준 중국어 (Mandarin)
                'zh': 'cmn-CN',
            };
            const mappedLang = langMap[langCode] || langCode;
            u.lang = mappedLang;

            const langPrefix = mappedLang.split('-')[0];
            const voices = window.speechSynthesis.getVoices();

            // 우선순위: Microsoft Neural > Google > Apple > 기타
            const priorityKeywords = ['Neural', 'Online', 'Natural', 'Premium', 'Google'];

            let bestVoice = null;

            // 중국어는 'Xiaoxiao', 'Yunyang' 등 표준 중국어 음성 우선
            if (langCode === 'zh-CN') {
                bestVoice = voices.find(v =>
                    (v.lang.includes('cmn') || v.lang.includes('zh-CN')) &&
                    (v.name.includes('Xiaoxiao') || v.name.includes('Yunyang') || v.name.includes('Neural'))
                );
            }

            if (!bestVoice) {
                for (const keyword of priorityKeywords) {
                    bestVoice = voices.find(v =>
                        (v.lang.toLowerCase().includes(langPrefix.toLowerCase()) || v.lang.includes(langCode)) &&
                        v.name.includes(keyword)
                    );
                    if (bestVoice) break;
                }
            }

            // 기본 음성
            if (!bestVoice) {
                bestVoice = voices.find(v => v.lang.toLowerCase().includes(langPrefix.toLowerCase()) || v.lang.includes(langCode));
            }

            if (bestVoice) {
                u.voice = bestVoice;
                console.log(`🔊 Browser TTS: ${bestVoice.name} (${bestVoice.lang})`);
            }

            u.rate = 0.95;
            u.pitch = 1.0;

            window.speechSynthesis.speak(u);
        }
    };

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onresult = (event: any) => {
                    let interimTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        interimTranscript += event.results[i][0].transcript;
                    }
                    setTranscript(interimTranscript);
                };

                recognition.onend = () => {
                    // Logic handled in stopPTT usually, but if it stops unexpectedly?
                    // We'll rely on explicit start/stop calls.
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    // Handle auto-scroll
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, transcript]);

    // Preload browser voices (they load asynchronously)
    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            // Trigger voice loading
            window.speechSynthesis.getVoices();
            // Some browsers fire this event when voices are ready
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }
    }, []);

    // Handle Quick Broadcast (from other panels)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (quickBroadcast) {
            handleFinalInput(quickBroadcast, 'mgr');
            onQuickBroadcastDone();
        }
    }, [quickBroadcast]);

    // 언어 변경 시 재송출 (원본 HTML의 selectLanguage 기능)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (reBroadcastTrigger > 0 && lastManagerKR) {
            // 마지막 관리자 메시지를 새 언어로 재번역 및 TTS
            handleFinalInput(lastManagerKR, 'mgr');
        }
    }, [reBroadcastTrigger]);

    const startPTT = (role: 'mgr' | 'wrk') => {
        if (isRecording || !recognitionRef.current) return;

        try {
            // Set Language
            // Mgr = Korean
            // Wrk = Target Lang (e.g., vi-VN)
            recognitionRef.current.lang = role === 'mgr' ? 'ko-KR' : currentLang;
            recognitionRef.current.start();

            setIsRecording(true);
            setRecordingRole(role);
            setTranscript("");

            // Start Timer
            setTimer(0);
            timerIntervalRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 100);

        } catch (e) {
            console.error('Recognition start error:', e);
            // 이미 시작된 상태이거나 다른 에러일 경우 리셋 시도
            setIsRecording(false);
        }
    };

    const stopPTT = () => {
        if (!isRecording || !recognitionRef.current) return;

        recognitionRef.current.stop();
        setIsRecording(false);

        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }

        // Process Final Input
        // Add a small delay to ensure final transcript is captured if needed, 
        // but usually onend or current transcript is enough.
        // Ideally we wait for 'onend' event but for responsiveness we use current state.
        if (transcript.trim()) {
            handleFinalInput(transcript, recordingRole!);
        }

        setRecordingRole(null);
        setTranscript("");
    };

    const handleFinalInput = async (text: string, role: 'mgr' | 'wrk') => {
        if (!text.trim()) return;

        if (role === 'mgr') {
            setLastSourceText(text);
            onLastManagerText(text); // 상위 컴포넌트에 저장 (재송출용)
        }

        const newMessage: Message = {
            id: Date.now(),
            text: text,
            role: role,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);

        // AI Call
        setAiStatus('PROCESSING');
        try {
            const isManager = role === 'mgr';
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    langName: currentLang,
                    isManager: isManager,
                    sourceLang: isManager ? 'ko-KR' : currentLang
                })
            });

            const data = await response.json();

            if (data.success) {
                // Add the response bubble
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    text: data.translation,
                    role: isManager ? 'wrk' : 'mgr',
                    verification: data.verification,
                    timestamp: new Date()
                }]);

                // Gemini TTS API 호출 (고품질 원어민 음성)
                const targetLangForTTS = isManager ? currentLang : 'ko-KR';
                await playGeminiTTS(data.translation, targetLangForTTS);

            } else {
                console.error(data.error);
                setAiStatus('DELAYED');
            }

        } catch (e) {
            console.error(e);
            setAiStatus('DELAYED');
        } finally {
            setAiStatus('READY');
        }
    };

    const formatTimer = (t: number) => {
        const m = Math.floor(t / 600).toString().padStart(2, '0');
        const s = Math.floor((t % 600) / 10).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="h-full flex flex-col p-4 relative">
            {/* 1. Header Area with Turbo Indicator & Voice Gender */}
            <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                    Target: {langLabel}
                </span>

                {/* Voice Gender 선택 */}
                <select
                    value={voiceGender}
                    onChange={(e) => onVoiceGenderChange(e.target.value as 'male' | 'female')}
                    className="bg-zinc-800 text-[10px] text-white px-2 py-1 rounded-lg border border-white/10 outline-none cursor-pointer"
                >
                    <option value="female">👩 여성</option>
                    <option value="male">👨 남성</option>
                </select>

                <div className="flex items-center space-x-1 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                    <span className="text-[9px] text-cyan-500 font-black uppercase">Turbo Active</span>
                </div>
            </div>

            {/* 2. Source Preview */}
            {lastSourceText && (
                <div className="mb-3 px-5 py-3 bg-[rgba(255,107,0,0.05)] rounded-2xl border border-orange-500/20 text-[11px] text-zinc-400 shadow-inner flex items-center">
                    <span className="text-orange-500 font-black mr-2 uppercase text-[9px] tracking-widest whitespace-nowrap">Last KR Source:</span>
                    <span className="font-medium italic truncate">{lastSourceText}</span>
                </div>
            )}

            {/* 3. Chat History */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto no-scrollbar rounded-2xl bg-[rgba(24,24,27,0.4)] border border-white/5 p-4 shadow-inner relative flex flex-col gap-3"
            >
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-[10px] text-zinc-700 uppercase font-black tracking-[0.3em] leading-relaxed select-none">
                            TAP TO SPEAK OR TYPE<br />REAL-TIME VERIFICATION MODE
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "max-w-[88%] p-4 rounded-[1.8rem] text-[14px] leading-relaxed relative shadow-lg border border-white/5 animate-in fade-in zoom-in-95 duration-300",
                            msg.role === 'mgr'
                                ? "self-end bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-br-sm"
                                : "self-start bg-zinc-800 text-white rounded-bl-sm"
                        )}
                    >
                        <div className="text-[9px] font-black opacity-50 mb-1 uppercase tracking-wider">
                            {msg.role === 'mgr' ? 'Manager' : `Worker (${langLabel})`}
                        </div>
                        {msg.text}

                        {/* Verification Box */}
                        {msg.verification && (
                            <div className="mt-3 text-[11px] text-slate-300 bg-black/20 rounded-xl p-3 border-l-2 border-cyan-400">
                                <span className="font-black text-[9px] uppercase tracking-tighter text-cyan-400 block mb-1">
                                    AI Verification (KO Check):
                                </span>
                                {msg.verification}
                            </div>
                        )}
                    </div>
                ))}

                {/* Recording Overlay */}
                {isRecording && (
                    <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center rounded-2xl p-6 border-2 border-red-500 animate-in fade-in duration-200">
                        <span className="text-4xl font-black text-red-500 mb-2 font-mono tracking-wider">{formatTimer(timer)}</span>
                        <div className="bg-red-600/20 text-red-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-red-500/50 animate-pulse">
                            Listening...
                        </div>

                        <div className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 mb-4 backdrop-blur">
                            <p className="text-center text-zinc-200 font-bold leading-relaxed min-h-[1.5em]">
                                {transcript || (recordingRole === 'mgr' ? "말씀하세요..." : "Listening...")}
                            </p>
                        </div>

                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-4">
                            TAP AGAIN TO STOP & PROCESS
                        </p>
                    </div>
                )}
            </div>

            {/* 4. Controls */}
            <div className="mt-4 space-y-4">
                {/* Text Input */}
                <div className="flex items-center gap-2 bg-zinc-900/80 border border-white/5 rounded-2xl p-2 px-3 shadow-inner focus-within:border-orange-500/50 transition-colors">
                    <input
                        type="text"
                        className="bg-transparent border-none text-white flex-1 outline-none text-sm font-medium placeholder-zinc-600"
                        placeholder="Direct Instruction Input..."
                        value={inputManagerText}
                        onChange={(e) => setInputManagerText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && inputManagerText.trim()) {
                                handleFinalInput(inputManagerText, 'mgr');
                                setInputManagerText("");
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            if (inputManagerText.trim()) {
                                handleFinalInput(inputManagerText, 'mgr');
                                setInputManagerText("");
                            }
                        }}
                        className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center hover:bg-orange-500 active:scale-95 transition-all text-white"
                    >
                        <span className="text-xs">▶</span>
                    </button>
                </div>

                {/* PTT Buttons */}
                <div className="grid grid-cols-2 gap-8 px-4">
                    <div className="flex flex-col items-center gap-3">
                        <button
                            className={cn(
                                "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-100 select-none touch-none",
                                "border-[6px] border-white/5 shadow-2xl",
                                recordingRole === 'mgr'
                                    ? "bg-red-500 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.4)] recording-ring"
                                    : recordingRole === 'wrk'
                                        ? "bg-zinc-700 opacity-50 cursor-not-allowed" // 다른 역할 녹음 중일 때 비활성화
                                        : "bg-orange-600 hover:bg-orange-500 active:scale-95 shadow-orange-900/40"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                if (recordingRole === 'wrk') return; // 다른 역할 녹음 중이면 무시
                                if (recordingRole === 'mgr') {
                                    stopPTT(); // 이미 녹음 중이면 중지
                                } else {
                                    startPTT('mgr'); // 녹음 시작
                                }
                            }}
                            onContextMenu={(e) => e.preventDefault()} // 우클릭/길게누르기 메뉴 방지
                        >
                            <span className="text-4xl filter drop-shadow-lg pointer-events-none">👨‍💼</span>
                        </button>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Manager (KR)</p>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <button
                            className={cn(
                                "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-100 select-none touch-none",
                                "border-[6px] border-white/5 shadow-2xl",
                                recordingRole === 'wrk'
                                    ? "bg-red-500 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.4)] recording-ring"
                                    : recordingRole === 'mgr'
                                        ? "bg-zinc-700 opacity-50 cursor-not-allowed" // 다른 역할 녹음 중일 때 비활성화
                                        : "bg-zinc-800 hover:bg-zinc-700 active:scale-95"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                if (recordingRole === 'mgr') return; // 다른 역할 녹음 중이면 무시
                                if (recordingRole === 'wrk') {
                                    stopPTT(); // 이미 녹음 중이면 중지
                                } else {
                                    startPTT('wrk'); // 녹음 시작
                                }
                            }}
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <span className="text-4xl filter drop-shadow-lg pointer-events-none">👷</span>
                        </button>
                        <p className="text-[10px] font-black text-cyan-500 uppercase tracking-tighter">Worker ({langLabel})</p>
                    </div>
                </div>
            </div>

            {/* AI Status */}
            <div className="mt-4 flex justify-between items-center px-4 py-3 bg-orange-500/5 rounded-xl border border-orange-500/10">
                <div className="flex items-center gap-2">
                    {aiStatus === 'PROCESSING' && <Loader2 className="w-3 h-3 text-orange-500 animate-spin" />}
                    <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        aiStatus === 'PROCESSING' ? "text-orange-500" : "text-zinc-600"
                    )}>
                        {aiStatus === 'READY' ? 'AI Ready' : aiStatus === 'PROCESSING' ? 'Processing...' : 'Delayed'}
                    </span>
                </div>
                <div className="flex items-center space-x-0.5 opacity-20">
                    <div className="w-0.5 h-2 bg-orange-500"></div>
                    <div className="w-0.5 h-3 bg-orange-500"></div>
                    <div className="w-0.5 h-1.5 bg-orange-500"></div>
                </div>
            </div>
        </div>
    );
}
