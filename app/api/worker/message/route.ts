import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from "@google/generative-ai";

const LANG_NAME_MAP: Record<string, string> = {
    'CN': 'Chinese (Simplified)', 'Chinese': 'Chinese (Simplified)', 'zh-CN': 'Chinese (Simplified)', 'China': 'Chinese (Simplified)',
    'VN': 'Vietnamese', 'Vietnamese': 'Vietnamese', 'vi-VN': 'Vietnamese', 'Vietnam': 'Vietnamese',
    'US': 'English', 'English': 'English', 'en-US': 'English', 'USA': 'English',
    'UZ': 'Uzbek', 'Uzbek': 'Uzbek', 'uz-UZ': 'Uzbek', 'Uzbekistan': 'Uzbek',
    'PH': 'Tagalog', 'Philippines': 'Tagalog', 'ph-PH': 'Tagalog', 'Tagalog': 'Tagalog',
    'ID': 'Indonesian', 'Indonesia': 'Indonesian', 'id-ID': 'Indonesian', 'Indonesian': 'Indonesian',
    'TH': 'Thai', 'Thai': 'Thai', 'th-TH': 'Thai', 'Thailand': 'Thai',
    'RU': 'Russian', 'Russian': 'Russian', 'ru-RU': 'Russian', 'Russia': 'Russian',
    'MN': 'Mongolian', 'Mongolia': 'Mongolian', 'mn-MN': 'Mongolian', 'Mongolian': 'Mongolian',
    'KH': 'Khmer', 'Cambodia': 'Khmer', 'km-KH': 'Khmer', 'Khmer': 'Khmer',
    'KR': 'Korean', 'Korean': 'Korean', 'ko-KR': 'Korean', 'Korea': 'Korean'
};

// ISO_MAP: 전체 언어 코드 사용 (TTS 음성 매핑과 일치시킴)
const ISO_MAP: Record<string, string> = {
    'CN': 'zh-CN', 'zh-CN': 'zh-CN', 'Chinese': 'zh-CN', 'China': 'zh-CN',
    'VN': 'vi-VN', 'vi-VN': 'vi-VN', 'vi': 'vi-VN', 'Vietnamese': 'vi-VN', 'Vietnam': 'vi-VN',
    'US': 'en-US', 'en-US': 'en-US', 'en': 'en-US', 'English': 'en-US', 'USA': 'en-US',
    'UZ': 'uz-UZ', 'uz-UZ': 'uz-UZ', 'uz': 'uz-UZ', 'Uzbek': 'uz-UZ', 'Uzbekistan': 'uz-UZ',
    'ID': 'id-ID', 'id-ID': 'id-ID', 'id': 'id-ID', 'Indonesian': 'id-ID', 'Indonesia': 'id-ID',
    'TH': 'th-TH', 'th-TH': 'th-TH', 'th': 'th-TH', 'Thai': 'th-TH', 'Thailand': 'th-TH',
    'RU': 'ru-RU', 'ru-RU': 'ru-RU', 'ru': 'ru-RU', 'Russian': 'ru-RU', 'Russia': 'ru-RU',
    'KR': 'ko-KR', 'ko-KR': 'ko-KR', 'ko': 'ko-KR', 'Korean': 'ko-KR', 'Korea': 'ko-KR',
    'PH': 'fil-PH', 'ph-PH': 'fil-PH', 'tl': 'fil-PH', 'Philippines': 'fil-PH', 'Tagalog': 'fil-PH',
    'KH': 'km-KH', 'km-KH': 'km-KH', 'km': 'km-KH', 'Cambodia': 'km-KH', 'Khmer': 'km-KH',
    'MN': 'mn-MN', 'mn-MN': 'mn-MN', 'mn': 'mn-MN', 'Mongolia': 'mn-MN', 'Mongolian': 'mn-MN'
};

// 단일 API 키 사용: GOOGLE_CLOUD_API_KEY (Gemini, Translation, TTS, STT 모두 지원)
const API_KEY = process.env.GOOGLE_CLOUD_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

async function translateTextV2(text: string, targetCode: string): Promise<{ translation: string, pronunciation: string }> {
    try {
        if (!API_KEY) return { translation: text, pronunciation: "" };
        const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text, target: targetCode, format: 'text' })
        });
        const data = await res.json();
        return { translation: data.data?.translations?.[0]?.translatedText || text, pronunciation: "" };
    } catch (e) {
        return { translation: text, pronunciation: "" };
    }
}

