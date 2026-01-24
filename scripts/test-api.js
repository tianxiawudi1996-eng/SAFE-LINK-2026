// Node 18+ has built-in fetch

async function testTranslation() {
    console.log('--- Translation API Test ---');
    const scenarios = [
        { text: "안전모 착용하고 작업 시작하세요", langName: "Vietnamese", expected: "Vietnamese Translation" },
        { text: "간식 먹고 일합시다", langName: "English", expected: "English Translation" },
        { text: "위험하니까 들어가지 마세요", langName: "Simplified Chinese", expected: "Chinese Translation" }
    ];

    for (const scenario of scenarios) {
        try {
            const response = await fetch('http://localhost:3000/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: scenario.text,
                    langName: scenario.langName
                })
            });

            const data = await response.json();

            if (response.status !== 200 || !data.success || !data.translation) {
                console.error(`❌ FAILED (${scenario.langName}):`, data);
            } else if (data.translation === scenario.text) {
                console.error(`❌ FAILED (${scenario.langName}): Returned original text (Fallback triggered)!`);
            } else {
                console.log(`✅ SUCCESS (${scenario.langName}): "${scenario.text}" -> "${data.translation}"`);
            }
        } catch (error) {
            console.error(`❌ ERROR (${scenario.langName}):`, error.message);
        }
    }
}

async function testTTS() {
    console.log('\n--- TTS API Test ---');
    const scenarios = [
        { text: "Hello world", langCode: "en-US" },
        { text: "Xin chào", langCode: "vi-VN" }
    ];

    for (const scenario of scenarios) {
        try {
            const response = await fetch('http://localhost:3000/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: scenario.text,
                    langCode: scenario.langCode
                })
            });

            const data = await response.json();

            if (response.status !== 200) {
                console.error(`❌ FAILED (${scenario.langCode}): Status ${response.status}`);
            } else if (data.fallback) {
                console.warn(`⚠️ FALLBACK (${scenario.langCode}): Using browser fallback. Reason: ${data.message || data.error}`);
            } else if (data.audioContent) {
                console.log(`✅ SUCCESS (${scenario.langCode}): Received audio content (${data.audioContent.length} bytes) from ${data.source} (${data.voiceName})`);
            } else {
                console.error(`❌ FAILED (${scenario.langCode}): No audio content received`);
            }
        } catch (error) {
            console.error(`❌ ERROR (${scenario.langCode}):`, error.message);
        }
    }
}

async function runWithErrorHandling() {
    try {
        // Wait for server to start (simple delay)
        console.log('Waiting for server check...');

        // Simple retry logic to check if server is up
        let serverUp = false;
        for (let i = 0; i < 10; i++) {
            try {
                await fetch('http://localhost:3000');
                serverUp = true;
                break;
            } catch (e) {
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        if (!serverUp) {
            console.error('SERVER NOT RUNNING: Could not connect to localhost:3000');
            return;
        }

        await testTranslation();
        await testTTS();
    } catch (e) {
        console.error('Test Script Error:', e);
    }
}

runWithErrorHandling();
