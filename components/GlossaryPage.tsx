"use client";

import { NOGADA_SLANG } from "@/lib/constants";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check } from "lucide-react";

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

export default function GlossaryPage({ onTermSelect }: { onTermSelect?: (term: string) => void }) {
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
        // Also update localStorage
        const updated = customTerms.filter(t => t.slang !== slang);
        localStorage.setItem('safelink_custom_terms', JSON.stringify(updated));
    };

    const isCustomTerm = (slang: string) => customTerms.some(t => t.slang === slang);

    return (
        <div className="p-7 pb-28 h-full bg-zinc-950 overflow-y-auto no-scrollbar">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter">건설 은어 마스터 사전</h2>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mt-2">8-Language Professional Mapping</p>
                </div>
                <button
                    onClick={() => setIsAddMode(!isAddMode)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[11px] font-black transition-all ${isAddMode
                            ? "bg-zinc-700 text-white"
                            : "bg-sw-orange text-white hover:bg-orange-500"
                        }`}
                >
                    {isAddMode ? <X size={14} /> : <Plus size={14} />}
                    {isAddMode ? "취소" : "용어 추가"}
                </button>
            </div>

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
                    <div className="text-center py-20 text-zinc-700 text-xs font-bold uppercase tracking-widest">
                        검색 결과가 없습니다
                    </div>
                )}
            </div>
        </div>
    );
}
