"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
    viewMode: 'PC' | 'MOBILE';
    onToggleView: (mode: 'PC' | 'MOBILE') => void;
}

export default function Header({ viewMode, onToggleView }: HeaderProps) {
    const [time, setTime] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('ko-KR', { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="px-5 py-3 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 flex justify-between items-center z-50 h-[60px] shrink-0 border-b border-white/5">
            {/* 좌측 로고 */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <span className="text-white font-black text-xs">S</span>
                </div>
                <div>
                    <h1 className="text-sm font-black tracking-tight text-white">
                        <span className="text-orange-400">SAFE</span>-LINK
                    </h1>
                    <p className="text-[8px] text-zinc-600 font-medium uppercase tracking-widest">
                        실시간 안전통역
                    </p>
                </div>
            </div>

            {/* 중앙: View Switcher */}
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-0.5 flex border border-white/5">
                <button
                    onClick={() => onToggleView('PC')}
                    className={cn(
                        "px-3 py-1.5 rounded-md text-[10px] font-bold transition-all",
                        viewMode === 'PC'
                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                            : "text-zinc-500 hover:text-zinc-300"
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
                            : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    MOBILE
                </button>
            </div>

            {/* 우측: 상태 표시 */}
            <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                        LIVE
                    </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-zinc-400">
                    {time}
                </span>
            </div>
        </header>
    );
}
