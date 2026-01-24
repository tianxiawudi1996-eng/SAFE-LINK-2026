"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play, Trash2, Clock, Volume2, Save, Search,
    AlertTriangle, Shield, Radio, Monitor, Zap
} from "lucide-react";

// 저장된 메시지 인터페이스
interface SavedMessage {
    id: string;
    standardText: string;
    originalText: string;
    translations: Record<string, string>;
    createdAt: Date;
    usageCount: number;
    category: 'safety' | 'work' | 'emergency' | 'general';
}

// 로컬 스토리지 키
const STORAGE_KEY = 'safelink_saved_messages';

// 카테고리 설정
const CATEGORIES = [
    { id: 'all', label: '전체', icon: '📋', color: 'text-white' },
    { id: 'safety', label: '안전', icon: '🛡️', color: 'text-emerald-400' },
    { id: 'work', label: '작업', icon: '🔧', color: 'text-blue-400' },
    { id: 'emergency', label: '긴급', icon: '🚨', color: 'text-red-400' },
    { id: 'general', label: '일반', icon: '📢', color: 'text-zinc-400' },
];

// 기본 프리셋 메시지
const DEFAULT_MESSAGES: SavedMessage[] = [
    {
        id: 'preset-1',
        standardText: '안전모 착용하고 작업 시작하세요',
        originalText: '안전모 착용하고 작업 시작하세요',
        translations: {},
        createdAt: new Date(),
        usageCount: 0,
        category: 'safety'
    },
    {
        id: 'preset-2',
        standardText: '비계 해체작업 전 안전 확인하세요',
        originalText: '아시바 해체작업 전 안전 확인하세요',
        translations: {},
        createdAt: new Date(),
        usageCount: 0,
        category: 'safety'
    },
    {
        id: 'preset-3',
        standardText: '콘크리트 타설 작업 준비하세요',
        originalText: '공구리 타설 작업 준비하세요',
        translations: {},
        createdAt: new Date(),
        usageCount: 0,
        category: 'work'
    },
    {
        id: 'preset-4',
        standardText: '작업 중지! 긴급 대피하세요',
        originalText: '작업 중지! 긴급 대피하세요',
        translations: {},
        createdAt: new Date(),
        usageCount: 0,
        category: 'emergency'
    },
];

interface ControlCenterPageProps {
    onBroadcast?: (text: string) => void;
}

