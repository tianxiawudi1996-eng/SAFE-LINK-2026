"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, X, Send, Volume2 } from 'lucide-react';

interface PrivateChatModalProps {
    workerName: string;
    workerId?: string;
    workerCountry: string;
    onClose: () => void;
    voiceGender?: 'male' | 'female';
    onVoiceGenderChange?: (gender: 'male' | 'female') => void;
}

interface Message {
    id: string;
    text: string;
    original?: string | null;
    pronunciation?: string | null;
    role: 'worker' | 'manager';
    timestamp: string;
}

export default function PrivateChatModal({
    workerName,
    workerId,
    workerCountry,
    onClose,
    voiceGender = 'male',
    onVoiceGenderChange
}: PrivateChatModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 🔊 TTS Playback Logic
    const playTTS = useCallback(async (text: string, langCode: string) => {
        if (!text) return;
        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, langCode, gender: voiceGender })
            });
            const data = await res.json();
            if (data.audioContent) {
                if (audioRef.current) audioRef.current.pause();
                const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
                audioRef.current = audio;
                audio.play().catch(e => console.warn("Playback blocked:", e));
            }
        } catch (e) {
            console.error("TTS Error:", e);
        }
    }, [voiceGender]);

    const getLangInfo = (country: string) => {
        const map: Record<string, { code: string; label: string }> = {
            'Vietnam': { code: 'vi-VN', label: 'Vietnamese' },
            'China': { code: 'zh-CN', label: 'Chinese' },
            'Uzbekistan': { code: 'uz-UZ', label: 'Uzbek' },
            'Thailand': { code: 'th-TH', label: 'Thai' },
            'Russia': { code: 'ru-RU', label: 'Russian' },
            'Mongolia': { code: 'mn-MN', label: 'Mongolian' },
            'Cambodia': { code: 'km-KH', label: 'Khmer' },
            'UK': { code: 'en-US', label: 'English' },
            'Korea': { code: 'ko-KR', label: 'Korean' },
        };
        return map[country] || { code: 'zh-CN', label: 'Chinese' };
    };

    // 메시지 불러오기 (폴링)
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const params = new URLSearchParams();
                if (workerName) params.append('workerName', workerName);
                if (workerId) params.append('workerId', workerId);

                const res = await fetch(`/api/worker/message?${params.toString()}`);
                const data = await res.json();

                if (data.success && Array.isArray(data.messages)) {
                    const formattedMsgs = data.messages.map((msg: any) => ({
                        id: msg.id,
                        text: (msg.senderRole === 'manager' ? msg.originalText : msg.translatedText) || msg.originalText || "...",
                        original: (msg.senderRole === 'manager' ? msg.translatedText : msg.originalText) || "",
                        pronunciation: msg.senderRole === 'worker' ? msg.pronunciation : null,
                        role: msg.senderRole,
                        timestamp: msg.createdAt
                    }));
                    setMessages(formattedMsgs);
                }
            }
            catch (e) {
                console.error(e);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [workerId, workerName]);

    // 스크롤 자동 이동
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 메시지 전송 (관리자 -> 근로자)
    const handleSend = async () => {
        if (!inputText.trim()) return;
        setIsSending(true);

        const countryToLang: Record<string, string> = {
            'Vietnam': 'Vietnamese', 'Uzbekistan': 'Uzbek', 'China': 'Chinese',
            'Mongolia': 'Mongolian', 'Cambodia': 'Khmer', 'Thailand': 'Thai',
            'Russia': 'Russian', 'Korea': 'Korean'
        };
        const targetLang = countryToLang[workerCountry] || 'Chinese';

        try {
            const res = await fetch('/api/worker/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workerName,
                    workerId,
                    workerCountry,
                    workerLanguage: targetLang,
                    message: inputText,
                    senderRole: 'manager'
                })
            });

            const data = await res.json();

            if (data.success) {
                const newMsg: Message = {
                    id: data.message.id || `sent-${Date.now()}`,
                    text: inputText,
                    original: data.message.translatedText || "",
                    role: 'manager',
                    timestamp: new Date().toISOString()
                };

                setMessages(prev => {
                    if (prev.some(m => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });
                setInputText('');

                if (data.message.translatedText) {
                    const langInfo = getLangInfo(workerCountry);
                    playTTS(data.message.translatedText, langInfo.code);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                {/* 헤더 */}
                <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-sm">
                            👷
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">{workerName}와의 대화</h3>
                            <p className="text-[10px] text-slate-400">{workerCountry}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onVoiceGenderChange && onVoiceGenderChange(voiceGender === 'male' ? 'female' : 'male')}
                            title="음성 성별 변경 (남성/여성)"
                            className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px] px-2 py-1 rounded-md border border-slate-600 transition-colors flex items-center gap-1"
                        >
                            {voiceGender === 'male' ? '👨 남성' : '👩 여성'}
                        </button>
                        <button onClick={onClose} title="닫기" className="p-1.5 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* 메시지 영역 */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-900/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'manager' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-2.5 rounded-xl ${msg.role === 'manager'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-slate-700 text-white rounded-bl-none'
                                }`}>
                                <div className="flex justify-between items-start gap-3">
                                    <p className="text-xs">{msg.text}</p>
                                    <button
                                        aria-label="Play original message"
                                        title="원본 재생"
                                        onClick={() => {
                                            const langCode = msg.role === 'manager' ? getLangInfo(workerCountry).code : 'ko-KR';
                                            playTTS(msg.text, langCode);
                                        }}
                                        className="opacity-40 hover:opacity-100 transition-opacity"
                                    >
                                        <Volume2 size={12} />
                                    </button>
                                </div>
                                {msg.original && (
                                    <div className="mt-1.5 pt-1.5 border-t border-white/10 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[9px] text-white/40 uppercase tracking-tighter">
                                                {msg.role === 'manager' ? 'Translation:' : 'Original:'}
                                            </p>
                                            <button
                                                aria-label="Play translated message"
                                                title="번역 재생"
                                                onClick={() => {
                                                    const langCode = msg.role === 'manager' ? 'ko-KR' : getLangInfo(workerCountry).code;
                                                    playTTS(msg.original || "", langCode);
                                                }}
                                                className="opacity-30 hover:opacity-100"
                                            >
                                                <Volume2 size={10} />
                                            </button>
                                        </div>
                                        <p className="text-[11px] text-white/70 font-medium italic">{msg.original}</p>

                                        {msg.role === 'worker' && msg.pronunciation && (
                                            <>
                                                <p className="text-[9px] text-orange-400 uppercase tracking-tighter mt-1.5">Pronunciation (Hangul):</p>
                                                <p className="text-xs text-orange-200 font-bold bg-orange-950/30 px-1.5 py-0.5 rounded">
                                                    {msg.pronunciation}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                                <p className="text-[9px] text-white/50 text-right mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 입력 영역 */}
                <div className="p-3 bg-slate-800 border-t border-slate-700">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-xs"
                            placeholder="메시지를 입력하세요..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            aria-label="Send message"
                            title="전송"
                            onClick={handleSend}
                            disabled={isSending || !inputText.trim()}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isSending ? <Loader2 className="animate-spin w-4 h-4" /> : <Send size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
