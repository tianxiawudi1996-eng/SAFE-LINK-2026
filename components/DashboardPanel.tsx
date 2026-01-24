"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LANGUAGES } from "@/lib/constants";
import { motion } from "framer-motion";
import {
    Cloud, Sun, CloudRain, Wind, Thermometer,
    MessageSquare, Volume2, Users, TrendingUp,
    AlertTriangle, Shield, Zap, Radio
} from "lucide-react";

interface DashboardPanelProps {
    onQuickBroadcast?: (text: string) => void;
}

// 빠른 지시 템플릿
const QUICK_COMMANDS = [
    { id: 'helmet', text: '안전모 착용하세요', icon: '🪖', category: 'safety', color: 'emerald' },
    { id: 'stop', text: '작업 중지! 대기하세요', icon: '🛑', category: 'emergency', color: 'red' },
    { id: 'break', text: '휴식 시간입니다', icon: '☕', category: 'general', color: 'blue' },
    { id: 'start', text: '작업 시작하세요', icon: '🚀', category: 'work', color: 'orange' },
    { id: 'danger', text: '위험 구역 접근 금지', icon: '⚠️', category: 'emergency', color: 'red' },
    { id: 'check', text: '안전 장비 점검하세요', icon: '🔍', category: 'safety', color: 'emerald' },
];

export default function DashboardPanel({ onQuickBroadcast }: DashboardPanelProps) {
    const [weather, setWeather] = useState({ temp: 5, condition: 'cloudy', humidity: 65 });
    const [stats, setStats] = useState({
        todayMessages: 24,
        todayTTS: 18,
        activeWorkers: 12,
        languages: [
            { code: 'vi', count: 5, flag: '🇻🇳' },
            { code: 'uz', count: 3, flag: '🇺🇿' },
            { code: 'mn', count: 2, flag: '🇲🇳' },
            { code: 'zh', count: 2, flag: '🇨🇳' },
        ]
    });

    // 간단한 날씨 시뮬레이션 (실제로는 API 연동)
    useEffect(() => {
        const conditions = ['sunny', 'cloudy', 'rainy'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        setWeather({
            temp: Math.floor(Math.random() * 10) + 1,
            condition: randomCondition,
            humidity: Math.floor(Math.random() * 30) + 50
        });
    }, []);

    const getWeatherIcon = () => {
        switch (weather.condition) {
            case 'sunny': return <Sun size={24} className="text-yellow-400" />;
            case 'rainy': return <CloudRain size={24} className="text-blue-400" />;
            default: return <Cloud size={24} className="text-zinc-400" />;
        }
    };

    const handleQuickCommand = (command: typeof QUICK_COMMANDS[0]) => {
        if (onQuickBroadcast) {
            onQuickBroadcast(command.text);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            {/* 헤더 */}
            <div className="shrink-0 px-4 py-3 border-b border-white/5 bg-gradient-to-r from-orange-500/10 to-transparent">
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-orange-400" />
                    <h3 className="text-sm font-bold text-white">현장 대시보드</h3>
                </div>
            </div>

            {/* 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {/* 날씨 카드 */}
                <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/80 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">현장 날씨</span>
                        <span className="text-[9px] text-zinc-600">서울 강남구</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center">
                            {getWeatherIcon()}
                        </div>
                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-white">{weather.temp}</span>
                                <span className="text-zinc-500">°C</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                <span className="flex items-center gap-1">
                                    <Wind size={10} /> 12km/h
                                </span>
                                <span className="flex items-center gap-1">
                                    💧 {weather.humidity}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 통계 카드 */}
                <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/80 rounded-xl p-4 border border-white/5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">오늘 통계</span>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="bg-zinc-800/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <MessageSquare size={12} className="text-cyan-400" />
                                <span className="text-[9px] text-zinc-500">번역 메시지</span>
                            </div>
                            <span className="text-xl font-black text-white">{stats.todayMessages}</span>
                        </div>
                        <div className="bg-zinc-800/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Volume2 size={12} className="text-orange-400" />
                                <span className="text-[9px] text-zinc-500">TTS 재생</span>
                            </div>
                            <span className="text-xl font-black text-white">{stats.todayTTS}</span>
                        </div>
                    </div>
                </div>

                {/* 작업자 현황 */}
                <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/80 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">작업자 현황</span>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            {stats.activeWorkers}명 접속
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {stats.languages.map(lang => (
                            <div key={lang.code} className="flex items-center gap-1.5 bg-zinc-800/50 rounded-lg px-2.5 py-1.5">
                                <span className="text-sm">{lang.flag}</span>
                                <span className="text-[10px] font-bold text-white">{lang.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 빠른 지시 버튼 */}
                <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-900/80 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">빠른 지시</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {QUICK_COMMANDS.map(cmd => (
                            <motion.button
                                key={cmd.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleQuickCommand(cmd)}
                                className={cn(
                                    "flex items-center gap-2 p-2.5 rounded-lg text-left transition-all",
                                    cmd.color === 'emerald' && "bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20",
                                    cmd.color === 'red' && "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20",
                                    cmd.color === 'blue' && "bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20",
                                    cmd.color === 'orange' && "bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20"
                                )}
                            >
                                <span className="text-lg">{cmd.icon}</span>
                                <span className={cn(
                                    "text-[10px] font-bold leading-tight",
                                    cmd.color === 'emerald' && "text-emerald-400",
                                    cmd.color === 'red' && "text-red-400",
                                    cmd.color === 'blue' && "text-blue-400",
                                    cmd.color === 'orange' && "text-orange-400"
                                )}>
                                    {cmd.text}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
