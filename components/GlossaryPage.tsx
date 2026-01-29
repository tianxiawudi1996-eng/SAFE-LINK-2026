"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Search, Book, RefreshCcw } from "lucide-react";

interface SlangItem {
    id?: string;
    slang: string;
    standard: string;
    vi: string;
    uz: string;
    en: string;
    km: string;
    mn: string;
    zh: string;
    th: string;
    ru: string;
}

interface GlossaryPageProps {
    onTermSelect?: (term: string) => void;
    compact?: boolean;
    theme?: 'dark' | 'light';
}

export default function GlossaryPage({ onTermSelect, compact = false, theme = 'light' }: GlossaryPageProps) {
    const [filter, setFilter] = useState("");
    const [terms, setTerms] = useState<SlangItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddMode, setIsAddMode] = useState(false);
    const [newTerm, setNewTerm] = useState<Partial<SlangItem>>({
        slang: "", standard: "", vi: "", uz: "", en: "", km: "", mn: "", zh: "", th: "", ru: ""
    });

    const fetchTerms = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/dictionary');
            const data = await res.json();
            if (data.success) {
                const mapped: SlangItem[] = data.terms.map((t: any) => {
                    const trs = t.translations || {};
                    return {
                        id: t.id,
                        slang: t.krSlang,
                        standard: t.krStandard,
                        vi: trs['vi-VN']?.slang || '-',
                        uz: trs['uz-UZ']?.slang || '-',
                        en: trs['en-US']?.slang || '-',
                        zh: trs['zh-CN']?.slang || '-',
                        km: trs['km-KH']?.slang || '-',
                        mn: trs['mn-MN']?.slang || '-',
                        th: trs['th-TH']?.slang || '-',
                        ru: trs['ru-RU']?.slang || '-'
                    };
                });
                setTerms(mapped);
            }
        } catch (e) {
            console.error("Fetch Dictionary Error:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    const filteredSlang = terms.filter(item =>
        item.slang.includes(filter) || item.standard.toLowerCase().includes(filter.toLowerCase())
    );

    const handleAddTerm = async () => {
        if (!newTerm.slang || !newTerm.standard) return;

        const translations: any = {};
        const langMap: Record<string, string> = {
            vi: 'vi-VN', uz: 'uz-UZ', en: 'en-US', zh: 'zh-CN',
            km: 'km-KH', mn: 'mn-MN', th: 'th-TH', ru: 'ru-RU'
        };

        Object.keys(langMap).forEach(key => {
            const val = (newTerm as any)[key];
            if (val) {
                translations[langMap[key]] = { standard: val, slang: val };
            }
        });

        try {
            const res = await fetch('/api/dictionary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    krSlang: newTerm.slang,
                    krStandard: newTerm.standard,
                    translations,
                    category: 'Custom'
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchTerms();
                setNewTerm({ slang: "", standard: "", vi: "", uz: "", en: "", km: "", mn: "", zh: "", th: "", ru: "" });
                setIsAddMode(false);
            }
        } catch (e) {
            console.error("Add Term Error:", e);
        }
    };

    const handleDeleteTerm = async (id: string) => {
        if (!confirm("Are you sure you want to delete this term?")) return;
        try {
            const res = await fetch(`/api/dictionary?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchTerms();
            }
        } catch (e) {
            console.error("Delete Term Error:", e);
        }
    };

    const isDark = theme === 'dark';

    // Compact 모드 (PC 사이드바용)
    if (compact) {
        return (
            <div className={cn(
                "h-full flex flex-col transition-colors duration-500",
                isDark ? "bg-[#0c0c0e] text-white" : "bg-white text-slate-900"
            )}>
                {/* 헤더 */}
                <div className={cn(
                    "shrink-0 px-5 py-5 border-b transition-colors",
                    isDark ? "border-white/5 bg-zinc-900/20" : "border-slate-100 bg-slate-50/30"
                )}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Book size={16} className="text-indigo-500" />
                            <h3 className={cn("text-xs font-black uppercase tracking-widest", isDark ? "text-white" : "text-slate-800")}>Glossary</h3>
                        </div>
                        <button onClick={fetchTerms} title="Refresh Glossary" aria-label="Refresh Glossary" className="p-1 hover:rotate-180 transition-transform duration-500">
                            <RefreshCcw size={14} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* 검색 */}
                <div className="shrink-0 p-4">
                    <div className="relative group">
                        <Search size={16} className={cn("absolute left-4 top-1/2 -translate-y-1/2 transition-colors", isDark ? "text-zinc-600 group-focus-within:text-indigo-500" : "text-slate-400 group-focus-within:text-indigo-600")} />
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className={cn(
                                "w-full rounded-2xl pl-12 pr-4 py-3 text-xs transition-all outline-none border-2",
                                isDark
                                    ? "bg-zinc-900 border-zinc-800 text-white focus:border-indigo-500/50"
                                    : "bg-white border-slate-100 text-slate-900 focus:border-indigo-600/30"
                            )}
                            placeholder="Search jargon..."
                        />
                    </div>
                </div>

                {/* 용어 목록 */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 no-scrollbar">
                    {isLoading ? (
                        <div className="p-10 text-center opacity-30"><RefreshCcw className="animate-spin mx-auto" /></div>
                    ) : filteredSlang.slice(0, 20).map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onTermSelect?.(item.slang)}
                            className={cn(
                                "group rounded-xl p-3.5 cursor-pointer transition-all border-2",
                                isDark
                                    ? "bg-zinc-900/40 border-zinc-800 hover:border-indigo-500/30 hover:bg-zinc-900/60"
                                    : "bg-slate-50 border-slate-50 hover:border-indigo-600/20 hover:bg-white hover:shadow-sm"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-orange-500 font-black text-sm uppercase tracking-tight">{item.slang}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{item.en}</span>
                            </div>
                            <span className={cn("text-[11px] font-medium leading-tight", isDark ? "text-zinc-400" : "text-slate-500")}>{item.standard}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn(
            "h-full flex flex-col overflow-hidden transition-colors duration-500",
            isDark ? "bg-[#0a0a0c] text-white" : "bg-white text-slate-900"
        )}>
            {/* 헤더 */}
            <div className={cn(
                "shrink-0 p-6 border-b transition-colors",
                isDark ? "border-white/5 bg-zinc-900/20" : "border-slate-100"
            )}>
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className={cn("text-2xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>Glossary</h2>
                        <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            Cloud-Sync Mapping
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchTerms} title="Refresh Glossary" aria-label="Refresh Glossary" className="p-3 hover:bg-slate-100 rounded-xl transition-colors">
                            <RefreshCcw size={16} className={cn(isLoading && "animate-spin")} />
                        </button>
                        <button
                            onClick={() => setIsAddMode(!isAddMode)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg active:scale-95",
                                isAddMode
                                    ? (isDark ? "bg-zinc-800 text-white" : "bg-slate-100 text-slate-600")
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20"
                            )}
                        >
                            {isAddMode ? <X size={14} /> : <Plus size={14} />}
                            {isAddMode ? "CANCEL" : "ADD NEW"}
                        </button>
                    </div>
                </div>
            </div>

            {/* 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">

                {/* Add Term Form */}
                <AnimatePresence>
                    {isAddMode && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-8"
                        >
                            <div className={cn(
                                "rounded-3xl p-6 space-y-4 border-2 shadow-2xl",
                                isDark ? "bg-zinc-900/80 border-indigo-500/20" : "bg-white border-indigo-100"
                            )}>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={newTerm.slang}
                                        onChange={(e) => setNewTerm(prev => ({ ...prev, slang: e.target.value }))}
                                        placeholder="Site Jargon *"
                                        className={cn(
                                            "w-full rounded-2xl p-4 text-sm font-bold transition-all outline-none border-2",
                                            isDark ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-100 text-slate-900 focus:border-indigo-600"
                                        )}
                                    />
                                    <input
                                        type="text"
                                        value={newTerm.standard}
                                        onChange={(e) => setNewTerm(prev => ({ ...prev, standard: e.target.value }))}
                                        placeholder="Standard Korean *"
                                        className={cn(
                                            "w-full rounded-2xl p-4 text-sm font-bold transition-all outline-none border-2",
                                            isDark ? "bg-zinc-800 border-zinc-700 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-100 text-slate-900 focus:border-indigo-600"
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { key: 'vi', label: '🇻🇳 VN' },
                                        { key: 'uz', label: '🇺🇿 UZ' },
                                        { key: 'en', label: '🇺🇸 EN' },
                                        { key: 'zh', label: '🇨🇳 ZH' },
                                        { key: 'km', label: '🇰🇭 KM' },
                                        { key: 'mn', label: '🇲🇳 MN' },
                                        { key: 'th', label: '🇹🇭 TH' },
                                        { key: 'ru', label: '🇷🇺 RU' },
                                    ].map(({ key, label }) => (
                                        <input
                                            key={key}
                                            type="text"
                                            value={(newTerm as any)[key] || ""}
                                            onChange={(e) => setNewTerm(prev => ({ ...prev, [key]: e.target.value }))}
                                            placeholder={label}
                                            className={cn(
                                                "rounded-xl p-3 text-[10px] font-black transition-all outline-none border-2 truncate",
                                                isDark ? "bg-zinc-800/50 border-zinc-700 text-white focus:border-indigo-500" : "bg-slate-50 border-slate-100 text-slate-900 focus:border-indigo-600"
                                            )}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleAddTerm}
                                    disabled={!newTerm.slang || !newTerm.standard}
                                    className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                                >
                                    <Check size={18} /> REGISTER TO CLOUD
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative mb-8 sticky top-0 z-10 group">
                    <Search className={cn("absolute left-6 top-1/2 -translate-y-1/2 transition-colors", isDark ? "text-zinc-600 group-focus-within:text-orange-500" : "text-slate-400 group-focus-within:text-orange-500")} size={20} />
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className={cn(
                            "w-full backdrop-blur-xl rounded-[2rem] pl-16 pr-6 py-6 text-sm font-black transition-all outline-none border-2 shadow-xl",
                            isDark
                                ? "bg-zinc-900/90 border-zinc-800 text-white focus:border-orange-500"
                                : "bg-white/90 border-slate-100 text-slate-900 focus:border-orange-500 shadow-indigo-100/50"
                        )}
                        placeholder="Search for slang (e.g., Ah-shi-ba, Gong-gu-ri)..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                    {isLoading ? (
                        <div className="py-20 text-center opacity-30"><RefreshCcw className="animate-spin mx-auto w-12 h-12" /></div>
                    ) : filteredSlang.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.01 }}
                            onClick={() => onTermSelect?.(item.slang)}
                            className={cn(
                                "group relative p-6 rounded-3xl border-2 transition-all cursor-pointer active:scale-[0.98]",
                                isDark
                                    ? "bg-[#141417] border-zinc-800 hover:border-orange-500/50"
                                    : "bg-white border-slate-100 hover:border-orange-500/30 hover:shadow-xl"
                            )}
                        >
                            {/* Delete button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); if (item.id) handleDeleteTerm(item.id); }}
                                title="Delete term"
                                className="absolute top-4 right-4 w-8 h-8 bg-red-500/10 hover:bg-red-500 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                            >
                                <X size={14} className="text-red-500 group-hover:text-white" />
                            </button>

                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-orange-500 font-black text-2xl tracking-tight group-hover:scale-105 transition-transform origin-left">{item.slang}</span>
                                    </div>
                                    <p className={cn("text-[11px] font-bold uppercase tracking-[0.1em]", isDark ? "text-zinc-500" : "text-slate-400")}>
                                        Standard: <span className={cn(isDark ? "text-indigo-400" : "text-indigo-600")}>{item.standard}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { flag: '🇻🇳', val: item.vi },
                                    { flag: '🇺🇿', val: item.uz },
                                    { flag: '🇺🇸', val: item.en },
                                    { flag: '🇨🇳', val: item.zh },
                                    { flag: '��', val: item.km },
                                    { flag: '��', val: item.mn },
                                    { flag: '��', val: item.th },
                                    { flag: '��', val: item.ru },
                                ].filter(f => f.val && f.val !== '-').slice(0, 4).map(({ flag, val }) => (
                                    <div key={flag} className={cn(
                                        "text-[10px] py-2 px-3 rounded-xl font-bold flex items-center gap-2 border transition-all",
                                        isDark ? "bg-black/40 border-white/5 text-zinc-400" : "bg-slate-50 border-slate-100 text-slate-600"
                                    )}>
                                        <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{flag}</span>
                                        <span className="truncate">{val}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {filteredSlang.length === 0 && !isLoading && (
                        <div className="text-center py-20 opacity-30">
                            <Book size={48} className="mx-auto mb-4" />
                            <p className="text-sm font-black uppercase tracking-widest">No matching jargon found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