import { getTranslationPrompt } from '@/lib/translationConfig';

// ... (existing helper functions)

async function translateWithGemini(text: string, targetLangName: string, isSenderWorker: boolean, targetLangCodeV2: string) {
    if (!API_KEY) {
        console.warn("[Worker API] No API Key found, skipping Gemini.");
        return await translateTextV2(text, targetLangCodeV2);
    }
    console.log(`[Worker API] Translating to ${targetLangName} (${targetLangCodeV2})`);

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-native",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = getTranslationPrompt(targetLangName, !isSenderWorker) + `\n\nINPUT: "${text}"`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();

        // Anti-garbage: Strip markdown code blocks if present
        if (responseText.startsWith("```")) {
            responseText = responseText.replace(/^```json\n?/, "").replace(/n?```$/, "").trim();
        }

        console.log(`[Worker API] Gemini Success for "${text.substring(0, 10)}..."`);
        const parsed = JSON.parse(responseText);

        // Ensure pronunciation is present
        if (!parsed.pronunciation && !targetLangName.toLowerCase().includes('korean')) {
            parsed.pronunciation = parsed.translation;
        }

        return parsed;
    } catch (e: any) {
        console.error("[Worker API] Gemini Error:", e.message || e);
        // Fallback to Pro if Flash is missing
        if (e.message?.includes('not found')) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
                const result = await model.generateContent(getTranslationPrompt(targetLangName, !isSenderWorker) + `\n\nINPUT: "${text}"`);
                return JSON.parse(result.response.text().trim().replace(/^```json\n?/, "").replace(/n?```$/, ""));
            } catch (e2) { }
        }
        return await translateTextV2(text, targetLangCodeV2);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { workerName, workerCountry, workerLanguage, message, isUrgent, workerId, senderRole = 'worker' } = body;
        if (!message) return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });

        const isWorkerSender = senderRole === 'worker';
        const targetLangName = isWorkerSender ? 'Korean (Standard polite)' : (LANG_NAME_MAP[workerLanguage] || workerLanguage || 'English');
        const targetLangCodeV2 = isWorkerSender ? 'ko' : (ISO_MAP[workerLanguage] || ISO_MAP[LANG_NAME_MAP[workerLanguage]] || 'en');

        const { translation, pronunciation } = await translateWithGemini(message, targetLangName, isWorkerSender, targetLangCodeV2);

        const workerMessage = await prisma.workerMessage.create({
            data: {
                workerName: workerName || 'SITE_GENERAL',
                workerCountry: workerCountry || 'Unknown',
                workerLanguage: workerLanguage || 'Unknown',
                originalText: message,
                translatedText: translation,
                pronunciation: pronunciation || '',
                isUrgent: isUrgent || false,
                senderRole: senderRole,
                workerId: workerId || null,
            },
        });
        return NextResponse.json({ success: true, message: workerMessage });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const listWorkers = searchParams.get('listWorkers');
        const workerName = searchParams.get('workerName');

        if (listWorkers) {
            const allMessages = await prisma.workerMessage.findMany({
                where: { workerName: { not: 'SITE_GENERAL' } },
                orderBy: { createdAt: 'desc' },
                take: 500,
            });
            const workerMap = new Map();
            allMessages.forEach(m => {
                const key = m.workerName.toLowerCase();
                if (!workerMap.has(key)) {
                    workerMap.set(key, {
                        workerName: m.workerName,
                        workerCountry: m.workerCountry,
                        lastMessage: m.senderRole === 'manager' ? `본부: ${m.originalText}` : m.originalText,
                        lastMessageTime: m.createdAt,
                    });
                }
            });
            return NextResponse.json({ success: true, workers: Array.from(workerMap.values()) });
        }

        let where: any = {};
        if (workerName) where.workerName = { equals: workerName, mode: 'insensitive' };
        else where.workerName = 'SITE_GENERAL';

        const messages = await prisma.workerMessage.findMany({ where, orderBy: { createdAt: 'asc' }, take: 200 });
        return NextResponse.json({ success: true, messages });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}
