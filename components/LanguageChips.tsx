"use client";

import { LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { motion } from "framer-motion";

interface LanguageChipsProps {
    currentLang: string;
    onSelectLang: (code: string) => void;
}

export default function LanguageChips({ currentLang, onSelectLang }: LanguageChipsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className="bg-zinc-900/60 p-3 border-b border-white/5 overflow-x-auto flex gap-2 no-scrollbar z-40 h-[65px] shrink-0 items-center"
        >
            {LANGUAGES.map((lang) => (
                <motion.button
                    key={lang.code}
                    onClick={() => onSelectLang(lang.code)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "flex-shrink-0 bg-sw-card border-1.5 rounded-xl px-3.5 py-2.5 flex items-center gap-1.5 transition-all duration-200",
                        currentLang === lang.code
                            ? "border-sw-cyan bg-cyan-950/20 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                            : "border-white/5 hover:border-white/10"
                    )}
                >
                    <span className="text-lg">{lang.flag}</span>
                    <span className={cn(
                        "text-[10px] font-black uppercase",
                        currentLang === lang.code ? "text-cyan-400" : "text-zinc-400"
                    )}>
                        {lang.label}
                    </span>
                </motion.button>
            ))}
        </div>
    );
}
