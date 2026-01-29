"use client";

import { cn } from "@/lib/utils";
import { SITES as DEFAULT_SITES } from "@/lib/constants";
import { useState, useEffect } from "react";
import { Plus, X, Edit3, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Site {
    id: number;
    name: string;
    region: string;
    active: boolean;
}

export default function SitesPage() {
    const [sites, setSites] = useState<Site[]>(DEFAULT_SITES);
    const [selectedSites, setSelectedSites] = useState<number[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ name: "", region: "" });
    const [isAddMode, setIsAddMode] = useState(false);
    const [newSite, setNewSite] = useState({ name: "", region: "서울" });

    // Load from localStorage - clear old dummy data if it exists
    useEffect(() => {
        const savedSites = localStorage.getItem('safelink_sites');
        if (savedSites) {
            const parsed = JSON.parse(savedSites);
            // Check if it's old dummy data (starts with 서원-)
            if (parsed.length > 0 && parsed[0].name?.startsWith('서원-')) {
                // Clear old data and use new defaults
                localStorage.removeItem('safelink_sites');
                setSites(DEFAULT_SITES);
                setSelectedSites(DEFAULT_SITES.map(s => s.id));
            } else {
                setSites(parsed);
                setSelectedSites(parsed.map((s: Site) => s.id));
            }
        } else {
            setSelectedSites(DEFAULT_SITES.map(s => s.id));
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        // Only save if sites have been modified from default
        if (JSON.stringify(sites) !== JSON.stringify(DEFAULT_SITES)) {
            localStorage.setItem('safelink_sites', JSON.stringify(sites));
        }
    }, [sites]);

    const toggleSite = (id: number) => {
        setSelectedSites(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedSites.length === sites.length) setSelectedSites([]);
        else setSelectedSites(sites.map(s => s.id));
    };

    const startEdit = (site: Site) => {
        setEditingId(site.id);
        setEditForm({ name: site.name, region: site.region });
    };

    const saveEdit = () => {
        if (!editingId) return;
        setSites(prev => prev.map(s =>
            s.id === editingId ? { ...s, name: editForm.name, region: editForm.region } : s
        ));
        setEditingId(null);
    };

    const deleteSite = (id: number) => {
        setSites(prev => prev.filter(s => s.id !== id));
        setSelectedSites(prev => prev.filter(sid => sid !== id));
    };

    const addSite = () => {
        if (!newSite.name) return;
        const maxId = Math.max(...sites.map(s => s.id), 0);
        setSites(prev => [...prev, { id: maxId + 1, name: newSite.name, region: newSite.region, active: true }]);
        setNewSite({ name: "", region: "서울" });
        setIsAddMode(false);
    };

    const regions = ['서울', '경기', '부산', '인천', '대구', '광주', '대전', '울산', '세종', '제주'];

    return (
        <div className="p-7 pb-28 h-full bg-zinc-950 overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-end mb-6 sticky top-0 py-4 bg-zinc-950/95 backdrop-blur z-10">
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tighter">현장 관제 사령실</h2>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em] mt-2 italic">Global Broadcast SyncZones ({sites.length})</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAddMode(!isAddMode)}
                        className={cn(
                            "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-black transition-all",
                            isAddMode ? "bg-zinc-700 text-white" : "bg-sw-orange text-white hover:bg-orange-500"
                        )}
                    >
                        {isAddMode ? <X size={12} /> : <Plus size={12} />}
                        {isAddMode ? "취소" : "현장 추가"}
                    </button>
                    <button
                        onClick={selectAll}
                        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 rounded-xl text-[10px] font-black text-zinc-300 active:scale-95 transition-all"
                    >
                        {selectedSites.length === sites.length ? "전체 해제" : "전체 선택"}
                    </button>
                </div>
            </div>

            {/* Add Site Form */}
            <AnimatePresence>
                {isAddMode && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="bg-zinc-900/80 border border-sw-orange/30 rounded-2xl p-5 flex gap-3 items-end">
                            <div className="flex-1">
                                <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">현장명</label>
                                <input
                                    type="text"
                                    value={newSite.name}
                                    onChange={(e) => setNewSite(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="예: 서원-31"
                                    className="w-full bg-zinc-800 border border-white/10 rounded-xl p-3 text-sm font-bold text-white focus:ring-2 focus:ring-sw-orange outline-none"
                                />
                            </div>
                            <div className="w-32">
                                <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">지역</label>
                                <select
                                    title="Region Selection"
                                    value={newSite.region}
                                    onChange={(e) => setNewSite(prev => ({ ...prev, region: e.target.value }))}
                                    className="w-full bg-zinc-800 border border-white/10 rounded-xl p-3 text-sm font-bold text-white focus:ring-2 focus:ring-sw-orange outline-none"
                                >
                                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <button
                                onClick={addSite}
                                disabled={!newSite.name}
                                className="px-5 py-3 bg-sw-orange rounded-xl font-black text-white flex items-center gap-2 disabled:opacity-50 hover:bg-orange-500 transition-colors"
                            >
                                <Check size={14} /> 추가
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {sites.map((site) => {
                    const isSelected = selectedSites.includes(site.id);
                    const isEditing = editingId === site.id;

                    return (
                        <motion.div
                            key={site.id}
                            layout
                            className={cn(
                                "bg-[#111113] border-[1.5px] rounded-xl p-4 flex flex-col justify-between transition-all duration-200 select-none relative group",
                                isSelected
                                    ? "border-sw-orange bg-sw-orange/5 shadow-[inset_0_0_20px_rgba(255,107,0,0.1)]"
                                    : "border-[#222] hover:border-zinc-700"
                            )}
                        >
                            {/* Edit/Delete buttons */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); startEdit(site); }}
                                    className="w-6 h-6 bg-zinc-800 hover:bg-zinc-700 rounded-md flex items-center justify-center"
                                    title="현장 편집"
                                >
                                    <Edit3 size={10} className="text-zinc-400" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteSite(site.id); }}
                                    className="w-6 h-6 bg-red-500/20 hover:bg-red-500 rounded-md flex items-center justify-center"
                                    title="현장 삭제"
                                >
                                    <Trash2 size={10} className="text-red-400 hover:text-white" />
                                </button>
                            </div>

                            <div
                                onClick={() => !isEditing && toggleSite(site.id)}
                                className="cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={cn(
                                        "w-2 h-2 rounded-full",
                                        isSelected ? "bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse" : "bg-zinc-800"
                                    )}></span>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className="w-4 h-4 accent-sw-orange rounded cursor-pointer pointer-events-none"
                                        title="현장 선택"
                                    />
                                </div>

                                {isEditing ? (
                                    <div className="space-y-2" onClick={e => e.stopPropagation()}>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-zinc-900 border border-sw-orange/50 rounded-lg p-2 text-[11px] font-bold text-white outline-none"
                                            placeholder="현장명"
                                            title="현장명 편집"
                                        />
                                        <select
                                            title="Edit Region"
                                            value={editForm.region}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, region: e.target.value }))}
                                            className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-[10px] font-bold text-white outline-none"
                                        >
                                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                        <button
                                            onClick={saveEdit}
                                            className="w-full py-1.5 bg-sw-orange rounded-lg text-[10px] font-black text-white"
                                        >
                                            저장
                                        </button>
                                    </div>
                                ) : (
                                    <div className="overflow-hidden">
                                        <div className="text-[10px] text-zinc-500 font-bold mb-0.5 truncate">{site.region}</div>
                                        <div className="text-[12px] font-black text-zinc-200 truncate" title={site.name}>{site.name}</div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
