import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getLanguageData, normalizeLanguageCode } from '@/lib/i18n';
import { processSlang } from '@/lib/slangProcessor';
import { getTranslationPrompt } from '@/lib/translationConfig';

// 🛑 UNIFIED KEY: ONLY USE GOOGLE_CLOUD_API_KEY
const API_KEY = process.env.GOOGLE_CLOUD_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * 🛰️ FALLBACK: Google Cloud Translation V2 (Deterministic)
 */
async function translateV2(text: string, targetIso: string): Promise<string> {
    try {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text, target: targetIso, format: 'text' })
        });
        const data = await res.json();
        return data.data?.translations?.[0]?.translatedText || text;
    } catch (e) {
        return text;
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, langName, isManager } = body;

        if (!text) return NextResponse.json({ success: false, error: 'Empty text' });

        // 1. Normalize Language Codes (CRITICAL FIX)
        const langData = getLanguageData(langName);
        const targetIso = isManager ? langData.iso : 'ko';
        const targetFullName = isManager ? langData.name : 'Korean (Standard polite)';

        console.log(`[Translate API] Unified Logic: "${text.substring(0, 15)}..." -> ${targetFullName} (${targetIso})`);

        // 2. Slang Processing (4-Step Logic)
        const slangResult = processSlang(text, isManager ? langData.iso : 'ko');

        // Instant return for 100% matched slang words (Speed 1st)
        if (slangResult.directTranslation) {
            return NextResponse.json({
                success: true,
                translation: slangResult.directTranslation,
                pronunciation: "사전 정의됨", // Special tag for direct matches if needed
                isDirect: true
            });
        }

        // 3. AI Intelligence (Gemini 2.0 Flash)
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash", // User specified latest/fastest
                generationConfig: { responseMimeType: "application/json" }
            });

            const prompt = getTranslationPrompt(targetFullName, isManager) + `\n\nINPUT: "${slangResult.processedText}"`;
            const result = await model.generateContent(prompt);
            let responseText = result.response.text().trim();

            if (responseText.startsWith("```")) {
                responseText = responseText.replace(/^```json\n?/, "").replace(/n?```$/, "").trim();
            }

            const parsed = JSON.parse(responseText);

            // Ensure pronunciation is NEVER empty (Field-First)
            if (!parsed.pronunciation) parsed.pronunciation = parsed.translation;

            return NextResponse.json({
                success: true,
                translation: parsed.translation,
                pronunciation: parsed.pronunciation
            });

        } catch (aiError) {
            console.warn("[Translate API] Gemini Fallback to V2:", aiError);
            const fallbackTranslation = await translateV2(slangResult.processedText, targetIso);
            return NextResponse.json({
                success: true,
                translation: fallbackTranslation,
                pronunciation: "", // V2 doesn't support pronunciation easily
                isFallback: true
            });
        }

    } catch (e: any) {
        console.error("[Translate API] Fatal Exception:", e);
        return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
    }
}
