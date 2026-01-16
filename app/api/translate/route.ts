import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini를 사용한 고품질 번역 API
export async function POST(request: NextRequest) {
    try {
        const { text, targetLang, langName } = await request.json();

        if (!text || !targetLang) {
            return NextResponse.json({ error: 'Missing text or targetLang' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // API 키가 없으면 원본 반환
            return NextResponse.json({
                translation: text,
                fallback: true
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a professional construction site interpreter. Translate the following Korean construction site instruction into ${langName}.

Rules:
1. Use natural, native-level ${langName} that construction workers would understand
2. Keep technical terms accurate but easy to understand
3. Be direct and clear - this is a safety instruction
4. Do NOT include any Korean characters in your response
5. Do NOT include explanations - just the translation

Korean text to translate:
"${text}"

${langName} translation:`;

        const result = await model.generateContent(prompt);
        const translation = result.response.text().trim();

        return NextResponse.json({
            translation,
            success: true
        });

    } catch (error) {
        console.error('Gemini translation error:', error);
        return NextResponse.json({
            translation: '',
            fallback: true,
            error: 'Translation failed'
        }, { status: 500 });
    }
}
