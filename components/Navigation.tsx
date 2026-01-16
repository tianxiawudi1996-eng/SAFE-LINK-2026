"use client";

import { cn } from "@/lib/utils";
import { MessageCircle, Globe, Book } from "lucide-react";

interface NavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
    const items = [
        { id: 'chat', label: '통역센터', icon: <MessageCircle size={24} /> },
        { id: 'sites', label: '현장관리', icon: <Globe size={24} /> },
        { id: 'glossary', label: '용어사전', icon: <Book size={24} /> },
    ];

    return (
        <nav className="h-[75px] bg-[#0D0D0E] border-t border-white/10 flex justify-around items-center pb-safe box-border select-none z-50 shrink-0">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                        "flex flex-col items-center gap-1 w-full h-full justify-center transition-colors active:scale-95",
                        activeTab === item.id ? "text-sw-orange" : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    {item.icon}
                    <span className="text-[10px] font-bold">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}
