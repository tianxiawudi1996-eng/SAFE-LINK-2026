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
        <header className="p-4 glass-panel flex justify-between items-center z-50 h-[80px] shrink-0">
            <div className="flex items-center space-x-3">
                <div className="w-24 h-8 relative flex items-center justify-center filter drop-shadow-lg">
                    <img
                        src="/seowon-logo.png"
                        alt="Seowon Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="pl-2 border-l border-white/10">
                    <h1 className="text-[11px] font-black tracking-tighter text-white uppercase leading-none">
                        <span className="text-sw-orange">SAFE</span>-LINK
                    </h1>
                    <p className="text-[7px] text-zinc-600 font-bold uppercase tracking-widest mt-1 italic">
                        Gravity-Free Safety
                    </p>
                </div>
            </div>

            {/* View Switcher */}
            <div className="bg-[#1C1C1F] rounded-full p-1 flex border border-white/5 shadow-inner">
                <button
                    onClick={() => onToggleView('PC')}
                    className={cn(
                        "px-3.5 py-1.5 rounded-full text-[10px] font-black transition-all duration-300",
                        viewMode === 'PC' ? "bg-sw-orange text-white" : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    PC VIEW
                </button>
                <button
                    onClick={() => onToggleView('MOBILE')}
                    className={cn(
                        "px-3.5 py-1.5 rounded-full text-[10px] font-black transition-all duration-300",
                        viewMode === 'MOBILE' ? "bg-sw-orange text-white" : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    MOBILE
                </button>
            </div>

            <div className="flex flex-col items-end text-right hidden sm:flex">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                    Master Turbo Active
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-500">
                    {time}
                </span>
            </div>
        </header>
    );
}
