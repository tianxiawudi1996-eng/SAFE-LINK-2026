"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
    viewMode: 'PC' | 'MOBILE';
    onToggleView: (mode: 'PC' | 'MOBILE') => void;
    theme?: 'dark' | 'light';
    onToggleTheme?: () => void;
}

export default function Header({ viewMode, onToggleView, theme = 'light', onToggleTheme }: HeaderProps) {
    const [time, setTime] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('ko-KR', { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className={cn(
            "px-5 py-3 flex justify-between items-center z-50 h-[60px] shrink-0 border-b transition-colors",
            theme === 'dark'
                ? "bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border-white/5"
                : "bg-white border-slate-200"
        )}>
            {/* 좌측 로고 */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <span className="text-white font-black text-xs">S</span>
                </div>
                <div>
                    <h1 className={cn("text-sm font-black tracking-tight", theme === 'dark' ? "text-white" : "text-slate-900")}>
                        <span className="text-orange-500">SAFE</span>-LINK
                    </h1>
                    <p className="text-[8px] text-zinc-500 font-medium uppercase tracking-widest">
                        실시간 안전통역
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={onToggleTheme}
                    className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                        theme === 'dark' ? "bg-zinc-800 text-yellow-400 hover:bg-zinc-700" : "bg-slate-100 text-orange-500 hover:bg-slate-200"
                    )}
                    title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {theme === 'dark' ? '☀' : '🌙'}
                </button>

                {/* 중앙: View Switcher */}
                <div className={cn(
                    "rounded-lg p-0.5 flex border",
                    theme === 'dark' ? "bg-zinc-800/50 border-white/5" : "bg-slate-100 border-slate-200"
                )}>
                    <button
                        onClick={() => onToggleView('PC')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-[10px] font-bold transition-all",
                            viewMode === 'PC'
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                : (theme === 'dark' ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600")
                        )}
                    >
                        PC
                    </button>
                    <button
                        onClick={() => onToggleView('MOBILE')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-[10px] font-bold transition-all",
                            viewMode === 'MOBILE'
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                : (theme === 'dark' ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600")
                        )}
                    >
                        MOBILE
                    </button>
                </div>
            </div>

            {/* 우측: 상태 표시 */}
            <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                        LIVE
                    </span>
                </div>
                <span className={cn("text-[11px] font-mono font-bold", theme === 'dark' ? "text-zinc-400" : "text-slate-400")}>
                    {time}
                </span>
            </div>
        </header>
    );
}
