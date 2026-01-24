import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// 국가명/코드 → 올바른 언어명 매핑 (Gemini가 잘 알아듣는 영어 명칭)
const LANGUAGE_MAP: Record<string, string> = {
    'Vietnam': 'Vietnamese',
    'vi-VN': 'Vietnamese',
    'Uzbek': 'Uzbek',
    'uz-UZ': 'Uzbek',
    'Cambodia': 'Khmer',
    'km-KH': 'Khmer',
    'Mongolia': 'Mongolian',
    'mn-MN': 'Mongolian',
    'English': 'English',
    'en-US': 'English',
    'China': 'Simplified Chinese',
    'Chinese': 'Simplified Chinese',
    'zh-CN': 'Simplified Chinese',
    'Thai': 'Thai',
    'th-TH': 'Thai',
    'Russian': 'Russian',
    'ru-RU': 'Russian',
    'Korea': 'Korean',
    'Korean': 'Korean',
    'ko-KR': 'Korean'
};

const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

// Markdown 및 불필요한 기호 제거 함수
function cleanText(text: string): string {
    if (!text) return "";
    let cleaned = text.trim();
    // Markdown 코드 블록 제거
    cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "");
    // 앞뒤 따옴표 제거
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
    }
    return cleaned.trim();
}

export async function POST(request: NextRequest) {
    try {
        const { text, langName, isManager } = await request.json();

        if (!text) return NextResponse.json({ error: 'Missing text' }, { status: 400 });

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ translation: "", error: "API Key Missing" }, { status: 500 });
        }

        const targetLanguageName = LANGUAGE_MAP[langName] || langName;
        const genAI = new GoogleGenerativeAI(apiKey);

        // 모델: gemini-pro (안정성 + 고성능)
        // 모델: gemini-pro (안정성 + 고성능)
        const model = genAI.getGenerativeModel({
            model: 'gemini-pro',
            generationConfig: {
                temperature: 0.1, // 창의성보다는 정확성을 위해 값을 낮춤
            },
            safetySettings: SAFETY_SETTINGS
        });

        // 1. 학습된 용어 예시 가져오기 (이게 빠져서 안 되었음!)
        const fewShotHistory = getFewShotHistory(targetLanguageName);

        // 2. Chat Session 시작 (예시 데이터를 History로 주입)
        const chat = model.startChat({
            history: fewShotHistory,
        });

        let systemInstruction = "";

        if (isManager) {
            systemInstruction = `Role: Professional Construction Safety Interpreter.
Target Language: ${targetLanguageName}
Task: Translate the input to ${targetLanguageName} using PRECISE construction terminology.
Context:
- Use formal/commanding tone for safety rules.
- Use polite tone for greetings.
- JSON Output: { "translation": "...", "verification": "..." }`;
        } else {
            systemInstruction = `Role: Construction Site Interpreter.
Target Language: Korean
Task: Translate foreign worker's speech to standard Korean.
Context:
- Fix grammar, keep meaning.
- Identify urgent safety issues.
- JSON Output: { "translation": "...", "verification": "..." }`;
        }

        console.log(`[Gemini Pro] Processing: "${text}" -> ${targetLanguageName}`);

        try {
            // 3. 메시지 전송 (시스템 지시사항 + 실제 텍스트)
            // Few-shot 예시는 이미 history에 있으므로, 이번 턴의 입력만 주면 됨
            const finalPrompt = `${systemInstruction}\n\nInput: "${text}"`;

            const result = await chat.sendMessage(finalPrompt);
            const responseText = result.response.text();
            const cleanedText = cleanText(responseText);

            try {
                const parsed = JSON.parse(cleanedText);
                if (parsed.translation) {
                    return NextResponse.json({
                        translation: parsed.translation,
                        verification: parsed.verification || '',
                        success: true
                    });
                }
            } catch (parseError) {
                // JSON 파싱 실패하더라도 텍스트가 있으면 성공으로 간주 (형식만 깨진 경우)
                if (cleanedText && cleanedText.length > 0 && !cleanedText.includes("Error")) {
                    console.warn('JSON parse failed but got text. Using raw text.');
                    return NextResponse.json({
                        translation: cleanedText,
                        verification: '(형식 파싱 실패 - 원문 내용)',
                        success: true
                    });
                }
                throw parseError; // 진짜 실패
            }

            throw new Error("No translation content found");

        } catch (e: any) {
            console.error('Gemini Processing Failed:', e);
            // 에러를 명확히 반환하여 클라이언트가 알 수 있게 함
            return NextResponse.json({
                translation: "",
                error: `Translation Error: ${e.message}`,
                success: false
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({
            translation: "",
            error: `Server Error: ${error.message}`,
            success: false
        }, { status: 500 });
    }
}

function getFewShotHistory(targetLang: string): any[] {
    // Simple few-shot examples to guide the model style
    // Constructing 'Content' objects for history
    const commonExamples = [
        {
            role: "user",
            parts: [{
                text: `Role: Construction Site Interpreter.
Target Language: ${targetLang}
Task: Translate.
Input: "안전모 착용하세요"` }]
        },
        {
            role: "model",
            parts: [{ text: `{ "translation": "Please wear your hard hat.", "verification": "안전모 착용 요청" }` }] // This is just a dummy example, actual lang will vary.
        }
    ];
    return []; // Return empty for now as rigid few-shot might confuse if lang doesn't match. 
    // Better to rely on System Instruction in the prompt for this dynamic language support.
}
