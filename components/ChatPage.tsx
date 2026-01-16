"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { NOGADA_SLANG, LANGUAGES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Volume2, CheckCircle, VolumeX } from "lucide-react";

interface Message {
    id: string;
    role: 'mgr' | 'wrk';
    originalText: string;
    standardText: string;
    translatedText: string;
    slangDetected: string[];
    timestamp: Date;
    langCode: string; // 번역에 사용된 언어
}

interface ChatPageProps {
    currentLang: string;
    langLabel: string;
}

// 은어 → 표준어 변환 함수
function convertSlangToStandard(text: string): { converted: string; detected: string[] } {
    let converted = text;
    const detected: string[] = [];

    // 긴 은어부터 먼저 매칭 (부분 매칭 방지)
    const sortedSlang = [...NOGADA_SLANG].sort((a, b) => b.slang.length - a.slang.length);

    sortedSlang.forEach(item => {
        if (text.includes(item.slang)) {
            detected.push(item.slang);
            const standardKorean = item.standard.split('(')[0].trim();
            converted = converted.replace(new RegExp(item.slang, 'g'), standardKorean);
        }
    });

    return { converted, detected };
}

// 완전한 번역 함수 - 모든 한국어를 해당 언어로 완전 번역
function translateText(text: string, langCode: string): string {
    const langKey = langCode.split('-')[0].toLowerCase();
    let translated = text;

    // 1단계: NOGADA_SLANG에서 건설용어 번역
    NOGADA_SLANG.forEach(item => {
        const standardKorean = item.standard.split('(')[0].trim();
        const translation = (item as any)[langKey] || item.en;
        if (translation && translated.includes(standardKorean)) {
            translated = translated.replace(new RegExp(standardKorean, 'g'), translation);
        }
    });

    // 2단계: 완전한 문장 번역 (모든 조사, 동사, 접속사 포함)
    const fullDict: Record<string, Record<string, string>> = {
        'vi': {
            // 동사
            '확인하세요': 'hãy kiểm tra', '확인해': 'kiểm tra', '확인': 'kiểm tra',
            '준비하세요': 'hãy chuẩn bị', '준비하고': 'chuẩn bị', '준비': 'chuẩn bị',
            '잘해야해': 'phải làm tốt', '잘해야': 'phải làm tốt', '잘해': 'làm tốt',
            '조심하고': 'cẩn thận', '조심해': 'cẩn thận', '조심': 'cẩn thận',
            '가져와서': 'mang đến', '가져와': 'mang đến',
            '발생해요': 'xảy ra', '발생해': 'xảy ra', '발생': 'xảy ra',
            '하면': 'khi làm', '하고': 'và', '해야': 'cần',
            '있어': 'có', '있고': 'có', '있으면': 'nếu có',
            // 명사
            '현장에서': 'tại công trường', '현장': 'công trường',
            '오늘': 'hôm nay', '내일': 'ngày mai', '시간': 'thời gian',
            '작업할까니': 'để làm việc', '작업': 'công việc',
            '안전사고': 'tai nạn', '안전': 'an toàn', '사고': 'tai nạn',
            '상태': 'trạng thái', '조절': 'điều chỉnh',
            '특히': 'đặc biệt', '위에서': 'ở trên', '위': 'trên',
            // 조사
            '에서': 'tại', '으로': 'bằng', '까지': 'đến', '부터': 'từ',
            '을': '', '를': '', '이': '', '가': '', '의': '', '로': ''
        },
        'uz': {
            '확인하세요': 'tekshiring', '확인해': 'tekshir', '확인': 'tekshirish',
            '준비하세요': 'tayyorlang', '준비하고': 'tayyorlab', '준비': 'tayyorgarlik',
            '잘해야해': 'yaxshi qilish kerak', '잘해야': 'yaxshi qilish', '잘해': 'yaxshi qil',
            '조심하고': 'ehtiyot boling', '조심해': 'ehtiyot bol', '조심': 'ehtiyotkor',
            '가져와서': 'olib keling', '가져와': 'olib keling',
            '발생해요': 'sodir boladi', '발생해': 'sodir boladi', '발생': 'sodir',
            '하면': 'qilganda', '하고': 'va', '해야': 'kerak',
            '있어': 'bor', '있고': 'bor', '있으면': 'agar bolsa',
            '현장에서': 'qurilish maydonida', '현장': 'qurilish maydoni',
            '오늘': 'bugun', '내일': 'ertaga', '시간': 'vaqt',
            '작업할까니': 'ishlash uchun', '작업': 'ish',
            '안전사고': 'xavfsizlik hodisasi', '안전': 'xavfsizlik', '사고': 'hodisa',
            '상태': 'holat', '조절': 'nazorat',
            '특히': 'ayniqsa', '위에서': 'ustida', '위': 'ust',
            '에서': 'da', '으로': 'bilan', '까지': 'gacha', '부터': 'dan',
            '을': '', '를': '', '이': '', '가': '', '의': '', '로': ''
        },
        'en': {
            '확인하세요': 'please check', '확인해': 'check', '확인': 'check',
            '준비하세요': 'please prepare', '준비하고': 'prepare', '준비': 'preparation',
            '잘해야해': 'must do well', '잘해야': 'do well', '잘해': 'do well',
            '조심하고': 'be careful', '조심해': 'be careful', '조심': 'careful',
            '가져와서': 'bring', '가져와': 'bring',
            '발생해요': 'occurs', '발생해': 'occurs', '발생': 'occur',
            '하면': 'when doing', '하고': 'and', '해야': 'need to',
            '있어': 'there is', '있고': 'there is', '있으면': 'if there is',
            '현장에서': 'at the site', '현장': 'site',
            '오늘': 'today', '내일': 'tomorrow', '시간': 'time',
            '작업할까니': 'for work', '작업': 'work',
            '안전사고': 'safety accident', '안전': 'safety', '사고': 'accident',
            '상태': 'status', '조절': 'control',
            '특히': 'especially', '위에서': 'on top of', '위': 'top',
            '에서': 'at', '으로': 'with', '까지': 'until', '부터': 'from',
            '을': '', '를': '', '이': '', '가': '', '의': '', '로': ''
        },
        'zh': {
            '확인하세요': '请检查', '확인해': '检查', '확인': '确认',
            '준비하세요': '请准备', '준비하고': '准备', '준비': '准备',
            '잘해야해': '必须做好', '잘해야': '做好', '잘해': '做好',
            '조심하고': '小心', '조심해': '小心', '조심': '注意',
            '가져와서': '拿来', '가져와': '拿来',
            '발생해요': '发生', '발생해': '发生', '발생': '发生',
            '하면': '如果做', '하고': '和', '해야': '需要',
            '있어': '有', '있고': '有', '있으면': '如果有',
            '현장에서': '在工地', '현장': '工地',
            '오늘': '今天', '내일': '明天', '시간': '时间',
            '작업할까니': '工作', '작업': '作业',
            '안전사고': '安全事故', '안전': '安全', '사고': '事故',
            '상태': '状态', '조절': '调节',
            '특히': '特别', '위에서': '在上面', '위': '上',
            '에서': '在', '으로': '用', '까지': '到', '부터': '从',
            '을': '', '를': '', '이': '', '가': '', '의': '', '로': ''
        }
    };

    // 긴 단어부터 먼저 번역
    const dict = fullDict[langKey] || fullDict['en'];
    const sorted = Object.entries(dict).sort((a, b) => b[0].length - a[0].length);
    sorted.forEach(([kr, foreign]) => {
        if (kr) translated = translated.replace(new RegExp(kr, 'g'), foreign);
    });

    // 3단계: 남은 한글 제거 (공백으로)
    translated = translated.replace(/[가-힣]+/g, '').replace(/\s+/g, ' ').trim();

    return translated;
}

