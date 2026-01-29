"use client";

import { useState, useCallback, useEffect } from "react";
import InitScreen from "@/components/InitScreen";
import Header from "@/components/Header";
import LanguageChips from "@/components/LanguageChips";
import ChatPage from "@/components/ChatPage";
import ControlCenterPage from "@/components/ControlCenterPage";
import GlossaryPage from "@/components/GlossaryPage";
import DashboardPanel from "@/components/DashboardPanel";
import Navigation from "@/components/Navigation";
import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/lib/constants";
import PrivateChatModal from "@/components/PrivateChatModal";


export default function Home() {
    const [isActivated, setIsActivated] = useState(false);
    const [viewMode, setViewMode] = useState<'PC' | 'MOBILE'>('MOBILE');
    const [theme, setTheme] = useState<'dark' | 'light'>('light'); // Default to light
    const [activeTab, setActiveTab] = useState('chat');
    const [currentLang, setCurrentLang] = useState('vi-VN');
    const [quickBroadcastText, setQuickBroadcastText] = useState('');
    const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('male');
    const [lastManagerKR, setLastManagerKR] = useState('');
    const [reBroadcastTrigger, setReBroadcastTrigger] = useState(0);

    const [selectedWorker, setSelectedWorker] = useState<string | null>(null);

    // Detect PC/Mobile on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth > 1024) setViewMode('PC');
        }
    }, []);

    if (!isActivated) {
        return <InitScreen onActivate={() => setIsActivated(true)} />;
    }

    const currentLangName = LANGUAGES.find(l => l.code === currentLang)?.name || "Vietnam";

    const handleBroadcastFromControl = (text: string) => {
        setActiveTab('chat');
        setQuickBroadcastText(text);
    };

    const handleQuickBroadcast = (text: string) => {
        setQuickBroadcastText(text);
    };

    const handleSelectWorker = (workerName: string) => {
        setSelectedWorker(workerName);
        setActiveTab('chat');
    };

    const handleLanguageChange = (newLang: string) => {
        setCurrentLang(newLang);
        if (lastManagerKR) {
            setReBroadcastTrigger(prev => prev + 1);
        }
    };

    const handleLastManagerText = (text: string) => {
        setLastManagerKR(text);
    };

    return (
        <main className={cn(
            "h-[100dvh] flex flex-col overflow-hidden font-sans transition-colors duration-500",
            theme === 'dark'
                ? "bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white"
                : "bg-white text-black",
            viewMode === 'PC' ? "pc-layout" : "mobile-layout"
        )}>
            {/* 1. Header (PC/Mobile Toggle & Live Status & Theme Toggle) */}
            <Header
                viewMode={viewMode}
                onToggleView={setViewMode}
                theme={theme}
                onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            />

            {/* 2. Top Language Selector */}
            <LanguageChips
                currentLang={currentLang}
                onSelectLang={handleLanguageChange}
                theme={theme}
            />

            <div className="flex-1 relative overflow-hidden flex">
                {viewMode === 'PC' ? (
                    /* --- PC MODE: PREMIUM 3-COLUMN DASHBOARD --- */
                    <div className="flex w-full h-full gap-4 p-4">
                        {/* LEFT: FIELD DASHBOARD (Compact for 70%+ Chat Ratio) */}
                        <div className={cn(
                            "w-[260px] h-full overflow-hidden rounded-3xl backdrop-blur-2xl border shadow-2xl flex flex-col transition-colors",
                            theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-xl"
                        )}>
                            <DashboardPanel
                                onQuickBroadcast={handleQuickBroadcast}
                                onSelectWorker={handleSelectWorker}
                                theme={theme}
                            />
                        </div>

                        {/* MIDDLE: REAL-TIME INTERPRETATION CANVAS */}
                        <div className={cn(
                            "flex-1 h-full overflow-hidden rounded-3xl backdrop-blur-3xl border shadow-inner relative transition-colors",
                            theme === 'dark' ? "bg-gradient-to-b from-white/[0.02] to-white/[0.05] border-white/10" : "bg-white border-slate-200 shadow-sm"
                        )}>
                            <div className="absolute top-4 left-6 z-10 flex items-center gap-4">
                                <span className="text-[10px] font-black tracking-[0.2em] text-orange-500 uppercase">
                                    Target: {currentLangName} Mode
                                </span>
                                <button
                                    onClick={() => setVoiceGender(prev => prev === 'male' ? 'female' : 'male')}
                                    title="음성 성별 변경 (남성/여성)"
                                    className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1.5 shadow-sm",
                                        theme === 'dark'
                                            ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                                            : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
                                    )}
                                >
                                    {voiceGender === 'male' ? '👨 남성' : '👩 여성'}
                                </button>
                                {/* Private Chat Modal Integration */}
                                {selectedWorker && (
                                    <PrivateChatModal
                                        workerName={selectedWorker}
                                        workerCountry={""} // Assuming country is not available from selectedWorker string
                                        onClose={() => setSelectedWorker(null)}
                                        voiceGender={voiceGender}
                                        onVoiceGenderChange={setVoiceGender}
                                    />
                                )}
                            </div>
                            <ChatPage
                                currentLang={currentLang}
                                langLabel={currentLangName}
                                quickBroadcast={quickBroadcastText}
                                onQuickBroadcastDone={() => setQuickBroadcastText('')}
                                voiceGender={voiceGender}
                                onVoiceGenderChange={setVoiceGender}
                                mode={selectedWorker ? "private" : "interpretation"}
                                forcedWorkerName={selectedWorker || undefined}
                                onLastManagerText={handleLastManagerText}
                                reBroadcastTrigger={reBroadcastTrigger}
                                theme={theme}
                            />
                        </div>

                        {/* RIGHT: COMMAND CENTER & GLOSSARY (Compact for 70%+ Chat Ratio) */}
                        <div className="w-[300px] h-full flex flex-col gap-4">
                            <div className={cn(
                                "flex-1 overflow-hidden rounded-3xl backdrop-blur-2xl border shadow-xl transition-colors",
                                theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                            )}>
                                <ControlCenterPage onBroadcast={handleBroadcastFromControl} theme={theme} />
                            </div>

                            <div className={cn(
                                "h-[280px] overflow-hidden rounded-3xl backdrop-blur-2xl border shadow-xl transition-colors",
                                theme === 'dark' ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                            )}>
                                <GlossaryPage compact theme={theme} />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* --- MOBILE MODE: TABS --- */
                    <div className="w-full h-full relative">
                        <div className={cn("absolute inset-0 p-4", activeTab === 'dashboard' ? 'z-10 overflow-y-auto' : 'z-0 invisible', theme === 'dark' ? "bg-zinc-950" : "bg-slate-50")}>
                            <DashboardPanel
                                onQuickBroadcast={handleQuickBroadcast}
                                onSelectWorker={handleSelectWorker}
                                theme={theme}
                            />
                        </div>
                        <div className={cn("absolute inset-0 bg-white", activeTab === 'chat' ? 'z-10' : 'z-0 invisible')}>
                            <ChatPage
                                currentLang={currentLang}
                                langLabel={currentLangName}
                                quickBroadcast={quickBroadcastText}
                                onQuickBroadcastDone={() => setQuickBroadcastText('')}
                                voiceGender={voiceGender}
                                onVoiceGenderChange={setVoiceGender}
                                mode={selectedWorker ? "private" : "interpretation"}
                                forcedWorkerName={selectedWorker || undefined}
                                onLastManagerText={handleLastManagerText}
                                reBroadcastTrigger={reBroadcastTrigger}
                                theme={theme}
                            />
                        </div>
                        <div className={cn("absolute inset-0 p-4", activeTab === 'control' ? 'z-10 overflow-y-auto' : 'z-0 invisible', theme === 'dark' ? "bg-zinc-900" : "bg-slate-50")}>
                            <ControlCenterPage onBroadcast={handleBroadcastFromControl} theme={theme} />
                        </div>
                        <div className={cn("absolute inset-0 p-4", activeTab === 'glossary' ? 'z-10 overflow-y-auto' : 'z-0 invisible', theme === 'dark' ? "bg-zinc-900" : "bg-slate-50")}>
                            <div className="mb-4 flex items-center gap-2">
                                <h2 className={cn("text-xl font-black", theme === 'dark' ? "text-white" : "text-slate-900")}>용어사전</h2>
                            </div>
                            <GlossaryPage theme={theme} />
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Navigation Bar (Mobile) */}
            {viewMode === 'MOBILE' && (
                <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
            )}
        </main>
    );
}
