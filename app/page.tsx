"use client";

import { useState, useCallback } from "react";
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

export default function Home() {
  const [isActivated, setIsActivated] = useState(false);
  const [viewMode, setViewMode] = useState<'PC' | 'MOBILE'>('MOBILE');
  const [activeTab, setActiveTab] = useState('chat');
  const [currentLang, setCurrentLang] = useState('vi-VN');
  const [quickBroadcastText, setQuickBroadcastText] = useState('');
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('male');
  const [lastManagerKR, setLastManagerKR] = useState(''); // 마지막 관리자 발화 저장
  const [reBroadcastTrigger, setReBroadcastTrigger] = useState(0); // 재송출 트리거

  if (!isActivated) {
    return <InitScreen onActivate={() => setIsActivated(true)} />;
  }

  const currentLangLabel = LANGUAGES.find(l => l.code === currentLang)?.name.substring(0, 2) || "VI";

  const handleBroadcastFromControl = (text: string) => {
    setActiveTab('chat');
    setQuickBroadcastText(text);
  };

  const handleQuickBroadcast = (text: string) => {
    setQuickBroadcastText(text);
  };

  // 언어 변경 시 재송출 (원본 HTML의 selectLanguage 기능)
  const handleLanguageChange = (newLang: string) => {
    setCurrentLang(newLang);
    // 마지막 관리자 메시지가 있으면 재송출 트리거
    if (lastManagerKR) {
      setReBroadcastTrigger(prev => prev + 1);
    }
  };

  // ChatPage에서 마지막 관리자 메시지 저장
  const handleLastManagerText = (text: string) => {
    setLastManagerKR(text);
  };

  return (
    <main className={cn(
      "bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white h-[100dvh] flex flex-col overflow-hidden",
      viewMode === 'PC' ? "pc-layout" : "mobile-layout"
    )}>
      <Header viewMode={viewMode} onToggleView={setViewMode} />

      <LanguageChips
        currentLang={currentLang}
        onSelectLang={handleLanguageChange}
      />

      <div className="flex-1 relative overflow-hidden flex">
        {viewMode === 'PC' ? (
          // PC MODE: 3열 레이아웃 (좌: 대시보드, 중: 채팅, 우: 관제+용어)
          <div className="flex w-full h-full gap-3 p-4">
            {/* 좌측: 대시보드 패널 */}
            <div className="w-[280px] h-full overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/80 backdrop-blur-xl border border-white/5 shadow-xl">
              <DashboardPanel onQuickBroadcast={handleQuickBroadcast} />
            </div>

            {/* 중앙: 메인 채팅 영역 */}
            <div className="flex-1 h-full overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-800/50 to-zinc-900/80 backdrop-blur-xl border border-white/5 shadow-2xl">
              <ChatPage
                currentLang={currentLang}
                langLabel={currentLangLabel}
                quickBroadcast={quickBroadcastText}
                onQuickBroadcastDone={() => setQuickBroadcastText('')}
                voiceGender={voiceGender}
                onVoiceGenderChange={setVoiceGender}
                lastManagerKR={lastManagerKR}
                onLastManagerText={handleLastManagerText}
                reBroadcastTrigger={reBroadcastTrigger}
              />
            </div>

            {/* 우측: 관제센터 + 용어사전 */}
            <div className="w-[320px] h-full flex flex-col gap-3">
              {/* 관제센터 */}
              <div className="flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800/60 to-zinc-900/90 backdrop-blur-xl border border-white/5 shadow-xl">
                <ControlCenterPage onBroadcast={handleBroadcastFromControl} />
              </div>

              {/* 용어사전 - 컴팩트 */}
              <div className="h-[240px] overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800/40 to-zinc-900/80 backdrop-blur-xl border border-white/5 shadow-xl">
                <GlossaryPage compact />
              </div>
            </div>
          </div>
        ) : (
          // MOBILE MODE: 탭 전환
          <div className="w-full h-full relative">
            <div className={cn("absolute inset-0", activeTab === 'chat' ? 'z-10' : 'z-0 invisible')}>
              <ChatPage
                currentLang={currentLang}
                langLabel={currentLangLabel}
                quickBroadcast={quickBroadcastText}
                onQuickBroadcastDone={() => setQuickBroadcastText('')}
                voiceGender={voiceGender}
                onVoiceGenderChange={setVoiceGender}
                lastManagerKR={lastManagerKR}
                onLastManagerText={handleLastManagerText}
                reBroadcastTrigger={reBroadcastTrigger}
              />
            </div>
            <div className={cn("absolute inset-0", activeTab === 'control' ? 'z-10' : 'z-0 invisible')}>
              <ControlCenterPage onBroadcast={handleBroadcastFromControl} />
            </div>
            <div className={cn("absolute inset-0", activeTab === 'glossary' ? 'z-10' : 'z-0 invisible')}>
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
