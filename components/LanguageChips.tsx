"use client";

import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { motion } from "framer-motion";

interface LanguageChipsProps {
    currentLang: string;
    onSelectLang: (code: string) => void;
    theme?: 'dark' | 'light';
}

export default function LanguageChips({ currentLang, onSelectLang, theme = 'light' }: LanguageChipsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isDark = theme === 'dark';

    return (
        <div
            ref={containerRef}
            className={cn(
                "backdrop-blur-md px-4 py-2 border-b overflow-x-auto flex gap-2 no-scrollbar z-40 h-[52px] shrink-0 items-center transition-all duration-500",
                isDark ? "bg-black/40 border-white/5" : "bg-white/80 border-slate-100"
            )}
        >
            {LANGUAGES.map((lang) => (
                <motion.button
                    key={lang.code}
                    onClick={() => onSelectLang(lang.code)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "flex-shrink-0 cursor-pointer rounded-xl px-4 py-2 flex items-center gap-2 transition-all text-[11px] font-black uppercase tracking-tight border-2",
                        currentLang === lang.code
                            ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20"
                            : (isDark
                                ? "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                                : "bg-slate-50 text-slate-500 border-slate-50 hover:bg-white hover:border-slate-200 hover:text-indigo-600")
                    )}
                >
                    <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{lang.flag}</span>
                    <span>{lang.code.split('-')[0]}</span>
                </motion.button>
            ))}
        </div>
    );
}

