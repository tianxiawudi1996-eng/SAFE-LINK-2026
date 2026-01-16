"use client";

import { useState } from "react";
import InitScreen from "@/components/InitScreen";
import Header from "@/components/Header";
import LanguageChips from "@/components/LanguageChips";
import ChatPage from "@/components/ChatPage";
import SitesPage from "@/components/SitesPage";
import GlossaryPage from "@/components/GlossaryPage";
import Navigation from "@/components/Navigation";
import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/lib/constants";

export default function Home() {
  const [isActivated, setIsActivated] = useState(false);
  const [viewMode, setViewMode] = useState<'PC' | 'MOBILE'>('MOBILE');
  const [activeTab, setActiveTab] = useState('chat');
  const [currentLang, setCurrentLang] = useState('vi-VN');

  if (!isActivated) {
    return <InitScreen onActivate={() => setIsActivated(true)} />;
  }

  const currentLangLabel = LANGUAGES.find(l => l.code === currentLang)?.name.substring(0, 2) || "VI";

  return (
    <main className={cn(
      "bg-sw-bg text-white h-[100dvh] flex flex-col overflow-hidden",
      viewMode === 'PC' ? "pc-layout" : "mobile-layout"
    )}>
      <Header viewMode={viewMode} onToggleView={setViewMode} />

      <LanguageChips
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
      />

      <div className="flex-1 relative overflow-hidden flex">
        {viewMode === 'PC' ? (
          // PC MODE: 3-Column Grid
          <div className="flex w-full h-full divide-x divide-white/5">
            <div className="w-[340px] h-full overflow-hidden bg-black/20">
              <SitesPage />
            </div>
            <div className="flex-1 h-full overflow-hidden bg-zinc-900/30">
              <ChatPage currentLang={currentLang} langLabel={currentLangLabel} />
            </div>
            <div className="w-[370px] h-full overflow-hidden bg-black/20">
              <GlossaryPage />
            </div>
          </div>
        ) : (
          // MOBILE MODE: Tab Switcher
          <div className="w-full h-full relative">
            <div className={cn("absolute inset-0", activeTab === 'chat' ? 'z-10' : 'z-0 invisible')}>
              <ChatPage currentLang={currentLang} langLabel={currentLangLabel} />
            </div>
            <div className={cn("absolute inset-0 bg-sw-bg", activeTab === 'sites' ? 'z-10' : 'z-0 invisible')}>
              <SitesPage />
            </div>
            <div className={cn("absolute inset-0 bg-sw-bg", activeTab === 'glossary' ? 'z-10' : 'z-0 invisible')}>
              <GlossaryPage />
            </div>
          </div>
        )}
      </div>

      {viewMode === 'MOBILE' && (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </main>
  );
}
