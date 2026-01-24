'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Signature {
    id: string;
    workerName: string;
    timestamp: string;
}

interface WorkerMessage {
    id: string;
    workerName: string;
    workerCountry: string;
    workerLanguage: string;
    originalText: string;
    translatedText: string;
    isRead: boolean;
    isUrgent: boolean;
    createdAt: string;
}

// 국가 코드 → 국기 매핑
const countryToFlag: Record<string, string> = {
    'VN': '🇻🇳', 'CN': '🇨🇳', 'TH': '🇹🇭', 'NP': '🇳🇵', 'KH': '🇰🇭',
    'UZ': '🇺🇿', 'PH': '🇵🇭', 'ID': '🇮🇩', 'MM': '🇲🇲', 'MN': '🇲🇳',
    'LK': '🇱🇰', 'BD': '🇧🇩', 'RU': '🇷🇺', 'US': '🇺🇸', 'EN': '🇺🇸',
};

export default function ManagerDashboard() {
    const router = useRouter();
    const [instruction, setInstruction] = useState('');
    const [signedCount, setSignedCount] = useState(0);
    const [signatures, setSignatures] = useState<Signature[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    });

    // 근로자 메시지
    const [workerMessages, setWorkerMessages] = useState<WorkerMessage[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showMessages, setShowMessages] = useState(false);

    // 보안 검사 (Client-side)
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            router.push('/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'manager') {
                showToast('⛔ 접근 권한이 없습니다.', 'error');
                router.push('/login');
            }
        } catch (e) {
            router.push('/login');
        }
    }, [router]);

    // 토스트 메시지 표시
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // 현황 폴링 (3초마다)
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/tbm/status');
                const data = await res.json();
                if (data.success && data.session) {
                    setCurrentSessionId(data.session.id);
                    setSignedCount(data.signedCount);
                    setSignatures(data.signatures || []);
                }
            } catch (error) {
                console.error('현황 조회 오류:', error);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    // 근로자 메시지 폴링 (5초마다)
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch('/api/worker/message');
                const data = await res.json();
                if (data.success) {
                    setWorkerMessages(data.messages || []);
                    setUnreadCount(data.unreadCount || 0);
                }
            } catch (error) {
                console.error('메시지 조회 오류:', error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    const [messageHistory, setMessageHistory] = useState<{ id: string, text: string, sentAt: string }[]>([]);
    const [isListening, setIsListening] = useState(false);

    // 음성 인식 (Web Speech API)
    const toggleVoiceInput = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showToast('❌ 이 브라우저는 음성 인식을 지원하지 않습니다.', 'error');
            return;
        }

        if (isListening) {
            showToast('⏹ 음성 인식 중지', 'success');
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.continuous = false; // 한 문장씩
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
            showToast('🎤 말씀하세요...', 'success');
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInstruction((prev) => prev ? prev + ' ' + transcript : transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error(event.error);
            setIsListening(false);
            showToast('❌ 음성 인식 실패', 'error');
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const startTBM = async () => {
        if (!instruction.trim()) {
            showToast('❌ 지시사항을 입력해주세요.', 'error');
            return;
        }

        setIsSending(true);
        try {
            const res = await fetch('/api/tbm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instruction: instruction.trim() }),
            });

            const data = await res.json();

            if (data.success) {
                setCurrentSessionId(data.session.id);
                setSignedCount(0);
                setSignatures([]);

                // 보낸 메시지 기록 추가
                setMessageHistory(prev => [{
                    id: Date.now().toString(),
                    text: instruction.trim(),
                    sentAt: new Date().toLocaleTimeString()
                }, ...prev]);

                showToast('✅ TBM 지시사항이 전송되었습니다!', 'success');
                setInstruction('');
            } else {
                showToast(`❌ 오류: ${data.error}`, 'error');
            }
        } catch (error) {
            console.error('TBM 전송 오류:', error);
            showToast('❌ TBM 전송에 실패했습니다.', 'error');
        } finally {
            setIsSending(false);
        }
    };

    const goToInterpreter = () => {
        router.push('/');
    };

    const downloadReport = () => {
        showToast('📄 리포트 다운로드 기능은 추후 구현 예정입니다.', 'success');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
            {/* 토스트 알림 */}
            {toast.show && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg transition-all animate-pulse ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                    {toast.message}
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">🛡️ SAFE-LINK 관제 센터</h1>
                        <p className="text-slate-400">TBM 전자서명 & 양방향 통역 시스템</p>
                    </div>

                    <div className="flex gap-3">
                        {/* 근로자 메시지 버튼 */}
                        <button
                            onClick={() => setShowMessages(!showMessages)}
                            className={`relative px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${showMessages
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-600/20 border border-blue-500/50 text-blue-400 hover:bg-blue-600/30'
                                }`}
                        >
                            💬 근로자 메시지
                            {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* 통역 모드 진입 버튼 */}
                        <button
                            onClick={goToInterpreter}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                        >
                            🎤 통역 모드
                        </button>
                    </div>
                </div>

                {/* 근로자 메시지 패널 */}
                {showMessages && (
                    <div className="mb-6 bg-blue-500/10 backdrop-blur p-6 rounded-2xl border border-blue-500/30">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            💬 근로자 메시지 (실시간 번역)
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                                    {unreadCount}개 새 메시지
                                </span>
                            )}
                        </h2>

                        {workerMessages.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">아직 수신된 메시지가 없습니다.</p>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {workerMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`p-4 rounded-xl ${msg.isUrgent
                                            ? 'bg-red-500/20 border border-red-500/50'
                                            : 'bg-white/5 border border-white/10'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">
                                                    {countryToFlag[msg.workerCountry] || '🌍'}
                                                </span>
                                                <span className="text-white font-medium">{msg.workerName}</span>
                                                {msg.isUrgent && (
                                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                        🚨 긴급
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-slate-500 text-xs">
                                                {new Date(msg.createdAt).toLocaleString('ko-KR')}
                                            </span>
                                        </div>

                                        {/* 번역된 메시지 (한국어) */}
                                        <div className="bg-white/10 p-3 rounded-lg mb-2">
                                            <p className="text-white text-lg">{msg.translatedText}</p>
                                        </div>

                                        {/* 원본 메시지 */}
                                        <div className="text-slate-500 text-sm">
                                            원문 ({msg.workerLanguage}): {msg.originalText}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* 작업 지시 패널 */}
                    <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            📢 작업 지시 (TBM)
                        </h2>
                        <div className="relative">
                            <textarea
                                className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl resize-none text-white placeholder-slate-400 focus:outline-none focus:border-orange-500/50 pr-12"
                                placeholder="오늘의 위험 요인과 안전 수칙을 입력하세요...&#10;&#10;예: 오늘 201동 외벽 작업, 안전고리 필수!"
                                value={instruction}
                                onChange={(e) => setInstruction(e.target.value)}
                            />
                            {/* 음성 입력 버튼 (텍스트 영역 내부 우측 상단) */}
                            <button
                                onClick={toggleVoiceInput}
                                className={`absolute top-2 right-2 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
                                title="음성 입력"
                            >
                                {isListening ? '⏹' : '🎤'}
                            </button>
                        </div>

                        <button
                            onClick={startTBM}
                            disabled={isSending}
                            className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSending ? '📤 전송 중...' : '🚀 지시사항 전송'}
                        </button>

                        {/* Recent History */}
                        {messageHistory.length > 0 && (
                            <div className="mt-6 border-t border-white/10 pt-4">
                                <h3 className="text-sm font-bold text-slate-400 mb-3">🕒 최근 지시 이력</h3>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {messageHistory.map((hist) => (
                                        <div key={hist.id} className="bg-white/5 p-3 rounded-lg text-sm group">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-orange-400 font-bold text-xs">TBM 지시사항</span>
                                                <span className="text-slate-500 text-xs">{hist.sentAt}</span>
                                            </div>
                                            <p className="text-slate-300">{hist.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 실시간 서명 현황 */}
                    <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            📊 실시간 서명 현황
                        </h2>

                        <div className="text-center py-6 mb-4">
                            <span className="text-6xl font-black text-green-400">{signedCount}</span>
                            <span className="text-slate-400 ml-2 text-xl">명 완료</span>
                        </div>

                        {/* 서명자 목록 */}
                        {signatures.length > 0 && (
                            <div className="max-h-32 overflow-y-auto mb-4 space-y-2">
                                {signatures.map((sig) => (
                                    <div key={sig.id} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg text-sm">
                                        <span className="text-white font-medium">✅ {sig.workerName}</span>
                                        <span className="text-slate-400 text-xs">
                                            {new Date(sig.timestamp).toLocaleTimeString('ko-KR')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={downloadReport}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl text-sm transition-colors"
                        >
                            📄 법적 증빙 리포트(PDF) 다운로드
                        </button>
                    </div>
                </div>

                {/* 현재 세션 정보 */}
                {currentSessionId && (
                    <div className="mt-6 bg-green-500/10 p-4 rounded-xl border border-green-500/30">
                        <p className="text-green-400 text-sm">
                            ✅ 현재 활성 세션: <span className="font-mono">{currentSessionId}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
