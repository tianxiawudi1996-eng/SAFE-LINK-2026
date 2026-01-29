import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio') as Blob;
        const langCode = formData.get('langCode') as string || 'ko-KR';

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
        if (!apiKey) {
            console.error("STT Error: Missing API Key");
            return NextResponse.json({ error: 'Server Config Error' }, { status: 500 });
        }

        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Audio = buffer.toString('base64');

        // Google Cloud Speech-to-Text V1 API
        const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;

        const requestBody = {
            config: {
                encoding: 'WEBM_OPUS',
                languageCode: langCode,
                enableAutomaticPunctuation: true,
                model: 'command_and_search'
            },
            audio: {
                content: base64Audio
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Google STT API Error:", JSON.stringify(data));
            // Return empty success to prevent UI crash, but log error
            return NextResponse.json({ error: 'STT API Failed', details: data }, { status: 500 });
        }

        // Parse results
        const results = data.results || [];
        const transcript = results
            .map((result: any) => result.alternatives[0].transcript)
            .join('\n');

        return NextResponse.json({
            success: true,
            transcript: transcript,
            source: 'google_cloud_stt'
        });

    } catch (e) {
        console.error("STT Endpoint Exception:", e);
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
