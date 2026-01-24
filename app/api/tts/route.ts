import { NextRequest, NextResponse } from 'next/server';

// ElevenLabs 다국어 음성 ID (무료 계정으로 사용 가능)
// 다국어를 자동 감지하여 해당 언어로 발음
const ELEVENLABS_VOICES = {
    female: 'EXAVITQu4vr4xnSDxMaL', // Sarah - 다국어 지원
    male: 'onwK4e9ZLuTAKqWW03F9',   // Daniel - 다국어 지원
};

export async function POST(request: NextRequest) {
    try {
        const { text, langCode, gender = 'female' } = await request.json();

        if (!text || !langCode) {
            return NextResponse.json({ error: 'Missing params' }, { status: 400 });
        }

        // ElevenLabs API Key 확인
        const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;

        // 1. ElevenLabs 시도 (무료 10,000자/월)
        if (elevenLabsKey) {
            const result = await tryElevenLabs(text, gender, elevenLabsKey);
            if (result) return result;
        }

        // 2. Gemini TTS 시도
        if (geminiKey) {
            const result = await tryGeminiTTS(text, langCode, gender, geminiKey);
            if (result) return result;
        }

        // 3. 모두 실패 -> 브라우저 TTS
        return NextResponse.json({ fallback: true });

    } catch (error) {
        console.error('TTS error:', error);
        return NextResponse.json({ fallback: true }, { status: 200 });
    }
}

// ElevenLabs TTS (고품질, 무료 10,000자/월)
async function tryElevenLabs(text: string, gender: string, apiKey: string) {
    const voiceId = gender === 'male' ? ELEVENLABS_VOICES.male : ELEVENLABS_VOICES.female;

    console.log(`🎤 ElevenLabs TTS: "${text.substring(0, 25)}..."`);

    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                })
            }
        );

        if (response.ok) {
            const audioBuffer = await response.arrayBuffer();
            const base64 = Buffer.from(audioBuffer).toString('base64');
            console.log('✅ ElevenLabs TTS Success');
            return NextResponse.json({
                audioContent: base64,
                mimeType: 'audio/mp3',
                source: 'elevenlabs'
            });
        } else {
            console.warn(`⚠️ ElevenLabs failed: ${response.status}`);
        }
    } catch (e) {
        console.warn('ElevenLabs error:', e);
    }
    return null;
}

// Gemini TTS
async function tryGeminiTTS(text: string, langCode: string, gender: string, apiKey: string) {
    const voices: Record<string, { f: string; m: string }> = {
        'vi-VN': { f: 'Zephyr', m: 'Fenrir' },
        'th-TH': { f: 'Zephyr', m: 'Fenrir' },
        'ko-KR': { f: 'Kore', m: 'Puck' },
        'en-US': { f: 'Zephyr', m: 'Puck' },
        'zh-CN': { f: 'Aoede', m: 'Fenrir' },
        'ru-RU': { f: 'Aoede', m: 'Charon' },
        default: { f: 'Zephyr', m: 'Fenrir' }
    };

    const v = voices[langCode] || voices.default;
    const voiceName = gender === 'male' ? v.m : v.f;

    console.log(`🎤 Gemini TTS: "${text.substring(0, 25)}..." -> ${voiceName}`);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text }] }],
                    generationConfig: {
                        responseModalities: ["AUDIO"],
                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
                    }
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
                console.log('✅ Gemini TTS Success');
                return NextResponse.json({
                    audioContent: data.candidates[0].content.parts[0].inlineData.data,
                    mimeType: 'audio/L16',
                    sampleRate: 24000,
                    source: 'gemini'
                });
            }
        }
    } catch (e) {
        console.warn('Gemini TTS error:', e);
    }
    return null;
}
