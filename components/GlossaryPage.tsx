"use client";

import { NOGADA_SLANG } from "@/lib/constants";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Search, Book } from "lucide-react";

interface SlangItem {
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
}

export default function GlossaryPage({ onTermSelect, compact = false }: GlossaryPageProps) {
    const [filter, setFilter] = useState("");
    const [customTerms, setCustomTerms] = useState<SlangItem[]>([]);
    const [isAddMode, setIsAddMode] = useState(false);
    const [newTerm, setNewTerm] = useState<Partial<SlangItem>>({
        slang: "", standard: "", vi: "", uz: "", en: "", km: "", mn: "", zh: "", th: "", ru: ""
    });

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('safelink_custom_terms');
        if (saved) {
            setCustomTerms(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage when customTerms change
    useEffect(() => {
        if (customTerms.length > 0) {
            localStorage.setItem('safelink_custom_terms', JSON.stringify(customTerms));
        }
    }, [customTerms]);

    const allTerms = [...NOGADA_SLANG, ...customTerms];
    const filteredSlang = allTerms.filter(item =>
        item.slang.includes(filter) || item.standard.toLowerCase().includes(filter.toLowerCase())
    );

    const handleAddTerm = () => {
        if (!newTerm.slang || !newTerm.standard) return;

        const termToAdd: SlangItem = {
            slang: newTerm.slang || "",
            standard: newTerm.standard || "",
            vi: newTerm.vi || "-",
            uz: newTerm.uz || "-",
            en: newTerm.en || "-",
            km: newTerm.km || "-",
            mn: newTerm.mn || "-",
            zh: newTerm.zh || "-",
            th: newTerm.th || "-",
            ru: newTerm.ru || "-"
        };

        setCustomTerms(prev => [...prev, termToAdd]);
        setNewTerm({ slang: "", standard: "", vi: "", uz: "", en: "", km: "", mn: "", zh: "", th: "", ru: "" });
        setIsAddMode(false);
    };

    const handleDeleteTerm = (slang: string) => {
        setCustomTerms(prev => prev.filter(t => t.slang !== slang));
        const updated = customTerms.filter(t => t.slang !== slang);
        localStorage.setItem('safelink_custom_terms', JSON.stringify(updated));
    };

    const isCustomTerm = (slang: string) => customTerms.some(t => t.slang === slang);

    // Compact 모드 (PC 사이드바용)
    if (compact) {
        return (
            <div className="h-full flex flex-col">
                {/* 헤더 */}
                <div className="shrink-0 px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <Book size={16} className="text-orange-400" />
                        <h3 className="text-sm font-bold text-white">용어사전</h3>
                    </div>
                </div>

                {/* 검색 */}
                <div className="shrink-0 p-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full bg-zinc-800/50 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50"
                            placeholder="용어 검색..."
                        />
                    </div>
                </div>

                {/* 용어 목록 */}
                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
                    {filteredSlang.slice(0, 15).map((item) => (
                        <div
                            key={item.slang}
                            onClick={() => onTermSelect?.(item.slang)}
                            className="bg-zinc-800/30 hover:bg-zinc-700/50 rounded-lg p-2.5 cursor-pointer transition-colors border border-transparent hover:border-orange-500/30"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-orange-400 font-bold text-xs">{item.slang}</span>
                                <span className="text-[9px] text-zinc-500">{item.en}</span>
                            </div>
                            <span className="text-[10px] text-zinc-400">{item.standard}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-zinc-900 to-black overflow-hidden">
            {/* 헤더 */}
            <div className="shrink-0 p-5 border-b border-white/5">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">용어사전</h2>
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">8-LANGUAGE MAPPING</p>
                    </div>
                    <button
                        onClick={() => setIsAddMode(!isAddMode)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${isAddMode
                            ? "bg-zinc-700 text-white"
                            : "bg-orange-500 text-white hover:bg-orange-400"
                            }`}
                    >
                        {isAddMode ? <X size={12} /> : <Plus size={12} />}
                        {isAddMode ? "취소" : "추가"}
                    </button>
                </div>
            </div>

            {/* 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto p-5 no-scrollbar">

                {/* Add Term Form */}
                <AnimatePresence>
                    {isAddMode && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 overflow-hidden"
                        >
                            <div className="bg-zinc-900/80 border border-sw-orange/30 rounded-2xl p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={newTerm.slang}
                                        onChange={(e) => setNewTerm(prev => ({ ...prev, slang: e.target.value }))}
                                        placeholder="현장 은어 *"
                                        className="bg-zinc-800 border border-white/10 rounded-xl p-3 text-sm font-bold text-white focus:ring-2 focus:ring-sw-orange outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={newTerm.standard}
                                        onChange={(e) => setNewTerm(prev => ({ ...prev, standard: e.target.value }))}
                                        placeholder="표준어 (영문) *"
                                        className="bg-zinc-800 border border-white/10 rounded-xl p-3 text-sm font-bold text-white focus:ring-2 focus:ring-sw-orange outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { key: 'vi', label: '🇻🇳 베트남' },
                                        { key: 'uz', label: '🇺🇿 우즈벡' },
                                        { key: 'en', label: '🇺🇸 영어' },
                                        { key: 'zh', label: '🇨🇳 중국어' },
                                        { key: 'km', label: '🇰🇭 캄보디아' },
                                        { key: 'mn', label: '🇲🇳 몽골어' },
                                        { key: 'th', label: '🇹🇭 태국어' },
                                        { key: 'ru', label: '🇷🇺 러시아어' },
                                    ].map(({ key, label }) => (
                                        <input
                                            key={key}
                                            type="text"
                                            value={(newTerm as any)[key] || ""}
                                            onChange={(e) => setNewTerm(prev => ({ ...prev, [key]: e.target.value }))}
                                            placeholder={label}
                                            className="bg-zinc-800/50 border border-white/5 rounded-lg p-2 text-[11px] font-bold text-white focus:ring-1 focus:ring-sw-orange outline-none placeholder:text-zinc-600"
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleAddTerm}
                                    disabled={!newTerm.slang || !newTerm.standard}
                                    className="w-full py-3 bg-sw-orange rounded-xl font-black text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-500 transition-colors"
                                >
                                    <Check size={16} /> 용어 등록
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative mb-6 sticky top-0 z-10">
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-[1.5rem] p-5 text-sm font-bold text-white focus:ring-2 focus:ring-sw-orange outline-none transition shadow-xl"
                        placeholder="현장 용어 검색 (예: 아시바, 공구리, 데마찌)"
                    />
                    <span className="absolute right-6 top-5 opacity-40 text-xl text-white">🔍</span>
                </div>

                <div className="space-y-4">
                    {filteredSlang.map((item, idx) => (
                        <motion.div
                            key={item.slang}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => onTermSelect?.(item.slang)}
                            className="group relative bg-[#111113] p-5 rounded-2xl border border-white/5 hover:border-sw-orange/50 transition-all cursor-pointer active:scale-[0.98]"
                        >
                            {/* Delete button for custom terms */}
                            {isCustomTerm(item.slang) && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteTerm(item.slang); }}
                                    className="absolute top-3 right-3 w-6 h-6 bg-red-500/20 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <X size={12} className="text-red-400 group-hover:text-white" />
                                </button>
                            )}

                            <div className="flex justify-between items-start mb-4 pr-8">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sw-orange font-black text-xl group-hover:text-amber-500 transition-colors">{item.slang}</span>
                                        {isCustomTerm(item.slang) && (
                                            <span className="text-[8px] bg-sw-orange/20 text-sw-orange px-2 py-0.5 rounded-full font-bold">CUSTOM</span>
                                        )}
                                    </div>
                                    <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider italic">표준어: <span className="text-zinc-300">{item.standard}</span></span>
                                </div>
                                <span className="text-zinc-700 font-black text-[10px] uppercase tracking-tighter group-hover:text-sw-orange transition-colors">Fast Inject ➜</span>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {Object.entries({
                                    '🇻🇳': item.vi,
                                    '🇺🇿': item.uz,
                                    '🇺🇸': item.en,
                                    '🇨🇳': item.zh
                                }).map(([flag, val]) => (
                                    <div key={flag} className="text-[9px] bg-black/40 border border-white/5 py-1.5 px-2 rounded-lg text-zinc-400 font-bold truncate flex items-center gap-1">
                                        <span>{flag}</span>
                                        <span className="truncate">{val}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    {filteredSlang.length === 0 && (
                        <div className="text-center py-20 text-zinc-500 text-xs font-medium">
                            검색 결과가 없습니다
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
