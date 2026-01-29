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

export default function Home() {
  const [isActivated, setIsActivated] = useState(false);
  const [viewMode, setViewMode] = useState<'PC' | 'MOBILE'>('MOBILE');
  const [activeTab, setActiveTab] = useState('chat');
  const [currentLang, setCurrentLang] = useState('vi-VN');
  const [quickBroadcastText, setQuickBroadcastText] = useState('');
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('female');

  useEffect(() => {
    const saved = localStorage.getItem('voiceGender');
    if (saved === 'male' || saved === 'female') {
      setVoiceGender(saved as 'male' | 'female');
    }
  }, []);

  const handleVoiceGenderChange = (gender: 'male' | 'female') => {
    setVoiceGender(gender);
    localStorage.setItem('voiceGender', gender);
  };

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
      "bg-white text-slate-900 h-[100dvh] flex flex-col overflow-hidden font-sans",
      viewMode === 'PC' ? "pc-layout" : "mobile-layout"
    )}>
      <Header viewMode={viewMode} onToggleView={setViewMode} />

      <div className="bg-slate-50 border-b border-slate-200 shadow-sm z-30">
        <LanguageChips
          currentLang={currentLang}
          onSelectLang={handleLanguageChange}
        />
      </div>

      <div className="flex-1 relative overflow-hidden flex bg-slate-100/50">
        {viewMode === 'PC' ? (
          // PC MODE: 3열 레이아웃 (좌: 대시보드 15%, 중: 채팅 70%, 우: 관제 15%)
          <div className="flex w-full h-full gap-4 p-4">
            {/* 좌측: 대시보드 패널 */}
            <div className="w-[200px] h-full overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 shadow-sm">
              <DashboardPanel onQuickBroadcast={handleQuickBroadcast} />
            </div>

            {/* 중앙: 메인 채팅 영역 (와이드 뷰) */}
            <div className="flex-[3] h-full overflow-hidden rounded-[3rem] bg-white border border-slate-200 shadow-xl overflow-hidden">
              <ChatPage
                currentLang={currentLang}
                langLabel={currentLangLabel}
                quickBroadcast={quickBroadcastText}
                onQuickBroadcastDone={() => setQuickBroadcastText('')}
                voiceGender={voiceGender}
                onVoiceGenderChange={handleVoiceGenderChange}
                lastManagerKR={lastManagerKR}
                onLastManagerText={handleLastManagerText}
                reBroadcastTrigger={reBroadcastTrigger}
                mode="interpretation"
              />
            </div>

            {/* 우측: 관제센터 */}
            <div className="w-[260px] h-full flex flex-col gap-4">
              <div className="flex-1 overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 shadow-sm">
                <ControlCenterPage onBroadcast={handleBroadcastFromControl} />
              </div>
              <div className="h-[200px] overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 shadow-sm">
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
                onVoiceGenderChange={handleVoiceGenderChange}
                lastManagerKR={lastManagerKR}
                onLastManagerText={handleLastManagerText}
                reBroadcastTrigger={reBroadcastTrigger}
                mode="interpretation"
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
