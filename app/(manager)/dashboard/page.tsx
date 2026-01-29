'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrivateChatModal from '@/components/PrivateChatModal';

interface WorkerStatus {
    workerName: string;
    workerId: string;
    workerCountry: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

// ... imports

interface Signature {
    id: string;
    workerName: string;
    timestamp: string;
}

interface TBMHistory {
    id: string;
    text: string;
    sentAt: string;
}

const countryToFlag: Record<string, string> = {
    'Vietnam': '🇻🇳', 'Uzbekistan': '🇺🇿', 'China': '🇨🇳',
    'Mongolia': '🇲🇳', 'Cambodia': '🇰🇭', 'Thailand': '🇹🇭',
    'Russia': '🇷🇺', 'Korea': '🇰🇷', 'Unknown': '🌍'
};

export default function ManagerDashboard() {
    const router = useRouter();
    const [instruction, setInstruction] = useState('');
    const [signedCount, setSignedCount] = useState(0);
    const [signatures, setSignatures] = useState<Signature[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);

    // TBM History & Voice
    const [isListening, setIsListening] = useState(false);
    const [messageHistory, setMessageHistory] = useState<TBMHistory[]>([]);

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    });

    const [workerList, setWorkerList] = useState<WorkerStatus[]>([]);
    const [selectedWorker, setSelectedWorker] = useState<WorkerStatus | null>(null);
    const [totalUnread, setTotalUnread] = useState(0);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    // 📩 Polling for workers and unread count
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/worker/message?listWorkers=true');
                const data = await res.json();
                if (data.success && Array.isArray(data.workers)) {
                    setWorkerList(data.workers);
                    const unread = data.workers.reduce((acc: number, curr: any) => acc + (curr.unreadCount || 0), 0);
                    setTotalUnread(unread);
                } else {
                    setWorkerList([]);
                    setTotalUnread(0);
                }
            } catch (e) {
                console.error("Dashboard status fetch error:", e);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    // 📩 Polling for signatures (if a session is active)
    useEffect(() => {
        if (!currentSessionId) return;

        const fetchSigs = async () => {
            try {
                const res = await fetch(`/api/tbm?sessionId=${currentSessionId}`);
                const data = await res.json();
                if (data.success) {
                    setSignatures(data.signatures);
                    setSignedCount(data.signatures.length);
                }
            } catch (e) { }
        };

        const interval = setInterval(fetchSigs, 3000);
        return () => clearInterval(interval);
    }, [currentSessionId]);

    const goToInterpreter = () => {
        router.push('/');
    };

    const toggleVoiceInput = () => {
        // Mock voice input toggle
        setIsListening(!isListening);
        if (!isListening) {
            showToast("음성 인식이 시작되었습니다. (Mock)", "success");
        }
    };

    const startTBM = async () => {
        if (!instruction.trim()) {
            showToast("지시사항을 입력해주세요.", "error");
            return;
        }
        setIsSending(true);
        try {
            const res = await fetch('/api/tbm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instruction })
            });
            const data = await res.json();

            if (data.success) {
                // Add to history
                setMessageHistory(prev => [{
                    id: data.session.id,
                    text: instruction,
                    sentAt: new Date(data.session.createdAt).toLocaleTimeString()
                }, ...prev]);

                showToast("TBM 지시사항이 전파되었습니다.", "success");
                setInstruction("");
                setCurrentSessionId(data.session.id);
            } else {
                showToast(data.error || "전송 실패", "error");
            }
        } catch (e) {
            showToast("전송 실패", "error");
        } finally {
            setIsSending(false);
        }
    };

    const downloadReport = () => {
        showToast("PDF 리포트 다운로드 중...", "success");
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
            {/* 토스트 알림 */}
            {toast.show && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg transition-all animate-pulse ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {toast.message}
                </div>
            )}

            {/* 1:1 채팅 모달 */}
            {selectedWorker && (
                <PrivateChatModal
                    workerName={selectedWorker.workerName}
                    workerId={selectedWorker.workerId}
                    workerCountry={selectedWorker.workerCountry}
                    onClose={() => setSelectedWorker(null)}
                />
            )}

            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">🛡️ SAFE-LINK 관제 센터</h1>
                        <p className="text-slate-400">TBM 전자서명 & 양방향 통역 시스템</p>
                    </div>

                    <div className="flex gap-3">
                        {/* 통역 모드 진입 버튼 */}
                        <button
                            onClick={goToInterpreter}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-green-500/20"
                        >
                            🎤 현장 통역 모드
                        </button>
                    </div>
                </div>

                {/* 🔔 실시간 소통 현황 (알림 센터) */}
                <div className="mb-6 bg-slate-800/50 backdrop-blur p-6 rounded-2xl border border-slate-700/50">
                    <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                        🔔 실시간 근로자 메시지
                        {totalUnread > 0 && (
                            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full animate-pulse">
                                {totalUnread}개의 새 메시지
                            </span>
                        )}
                    </h2>

                    {workerList.length === 0 ? (
                        <p className="text-slate-500 text-center py-4">최근 수신된 메시지가 없습니다.</p>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                            {workerList.map((worker, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedWorker(worker)}
                                    className={`relative min-w-[160px] text-left p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${worker.unreadCount > 0
                                        ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{countryToFlag[worker.workerCountry] || '🌍'}</span>
                                            <span className="text-white font-bold text-sm truncate max-w-[90px]">{worker.workerName}</span>
                                        </div>
                                        {worker.unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                +{worker.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-300 text-xs truncate mb-1">
                                        {worker.lastMessage || "(사진/음성)"}
                                    </p>
                                    <p className="text-slate-500 text-[10px]">
                                        {new Date(worker.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* ... (TBM 패널 유지) ... */}
                    <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            📢 작업 지시 (TBM)
                        </h2>
                        {/* ... (내용 생략 - 기존 유지) ... */}
                        <div className="relative">
                            <textarea
                                className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-xl resize-none text-white placeholder-slate-400 focus:outline-none focus:border-orange-500/50 pr-12"
                                placeholder="오늘의 위험 요인과 안전 수칙을 입력하세요..."
                                value={instruction}
                                onChange={(e) => setInstruction(e.target.value)}
                            />
                            <button
                                onClick={toggleVoiceInput}
                                className={`absolute top-2 right-2 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-slate-400 hover:bg-white/20'}`}
                            >
                                {isListening ? '⏹' : '🎤'}
                            </button>
                        </div>

                        <button
                            onClick={startTBM}
                            disabled={isSending}
                            className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
                        >
                            {isSending ? '📤 전송 중...' : '🚀 지시사항 전송'}
                        </button>

                        {/* Recent History 표시 유지 */}
                        {messageHistory.length > 0 && (
                            <div className="mt-6 border-t border-white/10 pt-4">
                                <h3 className="text-sm font-bold text-slate-400 mb-3">🕒 최근 지시 이력</h3>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {messageHistory.map((hist) => (
                                        <div key={hist.id} className="bg-white/5 p-3 rounded-lg text-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-orange-400 font-bold text-xs">TBM</span>
                                                <span className="text-slate-500 text-xs">{hist.sentAt}</span>
                                            </div>
                                            <p className="text-slate-300">{hist.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 실시간 서명 현황 (기존 유지) */}
                    <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            📊 실시간 서명 현황
                        </h2>

                        <div className="text-center py-6 mb-4">
                            <span className="text-6xl font-black text-green-400">{signedCount}</span>
                            <span className="text-slate-400 ml-2 text-xl">명 완료</span>
                        </div>

                        {signatures && signatures.length > 0 && (
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
            </div>
        </div>
    );
}
