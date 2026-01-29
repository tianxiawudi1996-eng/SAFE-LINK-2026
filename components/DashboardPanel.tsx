"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    Cloud, Sun, CloudRain, Wind,
    MessageSquare, Volume2, TrendingUp,
    Zap
} from "lucide-react";

interface DashboardPanelProps {
    onQuickBroadcast?: (text: string) => void;
    onSelectWorker?: (workerName: string) => void;
    theme?: 'dark' | 'light';
}

const QUICK_COMMANDS = [
    { id: 'helmet', text: '안전모 착용하세요', icon: '🪖', color: 'emerald' },
    { id: 'stop', text: '작업 중지! 대기하세요', icon: '🛑', color: 'red' },
    { id: 'break', text: '휴식 시간입니다', icon: '☕', color: 'blue' },
    { id: 'start', text: '작업 시작하세요', icon: '🚀', color: 'orange' },
];

export default function DashboardPanel({ onQuickBroadcast, theme = 'light' }: DashboardPanelProps) {
    const [stats, setStats] = useState({
        todayMessages: 0,
        todayTTS: 0,
        activeWorkers: 0,
        languages: [] as { code: string; count: number; flag: string }[]
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/worker/stats');
                const data = await res.json();
                if (data.success) {
                    setStats(data.stats);
                }
            } catch (e) { }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const isDark = theme === 'dark';

    return (
        <div className={cn(
            "h-full flex flex-col overflow-hidden transition-all duration-500",
            isDark ? "bg-[#0c0c0e] text-white" : "bg-white text-slate-900"
        )}>
            <div className={cn(
                "shrink-0 px-5 py-5 border-b transition-colors",
                isDark ? "border-white/5 bg-zinc-900/20" : "border-slate-100 bg-slate-50/30"
            )}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <TrendingUp size={16} className="text-orange-500" />
                    </div>
                    <h3 className={cn("text-xs font-black uppercase tracking-widest", isDark ? "text-white" : "text-slate-800")}>
                        Field Dashboard
                    </h3>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar">
                {/* Weather */}
                <div className={cn(
                    "rounded-[2rem] p-6 border transition-all",
                    isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
                )}>
                    <div className="flex items-center justify-between mb-5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site Weather</span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-500">
                            <Wind size={12} /> 8m/s
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",
                            isDark ? "bg-white/5" : "bg-white"
                        )}>
                            <Cloud size={28} className="text-indigo-400" />
                        </div>
                        <div>
                            <div className={cn("text-3xl font-black tabular-nums", isDark ? "text-white" : "text-slate-900")}>4.2°C</div>
                            <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Cloudy • 55% Hum</div>
                        </div>
                    </div>
                </div>

                {/* Today Stats */}
                <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Today's Pulse</span>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className={cn(
                            "rounded-2xl p-4 border transition-all",
                            isDark ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-sm"
                        )}>
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquare size={14} className="text-cyan-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Msg</span>
                            </div>
                            <div className={cn("text-2xl font-black tabular-nums", isDark ? "text-white" : "text-slate-900")}>{stats.todayMessages}</div>
                        </div>
                        <div className={cn(
                            "rounded-2xl p-4 border transition-all",
                            isDark ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-sm"
                        )}>
                            <div className="flex items-center gap-2 mb-2">
                                <Volume2 size={14} className="text-orange-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">TTS</span>
                            </div>
                            <div className={cn("text-2xl font-black tabular-nums", isDark ? "text-white" : "text-slate-900")}>{stats.todayTTS}</div>
                        </div>
                    </div>
                </div>

                {/* Language Status */}
                <div className={cn(
                    "rounded-[2rem] p-6 border transition-all",
                    isDark ? "bg-white/5 border-white/5" : "bg-indigo-50/30 border-indigo-100/50"
                )}>
                    <div className="flex items-center justify-between mb-5">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Channels</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] text-emerald-500 font-bold uppercase">
                            {stats.activeWorkers} Connected
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {stats.languages.map(lang => (
                            <div key={lang.code} className={cn(
                                "px-3 py-2 rounded-xl flex items-center gap-2 border transition-all shadow-sm",
                                isDark ? "bg-white/10 border-white/5" : "bg-white border-slate-100"
                            )}>
                                <span className="text-lg">{lang.flag}</span>
                                <span className={cn("text-xs font-black", isDark ? "text-white" : "text-slate-800")}>{lang.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Directive */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Zap size={14} className="text-orange-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Directives</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {QUICK_COMMANDS.map(cmd => (
                            <button
                                key={cmd.id}
                                onClick={() => onQuickBroadcast?.(cmd.text)}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-95 text-left group",
                                    cmd.color === 'emerald' && (isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white border-emerald-100 text-emerald-600 hover:bg-emerald-50"),
                                    cmd.color === 'red' && (isDark ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-white border-red-100 text-red-600 hover:bg-red-50"),
                                    cmd.color === 'blue' && (isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-white border-blue-100 text-blue-600 hover:bg-blue-50"),
                                    cmd.color === 'orange' && (isDark ? "bg-orange-500/10 border-orange-500/20 text-orange-400" : "bg-white border-orange-100 text-orange-600 hover:bg-orange-50")
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all shadow-sm",
                                    isDark ? "bg-white/5" : "bg-white border border-inherit"
                                )}>
                                    {cmd.icon}
                                </div>
                                <span className="text-xs font-black uppercase tracking-tight">{cmd.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
