import { NextRequest, NextResponse } from 'next/server';

// Google Cloud TTS Neural2 음성 설정 (원어민급 고품질)
const VOICE_CONFIG: Record<string, { languageCode: string; name: string }> = {
    'vi-VN': { languageCode: 'vi-VN', name: 'vi-VN-Neural2-A' },
    'uz-UZ': { languageCode: 'uz-UZ', name: 'uz-UZ-Standard-A' }, // Neural2 미지원
    'km-KH': { languageCode: 'km-KH', name: 'km-KH-Standard-A' }, // Neural2 미지원
    'mn-MN': { languageCode: 'mn-MN', name: 'mn-MN-Standard-A' }, // Neural2 미지원
    'en-US': { languageCode: 'en-US', name: 'en-US-Neural2-J' },
    'zh-CN': { languageCode: 'cmn-CN', name: 'cmn-CN-Neural2-A' },
    'th-TH': { languageCode: 'th-TH', name: 'th-TH-Neural2-C' },
    'ru-RU': { languageCode: 'ru-RU', name: 'ru-RU-Neural2-A' },
    'ko-KR': { languageCode: 'ko-KR', name: 'ko-KR-Neural2-A' },
};

export async function POST(request: NextRequest) {
    try {
        const { text, langCode } = await request.json();

        if (!text || !langCode) {
            return NextResponse.json({ error: 'Missing text or langCode' }, { status: 400 });
        }

        // Gemini API 키 사용 (Google Cloud TTS와 호환)
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                fallback: true,
                message: 'No API key configured'
            });
        }

        // 음성 설정
        const voiceConfig = VOICE_CONFIG[langCode] || VOICE_CONFIG['en-US'];

        // Google Cloud TTS API 호출
        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    input: { text },
                    voice: {
                        languageCode: voiceConfig.languageCode,
                        name: voiceConfig.name,
                    },
                    audioConfig: {
                        audioEncoding: 'MP3',
                        speakingRate: 1.0,
                        pitch: 0,
                    },
                }),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('Google TTS API error:', error);
            return NextResponse.json({ fallback: true, error });
        }

        const data = await response.json();

        return NextResponse.json({
            audioContent: data.audioContent,
            voiceName: voiceConfig.name
        });

    } catch (error) {
        console.error('TTS API error:', error);
        return NextResponse.json({ fallback: true, error: 'TTS API error' }, { status: 500 });
    }
}
