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
            className="bg-zinc-950/50 backdrop-blur-sm px-4 py-2 border-b border-white/5 overflow-x-auto flex gap-1.5 no-scrollbar z-40 h-[46px] shrink-0 items-center"
        >
            {LANGUAGES.map((lang) => (
                <motion.button
                    key={lang.code}
                    onClick={() => onSelectLang(lang.code)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "flex-shrink-0 rounded-lg px-2.5 py-1.5 flex items-center gap-1 transition-all text-[10px] font-bold",
                        currentLang === lang.code
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            : "bg-zinc-800/50 text-zinc-500 border border-transparent hover:border-white/10 hover:text-zinc-300"
                    )}
                >
                    <span className="text-sm">{lang.flag}</span>
                    <span>{lang.code.split('-')[0].toUpperCase()}</span>
                </motion.button>
            ))}
        </div>
    );
}
