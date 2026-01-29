"use client";

import { useState, useEffect } from 'react';
import { getTermsAction, saveTermAction } from '@/app/actions';
import { DictionaryEntry } from '@/lib/slang-dictionary';
import { ArrowLeft, Save, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function SlangAdminPage() {
    const [terms, setTerms] = useState<DictionaryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTerm, setEditingTerm] = useState<Partial<DictionaryEntry> | null>(null);

    useEffect(() => {
        loadTerms();
    }, []);

    const loadTerms = async () => {
        setIsLoading(true);
        const data = await getTermsAction();
        setTerms(data);
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!editingTerm || !editingTerm.krSlang || !editingTerm.krStandard) return;

        setIsLoading(true);
        const updated = await saveTermAction(editingTerm);
        setTerms(updated);
        setEditingTerm(null);
        setIsLoading(false);
    };

    const filtered = terms.filter(t =>
        t.krSlang.includes(searchTerm) || t.krStandard.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 bg-white rounded-full shadow hover:bg-slate-100 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight">Site Slang Manager</h1>
                            <p className="text-slate-500">Global SaaS Dictionary Admin • Quad-Mapping System</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setEditingTerm({ krSlang: '', krStandard: '', translations: {} })}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                    >
                        <Plus size={20} />
                        Add New Term
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Korean Slang or Standard term..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-sm text-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-wider">Source (KR Slang)</th>
                                    <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-wider">Standard (KR)</th>
                                    <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-wider">Mappings (Sample)</th>
                                    <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="p-10 text-center text-slate-400">Loading Dictionary...</td></tr>
                                ) : filtered.map((term) => (
                                    <tr key={term.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-6 font-bold text-lg">{term.krSlang}</td>
                                        <td className="p-6 text-slate-600 font-medium">{term.krStandard}</td>
                                        <td className="p-6">
                                            <div className="flex gap-2 flex-wrap">
                                                {Object.entries(term.translations || {}).slice(0, 3).map(([code, val]) => (
                                                    <span key={code} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold border border-blue-100">
                                                        {code}: {val.standard}
                                                    </span>
                                                ))}
                                                {Object.keys(term.translations || {}).length > 3 && <span className="text-xs text-slate-400 self-center">+More</span>}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <button
                                                onClick={() => setEditingTerm(term)}
                                                className="text-slate-400 hover:text-blue-600 font-bold text-sm underline decoration-2 underline-offset-4"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingTerm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-2xl font-black">
                                {editingTerm.id ? 'Edit Term' : 'New Term'}
                            </h2>
                            <button onClick={() => setEditingTerm(null)} className="text-slate-400 hover:text-slate-600">Cancel</button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">KR Slang (Input)</label>
                                    <input
                                        className="w-full p-4 bg-slate-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none font-bold"
                                        value={editingTerm.krSlang || ''}
                                        onChange={e => setEditingTerm({ ...editingTerm, krSlang: e.target.value })}
                                        placeholder="e.g. 공구리"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase mb-2">KR Standard (Output)</label>
                                    <input
                                        className="w-full p-4 bg-slate-50 rounded-xl border-2 border-transparent focus:border-blue-500 outline-none font-bold"
                                        value={editingTerm.krStandard || ''}
                                        onChange={e => setEditingTerm({ ...editingTerm, krStandard: e.target.value })}
                                        placeholder="e.g. 콘크리트"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase mb-2">Target Mappings (JSON)</label>
                                <textarea
                                    aria-label="Target Mappings JSON"
                                    className="w-full h-40 p-4 bg-slate-900 text-emerald-400 font-mono text-sm rounded-xl border-none outline-none"
                                    value={JSON.stringify(editingTerm.translations, null, 2)}
                                    onChange={e => {
                                        try {
                                            const parsed = JSON.parse(e.target.value);
                                            setEditingTerm({ ...editingTerm, translations: parsed });
                                        } catch (err) {
                                            // Handle invalid JSON lightly
                                        }
                                    }}
                                />
                                <p className="text-xs text-slate-400 mt-2">Format: {"{\"en-US\": {\"standard\": \"Concrete\", \"slang\": \"Mud\"}}"}</p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl active:scale-95"
                            >
                                <Save size={20} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