export default function ControlCenterPage({ onBroadcast }: ControlCenterPageProps) {
    const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPlaying, setIsPlaying] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // 저장된 메시지 로드
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setSavedMessages(parsed.map((m: SavedMessage) => ({
                    ...m,
                    createdAt: new Date(m.createdAt)
                })));
            } catch {
                setSavedMessages(DEFAULT_MESSAGES);
            }
        } else {
            setSavedMessages(DEFAULT_MESSAGES);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MESSAGES));
        }
    }, []);

    // 실시간 시계
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 메시지 저장
    const saveMessages = (messages: SavedMessage[]) => {
        setSavedMessages(messages);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    };

    // 메시지 삭제
    const deleteMessage = (id: string) => {
        const updated = savedMessages.filter(m => m.id !== id);
        saveMessages(updated);
    };

    // 메시지 방송 (외부로 전달)
    const broadcastMessage = (msg: SavedMessage) => {
        if (onBroadcast) {
            onBroadcast(msg.originalText);
        }
        // 사용 횟수 증가
        const updated = savedMessages.map(m =>
            m.id === msg.id ? { ...m, usageCount: m.usageCount + 1 } : m
        );
        saveMessages(updated);
        setIsPlaying(msg.id);
        setTimeout(() => setIsPlaying(null), 3000);
    };

    // 필터링된 메시지
    const filteredMessages = savedMessages.filter(msg => {
        const matchCategory = selectedCategory === 'all' || msg.category === selectedCategory;
        const matchSearch = msg.standardText.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.originalText.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black overflow-hidden">
            {/* 헤더 - 관제 센터 스타일 */}
            <div className="shrink-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-b border-orange-500/30 p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Monitor size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-black text-sm tracking-tight leading-tight">
                                현장관제<br />사령실
                            </h2>
                            <p className="text-[8px] text-orange-400 font-bold uppercase tracking-widest mt-0.5">
                                CONTROL CENTER
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-baseline gap-1 justify-end">
                            <span className="text-lg font-mono text-emerald-400 font-bold">
                                {currentTime.getHours().toString().padStart(2, '0')}
                            </span>
                            <span className="text-[10px] text-emerald-400/60">시</span>
                            <span className="text-lg font-mono text-emerald-400 font-bold">
                                {currentTime.getMinutes().toString().padStart(2, '0')}
                            </span>
                            <span className="text-[10px] text-emerald-400/60">분</span>
                            <span className="text-sm font-mono text-emerald-400/80">
                                {currentTime.getSeconds().toString().padStart(2, '0')}
                            </span>
                            <span className="text-[9px] text-emerald-400/50">초</span>
                        </div>
                        <div className="text-[9px] text-zinc-500 tracking-wider mt-0.5">
                            {currentTime.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                        </div>
                    </div>
                </div>

                {/* 상태 표시줄 */}
                <div className="flex items-center gap-4 text-[10px]">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>시스템 정상</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-cyan-400">
                        <Radio size={12} />
                        <span>TTS 연결됨</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-orange-400">
                        <Zap size={12} />
                        <span>{savedMessages.length}개 메시지 저장됨</span>
                    </div>
                </div>
            </div>

            {/* 검색바 */}
            <div className="shrink-0 p-3 bg-black/30">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="저장된 메시지 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50"
                    />
                </div>
            </div>

            {/* 카테고리 필터 */}
            <div className="shrink-0 px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap",
                            selectedCategory === cat.id
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                        )}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* 메시지 목록 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <AnimatePresence mode="popLayout">
                    {filteredMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-zinc-600">
                            <AlertTriangle size={32} className="mb-2" />
                            <p className="text-sm">저장된 메시지가 없습니다</p>
                        </div>
                    ) : (
                        filteredMessages.map((msg, index) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "bg-gradient-to-r from-zinc-800/80 to-zinc-900/80 rounded-xl p-3 border transition-all",
                                    isPlaying === msg.id
                                        ? "border-cyan-500 shadow-lg shadow-cyan-500/20"
                                        : "border-white/5 hover:border-white/20"
                                )}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        {/* 카테고리 태그 */}
                                        <span className={cn(
                                            "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/5",
                                            CATEGORIES.find(c => c.id === msg.category)?.color
                                        )}>
                                            {CATEGORIES.find(c => c.id === msg.category)?.icon} {msg.category}
                                        </span>

                                        {/* 메시지 내용 */}
                                        <p className="text-white font-semibold text-sm mt-1.5 leading-relaxed">
                                            {msg.standardText}
                                        </p>

                                        {/* 원본 (은어 포함) */}
                                        {msg.originalText !== msg.standardText && (
                                            <p className="text-zinc-500 text-[11px] mt-1 italic">
                                                원본: {msg.originalText}
                                            </p>
                                        )}

                                        {/* 메타 정보 */}
                                        <div className="flex items-center gap-3 mt-2 text-[9px] text-zinc-600">
                                            <span className="flex items-center gap-1">
                                                <Clock size={10} />
                                                {msg.createdAt.toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Play size={10} />
                                                {msg.usageCount}회 사용
                                            </span>
                                        </div>
                                    </div>

                                    {/* 액션 버튼들 */}
                                    <div className="flex flex-col gap-1.5">
                                        <button
                                            onClick={() => broadcastMessage(msg)}
                                            className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                                                isPlaying === msg.id
                                                    ? "bg-cyan-500 text-white animate-pulse"
                                                    : "bg-orange-500 text-white hover:bg-orange-400 active:scale-95"
                                            )}
                                        >
                                            {isPlaying === msg.id ? <Volume2 size={18} /> : <Play size={18} />}
                                        </button>
                                        <button
                                            onClick={() => deleteMessage(msg.id)}
                                            className="w-10 h-10 rounded-lg bg-zinc-800 text-zinc-500 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* 재생 중 표시 */}
                                {isPlaying === msg.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-2 pt-2 border-t border-cyan-500/30"
                                    >
                                        <div className="flex items-center gap-2 text-cyan-400 text-[11px]">
                                            <Volume2 size={14} className="animate-pulse" />
                                            <span>방송 중...</span>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div
                                                        key={i}
                                                        className="w-1 bg-cyan-400 rounded-full animate-pulse"
                                                        style={{
                                                            height: `${8 + Math.random() * 12}px`,
                                                            animationDelay: `${i * 0.1}s`
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* 하단 통계 바 */}
            <div className="shrink-0 bg-black/50 border-t border-white/5 p-3">
                <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-4">
                        <span className="text-zinc-500">
                            총 <span className="text-orange-400 font-bold">{savedMessages.length}</span>개
                        </span>
                        <span className="text-zinc-500">
                            안전 <span className="text-emerald-400 font-bold">{savedMessages.filter(m => m.category === 'safety').length}</span>
                        </span>
                        <span className="text-zinc-500">
                            긴급 <span className="text-red-400 font-bold">{savedMessages.filter(m => m.category === 'emergency').length}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-600">
                        <Shield size={12} />
                        <span>SEOWON SAFE-LINK</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 메시지 저장 유틸리티 함수 (외부에서 호출용)
export function saveMessageToStorage(message: {
    standardText: string;
    originalText: string;
    translations?: Record<string, string>;
    category?: 'safety' | 'work' | 'emergency' | 'general';
}) {
    const stored = localStorage.getItem(STORAGE_KEY);
    const messages: SavedMessage[] = stored ? JSON.parse(stored) : [];

    // 중복 체크
    if (messages.some(m => m.standardText === message.standardText)) {
        return false;
    }

    const newMessage: SavedMessage = {
        id: `msg-${Date.now()}`,
        standardText: message.standardText,
        originalText: message.originalText,
        translations: message.translations || {},
        createdAt: new Date(),
        usageCount: 0,
        category: message.category || 'general'
    };

    messages.unshift(newMessage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    return true;
}
