"use client";

import { cn } from "@/lib/utils";
import { MessageCircle, Monitor, Book, LayoutDashboard } from "lucide-react";

interface NavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
    const items = [
        { id: 'dashboard', label: '상황판', icon: <LayoutDashboard size={20} /> },
        { id: 'chat', label: '통역', icon: <MessageCircle size={20} /> },
        { id: 'control', label: '관제', icon: <Monitor size={20} /> },
        { id: 'glossary', label: '용어', icon: <Book size={20} /> },
    ];

    return (
        <nav className="h-[70px] bg-white border-t border-slate-200 flex justify-around items-center pb-safe select-none z-50 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                        "flex flex-col items-center gap-1 w-full h-full justify-center transition-all active:scale-95",
                        activeTab === item.id
                            ? "text-orange-400"
                            : "text-zinc-600 hover:text-zinc-400"
                    )}
                >
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        activeTab === item.id
                            ? "bg-orange-500/20 shadow-lg shadow-orange-500/10"
                            : "bg-transparent"
                    )}>
                        {item.icon}
                    </div>
                    <span className={cn(
                        "text-[9px] font-bold transition-all",
                        activeTab === item.id ? "opacity-100" : "opacity-60"
                    )}>
                        {item.label}
                    </span>
                </button>
            ))}
        </nav>
    );
}