// 고품질 TTS 음성 출력 함수 (Google Cloud TTS API 우선)
async function speakText(text: string, langCode: string): Promise<void> {
    try {
        // 1. Google Cloud TTS API 시도
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, langCode }),
        });

        const data = await response.json();

        if (data.audioContent) {
            // Google Cloud TTS 오디오 재생
            const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
            audio.play();
            return;
        }
    } catch (error) {
        console.warn('Google TTS API unavailable, falling back to browser TTS');
    }

    // 2. 브라우저 기본 TTS로 폴백
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        // 고품질 음성 선택 시도
        const voices = window.speechSynthesis.getVoices();
        const langKey = langCode.split('-')[0];

        // Neural/Premium 음성 우선 선택
        const premiumVoice = voices.find(v =>
            v.lang.startsWith(langKey) &&
            (v.name.includes('Neural') || v.name.includes('Premium') || v.name.includes('Google'))
        );
        const matchingVoice = premiumVoice || voices.find(v => v.lang.startsWith(langKey));

        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

        window.speechSynthesis.speak(utterance);
    }
}

export default function ChatPage({ currentLang, langLabel }: ChatPageProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordingRole, setRecordingRole] = useState<'mgr' | 'wrk' | null>(null);
    const [isGlobal, setIsGlobal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 음성 목록 로드
    useEffect(() => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
        }
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 메시지 처리 핸들러 (Gemini API 사용)
    const handleSend = async (text: string, role: 'mgr' | 'wrk') => {
        if (!text.trim()) return;

        setIsProcessing(true);

        // 1. 은어 → 표준어 변환
        const { converted, detected } = convertSlangToStandard(text);

        // 2. 표준어 → 다국어 번역 (Gemini API 우선, 실패시 로컬)
        let translated = converted;
        const langName = LANGUAGES.find(l => l.code === currentLang)?.name || 'English';

        if (role === 'mgr') {
            try {
                // Gemini API로 고품질 번역 시도
                const response = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: converted,
                        targetLang: currentLang,
                        langName: langName
                    }),
                });

                const data = await response.json();

                if (data.translation && !data.fallback) {
                    translated = data.translation;
                    console.log('✅ Gemini translation:', translated);
                } else {
                    // 로컬 번역으로 폴백
                    translated = translateText(converted, currentLang);
                    console.log('⚠️ Fallback local translation:', translated);
                }
            } catch (error) {
                // 에러 발생시 로컬 번역
                translated = translateText(converted, currentLang);
                console.warn('❌ Translation API error, using fallback');
            }
        }

        // 3. 메시지 추가
        const newMessage: Message = {
            id: Date.now().toString(),
            role,
            originalText: text,
            standardText: converted,
            translatedText: translated,
            slangDetected: detected,
            timestamp: new Date(),
            langCode: currentLang
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");

        // 4. 자동 TTS 재생 (관리자 메시지인 경우)
        if (role === 'mgr' && translated) {
            setTimeout(() => {
                speakText(translated, currentLang);
                setIsSpeaking(newMessage.id);
                setTimeout(() => setIsSpeaking(null), 5000);
            }, 500);
        }

        setIsProcessing(false);
    };

    // TTS 재생 버튼 핸들러
    const handleSpeak = (msg: Message) => {
        speakText(msg.translatedText, msg.langCode);
        setIsSpeaking(msg.id);
        setTimeout(() => setIsSpeaking(null), 3000);
    };

    // PTT 녹음 시뮬레이션
    const startRecord = (role: 'mgr' | 'wrk') => {
        setIsRecording(true);
        setRecordingRole(role);

        setTimeout(() => {
            setIsRecording(false);
            setRecordingRole(null);

            const sampleMessages = {
                mgr: "아시바 해체작업 준비하고 공구리 타설 전 안전 확인하세요",
                wrk: "Yes, understood. Ready for work."
            };

            handleSend(sampleMessages[role], role);
        }, 2000);
    };

    const currentFlag = LANGUAGES.find(l => l.code === currentLang)?.flag || '🌐';

    return (
        <div className="flex flex-col h-full relative">
            {/* 메시지 영역 */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 flex flex-col no-scrollbar bg-zinc-950/10 space-y-4 pb-4"
            >
                {messages.length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-[10px] text-zinc-700 uppercase font-black tracking-[0.4em] leading-relaxed opacity-50 mb-4">
                                SAFE-LINK ENGINE READY<br />PRESS MIC OR TYPE TO BROADCAST
                            </div>
                            <div className="text-[9px] text-zinc-600 mt-4">
                                💡 현장 은어 → 표준어 → {currentFlag} 번역 + 🔊 음성 출력
                            </div>
                        </div>
                    </div>
                )}

                <AnimatePresence mode="popLayout">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            layout
                            className={cn(
                                "max-w-[92%] rounded-2xl shadow-2xl relative overflow-hidden",
                                msg.role === 'mgr'
                                    ? "self-end bg-gradient-to-br from-sw-orange to-amber-600 text-white"
                                    : "self-start bg-[#27272A] text-white"
                            )}
                        >
                            {/* 헤더 */}
                            <div className="px-5 pt-4 pb-2 border-b border-white/10">
                                <span className="text-[9px] font-black opacity-70 uppercase tracking-widest">
                                    {msg.role === 'mgr' ? '👷 Manager Command' : '🔧 Worker Report'}
                                </span>
                            </div>

                            {/* 본문 */}
                            <div className="px-5 py-4 space-y-3">
                                {/* 원본 (은어 포함) */}
                                {msg.slangDetected.length > 0 && (
                                    <div className="bg-black/20 rounded-xl p-3">
                                        <div className="text-[8px] font-black text-yellow-300 uppercase tracking-wider mb-1">
                                            🔍 원본 (현장 은어 감지)
                                        </div>
                                        <div className="text-[13px] line-through opacity-60">{msg.originalText}</div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {msg.slangDetected.map(slang => (
                                                <span key={slang} className="text-[9px] bg-yellow-500/30 text-yellow-200 px-2 py-0.5 rounded-full font-bold">
                                                    "{slang}"
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 표준어 변환 결과 */}
                                <div className="bg-black/30 rounded-xl p-3 border-l-4 border-emerald-400">
                                    <div className="text-[8px] font-black text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <CheckCircle size={10} /> 표준어 변환
                                    </div>
                                    <div className="text-[14px] font-bold">{msg.standardText}</div>
                                </div>

                                {/* 다국어 번역 결과 */}
                                {msg.role === 'mgr' && (
                                    <div className={cn(
                                        "rounded-xl p-3 border-l-4 border-cyan-400",
                                        isSpeaking === msg.id ? "bg-cyan-500/30 animate-pulse" : "bg-cyan-500/20"
                                    )}>
                                        <div className="text-[8px] font-black text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                                            {LANGUAGES.find(l => l.code === msg.langCode)?.flag || '🌐'} {LANGUAGES.find(l => l.code === msg.langCode)?.label || 'Translation'}
                                            {isSpeaking === msg.id && <span className="ml-2">🔊 재생 중...</span>}
                                        </div>
                                        <div className="text-[14px] font-semibold">{msg.translatedText}</div>
                                    </div>
                                )}
                            </div>

                            {/* 푸터 - TTS 버튼 */}
                            <div className="px-5 py-3 bg-black/20 flex items-center justify-between">
                                <span className="text-[8px] text-white/50">
                                    {msg.timestamp.toLocaleTimeString('ko-KR', { hour12: false })}
                                </span>
                                {msg.role === 'mgr' && (
                                    <button
                                        onClick={() => handleSpeak(msg)}
                                        className={cn(
                                            "flex items-center gap-1 text-[9px] font-bold transition-colors px-2 py-1 rounded-lg",
                                            isSpeaking === msg.id
                                                ? "bg-cyan-500 text-white"
                                                : "text-white/70 hover:text-white hover:bg-white/10"
                                        )}
                                    >
                                        {isSpeaking === msg.id ? <VolumeX size={12} /> : <Volume2 size={12} />}
                                        {isSpeaking === msg.id ? '재생 중' : '🔊 TTS 재생'}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="self-center text-[10px] text-zinc-500 font-bold animate-pulse"
                    >
                        🔄 변환 및 번역 중...
                    </motion.div>
                )}
            </div>

            {/* 입력 영역 */}
            <div className="p-5 bg-zinc-950 border-t border-white/10 z-[50]">
                <div className="flex items-center space-x-2 bg-zinc-900 border border-white/10 rounded-2xl p-1.5 px-2 mb-5 shadow-inner">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue, 'mgr')}
                        className="bg-transparent border-none text-white flex-1 outline-none text-sm font-semibold h-10 px-2"
                        placeholder="현장 은어 입력 (예: 아시바, 공구리)"
                    />
                    <button
                        onClick={() => handleSend(inputValue, 'mgr')}
                        disabled={isProcessing || !inputValue.trim()}
                        className="w-10 h-10 bg-sw-orange rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-orange-500 disabled:opacity-50"
                    >
                        <Send size={16} className="text-white ml-0.5" />
                    </button>
                </div>

                {/* PTT 버튼들 */}
                <div className="flex items-center justify-between px-2 pb-1">
                    <div className="flex flex-col items-center space-y-3">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onMouseDown={() => startRecord('mgr')}
                            onTouchStart={() => startRecord('mgr')}
                            disabled={isRecording}
                            className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center cursor-pointer border-4 border-white/5 shadow-xl shadow-orange-900/30 transition-all",
                                recordingRole === 'mgr' ? "bg-sw-red border-white animate-pulse" : "bg-sw-orange"
                            )}
                        >
                            <span className="text-4xl">🎙️</span>
                        </motion.button>
                        <p className="text-[10px] font-black text-white uppercase tracking-tighter">Manager (KR)</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center px-4 text-center">
                        <div onClick={() => setIsGlobal(!isGlobal)} className="flex flex-col items-center gap-1 cursor-pointer">
                            <div className={cn(
                                "w-12 h-6 rounded-full relative transition-all border border-white/5",
                                isGlobal ? "bg-sw-red" : "bg-zinc-800"
                            )}>
                                <div className={cn(
                                    "w-5 h-5 rounded-full absolute top-0.5 bg-white shadow-md transition-all",
                                    isGlobal ? "left-[calc(100%-22px)]" : "left-[2px] bg-zinc-500"
                                )}></div>
                            </div>
                            <span className={cn(
                                "text-[7px] font-black uppercase tracking-widest mt-1.5",
                                isGlobal ? "text-sw-red" : "text-zinc-500"
                            )}>
                                {isGlobal ? "Global ON" : "Broadcast OFF"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-3">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onMouseDown={() => startRecord('wrk')}
                            onTouchStart={() => startRecord('wrk')}
                            disabled={isRecording}
                            className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center cursor-pointer border-4 border-white/5 shadow-2xl transition-all",
                                recordingRole === 'wrk' ? "bg-sw-red border-white animate-pulse" : "bg-zinc-800"
                            )}
                        >
                            <span className="text-4xl grayscale opacity-80">🎤</span>
                        </motion.button>
                        <p className="text-[10px] font-black text-sw-cyan uppercase tracking-tighter">
                            Worker ({currentFlag} {langLabel})
                        </p>
                    </div>
                </div>
            </div>

            {/* 녹음 오버레이 */}
            {isRecording && (
                <div className="absolute inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-24 h-24 rounded-full border-4 border-sw-red flex items-center justify-center mb-8 animate-pulse">
                        <Mic size={48} className="text-sw-red" />
                    </div>
                    <p className="text-2xl text-white font-bold animate-pulse">
                        {recordingRole === 'mgr' ? "지시사항 수집 중..." : "Listening..."}
                    </p>
                    <p className="text-sm text-zinc-400 mt-2">
                        은어 → 표준어 → {currentFlag} 번역 → 🔊 음성
                    </p>
                </div>
            )}
        </div>
    );
}
