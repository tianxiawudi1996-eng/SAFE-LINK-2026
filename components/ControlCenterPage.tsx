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
    theme?: 'dark' | 'light';
}

export default function ControlCenterPage({ onBroadcast, theme = 'light' }: ControlCenterPageProps) {
    const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPlaying, setIsPlaying] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // ... (useEffect for loading messages remains same)
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

    // ... (useEffect for clock remains same)
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // ... (handlers remain same)
    const saveMessages = (messages: SavedMessage[]) => {
        setSavedMessages(messages);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    };

    const deleteMessage = (id: string) => {
        const updated = savedMessages.filter(m => m.id !== id);
        saveMessages(updated);
    };

    const broadcastMessage = (msg: SavedMessage) => {
        if (onBroadcast) {
            onBroadcast(msg.originalText);
        }
        const updated = savedMessages.map(m =>
            m.id === msg.id ? { ...m, usageCount: m.usageCount + 1 } : m
        );
        saveMessages(updated);
        setIsPlaying(msg.id);
        setTimeout(() => setIsPlaying(null), 3000);
    };

    const filteredMessages = savedMessages.filter(msg => {
        const matchCategory = selectedCategory === 'all' || msg.category === selectedCategory;
        const matchSearch = msg.standardText.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.originalText.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    const isDark = theme === 'dark';

    return (
        <div className={cn(
            "h-full flex flex-col overflow-hidden transition-all duration-500",
            isDark ? "bg-[#0a0a0c] text-white" : "bg-slate-50 text-slate-900"
        )}>
            {/* 🛰️ Premium Command Header */}
            <div className={cn(
                "shrink-0 p-5 border-b transition-colors",
                isDark ? "bg-zinc-900/50 border-white/5" : "bg-white border-slate-200"
            )}>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                            "bg-gradient-to-br from-indigo-600 to-violet-700"
                        )}>
                            <Monitor size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className={cn("font-black text-base tracking-tight leading-none uppercase", isDark ? "text-white" : "text-slate-900")}>
                                Control Center
                            </h2>
                            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                Monitoring System
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className={cn(
                            "flex items-baseline gap-1 font-mono font-bold text-lg tabular-nums",
                            isDark ? "text-indigo-400" : "text-indigo-600"
                        )}>
                            {currentTime.toLocaleTimeString('ko-KR', { hour12: false })}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider uppercase">
                            Operational Time
                        </div>
                    </div>
                </div>

                {/* Live Status Indicators */}
                <div className="flex items-center gap-4 mt-6">
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold",
                        isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                    )}>
                        <Shield size={12} />
                        SAFE
                    </div>
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold",
                        isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"
                    )}>
                        <Radio size={12} />
                        ACTIVE
                    </div>
                    <div className={cn(
                        "ml-auto text-[10px] font-bold text-slate-400"
                    )}>
                        {savedMessages.length} PRESETS
                    </div>
                </div>
            </div>

            {/* 🔍 Smart Search */}
            <div className="shrink-0 p-4">
                <div className="relative group">
                    <Search className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                        isDark ? "text-zinc-600 group-focus-within:text-indigo-400" : "text-slate-400 group-focus-within:text-indigo-600"
                    )} size={18} />
                    <input
                        type="text"
                        placeholder="Search command presets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                            "w-full rounded-2xl pl-12 pr-4 py-3.5 text-sm transition-all outline-none border-2",
                            isDark
                                ? "bg-zinc-900 border-zinc-800 text-white focus:border-indigo-500/50"
                                : "bg-white border-slate-100 text-slate-900 focus:border-indigo-600/30 shadow-sm"
                        )}
                    />
                </div>
            </div>

            {/* 🏷️ Categories */}
            <div className="shrink-0 px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black transition-all whitespace-nowrap uppercase tracking-tighter border",
                            selectedCategory === cat.id
                                ? (isDark ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/40" : "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20")
                                : (isDark ? "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50")
                        )}
                    >
                        <span>{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* 🗂️ Command List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                <AnimatePresence mode="popLayout">
                    {filteredMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 opacity-30">
                            <AlertTriangle size={32} className="mb-3" />
                            <p className="text-xs font-bold uppercase tracking-widest">No Commands Found</p>
                        </div>
                    ) : (
                        filteredMessages.map((msg, index) => (
                            <motion.div
                                key={msg.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                    "group rounded-2xl p-4 transition-all border-2 relative overflow-hidden",
                                    isPlaying === msg.id
                                        ? "border-emerald-500 bg-emerald-500/5 shadow-lg"
                                        : (isDark
                                            ? "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60"
                                            : "bg-white border-slate-100 hover:border-indigo-600/20 hover:shadow-md")
                                )}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase px-2 py-0.5 rounded-md",
                                                isDark ? "bg-white/5" : "bg-slate-100",
                                                CATEGORIES.find(c => c.id === msg.category)?.color
                                            )}>
                                                {msg.category}
                                            </span>
                                            {msg.usageCount > 0 && (
                                                <span className="text-[9px] font-bold text-slate-500 uppercase">
                                                    Pinned {msg.usageCount}x
                                                </span>
                                            )}
                                        </div>

                                        <p className={cn(
                                            "font-bold text-sm leading-snug",
                                            isDark ? "text-zinc-100" : "text-slate-800"
                                        )}>
                                            {msg.standardText}
                                        </p>

                                        {msg.originalText !== msg.standardText && (
                                            <p className="text-[11px] text-indigo-500 mt-1 font-medium font-mono">
                                                › {msg.originalText}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => broadcastMessage(msg)}
                                            title="Broadcast this message"
                                            className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-90",
                                                isPlaying === msg.id
                                                    ? "bg-emerald-500 text-white animate-pulse"
                                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                            )}
                                        >
                                            <Play size={18} fill="currentColor" />
                                        </button>
                                        <button
                                            onClick={() => deleteMessage(msg.id)}
                                            title="Delete this message"
                                            className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100",
                                                isDark ? "bg-zinc-800 text-zinc-600 hover:text-red-400" : "bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                            )}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* 📊 Console Footer */}
            <div className={cn(
                "shrink-0 p-4 border-t transition-colors",
                isDark ? "bg-black/50 border-white/5" : "bg-white border-slate-200"
            )}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Core
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Sync
                        </div>
                    </div>
                    <div className="text-[9px] font-black italic text-indigo-500 animate-pulse">
                        READY FOR BROADCAST
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
