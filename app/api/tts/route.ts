import { NextRequest, NextResponse } from 'next/server';
import { getLanguageData } from '@/lib/i18n';

// 🛑 UNIFIED KEY
const API_KEY = process.env.GOOGLE_CLOUD_API_KEY || "";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, langCode, gender, emotion } = body;

        if (!text || !langCode) {
            return NextResponse.json({ error: 'Missing params' }, { status: 400 });
        }

        const langData = getLanguageData(langCode);
        const finalGender = (gender === 'male' || gender === 'm') ? 'male' : 'female';

        // Select Voice From Central I18n Data
        const voiceName = (finalGender === 'male') ? langData.ttsVoice.m : langData.ttsVoice.f;

        console.log(`[TTS API] Unified Logic: Lang=${langCode} (${langData.iso}), Voice=${voiceName}`);

        const isUrgent = emotion === 'urgent';
        let inputPayload: any = { text };

        if (isUrgent) {
            // Field-First: Use SSML for urgent alerts (Louder, Faster, High Pitch)
            inputPayload = {
                ssml: `<speak><prosody rate="fast" pitch="+2st"><emphasis level="strong">${text}</emphasis></prosody></speak>`
            };
        }

        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: inputPayload,
                voice: {
                    languageCode: langData.iso,
                    name: voiceName
                },
                audioConfig: {
                    audioEncoding: "MP3",
                    volumeGainDb: isUrgent ? 8.0 : 2.0, // Field-First: Default volume is higher
                    speakingRate: isUrgent ? 1.2 : 1.0
                }
            })
        });

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json({
                audioContent: data.audioContent,
                mimeType: 'audio/mp3',
                source: 'google_cloud_tts'
            });
        } else {
            const err = await response.json();
            console.error("[TTS API] Google Error:", err);
            return NextResponse.json({ fallback: true });
        }

    } catch (error) {
        console.error('TTS Root Error:', error);
        return NextResponse.json({ fallback: true }, { status: 200 });
    }
}
