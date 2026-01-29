'use client';

import { useEffect, useState, Suspense } from 'react';
import ChatPage from '@/components/ChatPage';
import { useSearchParams } from 'next/navigation';

function ChatContent() {
    const searchParams = useSearchParams();
    const roleParam = searchParams.get('role');

    const [userLang, setUserLang] = useState('ko-KR');
    const [langLabel, setLangLabel] = useState('Korean');
    const [userGender, setUserGender] = useState<'male' | 'female'>('female');

    useEffect(() => {
        const savedLang = localStorage.getItem('userLanguage');
        const savedUserStr = localStorage.getItem('user');

        const map: Record<string, { code: string; label: string }> = {
            'Vietnamese': { code: 'vi-VN', label: 'Vietnamese' },
            'Chinese': { code: 'zh-CN', label: 'Chinese' },
            'Uzbek': { code: 'uz-UZ', label: 'Uzbek' },
            'Thai': { code: 'th-TH', label: 'Thai' },
            'Russian': { code: 'ru-RU', label: 'Russian' },
            'Mongolian': { code: 'mn-MN', label: 'Mongolian' },
            'Khmer': { code: 'km-KH', label: 'Khmer' },
            'English': { code: 'en-US', label: 'English' },
            'Korean': { code: 'ko-KR', label: 'Korean' },
        };

        if (savedUserStr) {
            try {
                const user = JSON.parse(savedUserStr);
                const profile = user.profile || {};
                const gender = user.gender || profile.gender;
                const language = user.language || profile.language;

                if (gender === 'male' || gender === 'female') {
                    setUserGender(gender);
                }

                if (language && map[language]) {
                    setUserLang(map[language].code);
                    setLangLabel(map[language].label);
                }
            } catch (e) { }
        }

        if (savedLang && map[savedLang]) {
            setUserLang(map[savedLang].code);
            setLangLabel(map[savedLang].label);
        }
    }, []);

    const handleVoiceGenderChange = (gender: 'male' | 'female') => {
        setUserGender(gender);
        // Save to user object in localStorage if possible
        const savedUserStr = localStorage.getItem('user');
        if (savedUserStr) {
            try {
                const user = JSON.parse(savedUserStr);
                user.gender = gender;
                localStorage.setItem('user', JSON.stringify(user));
            } catch (e) { }
        }
    };

    return (
        <ChatPage
            currentLang={userLang}
            langLabel={langLabel}
            voiceGender={userGender}
            onVoiceGenderChange={handleVoiceGenderChange}
            mode="private" // ✨ PRIVATE 1:1 MODE
        />
    );
}

export default function WorkerChatRoute() {
    return (
        <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center text-white">Loading Chat...</div>}>
            <ChatContent />
        </Suspense>
    );
}
