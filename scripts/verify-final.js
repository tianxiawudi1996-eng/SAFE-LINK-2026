const fetch = require('node-fetch');

async function testUnifiedTranslate() {
    console.log("🚀 Testing Unified Translate API (Gemini 2.0 Flash + Slang)...");

    const cases = [
        { text: "공구리 언제 쳐요?", langName: "Vietnamese", isManager: true, expected: "콘크리트" },
        { text: "안전모 안 쓰면 데마찌야.", langName: "Chinese (Simplified)", isManager: true, expected: "작업 대기" }
    ];

    for (const c of cases) {
        try {
            const res = await fetch('http://localhost:3000/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(c)
            });
            const data = await res.json();
            console.log(`\n[Input]: ${c.text} -> [Target]: ${c.langName}`);
            console.log(`[Result]:`, data);

            if (data.success && data.translation) {
                console.log(`✅ Success: Pronunciation exists? ${!!data.pronunciation}`);
            } else {
                console.log(`❌ Failed: ${data.error}`);
            }
        } catch (e) {
            console.error(`❌ Connection failed. Is the server running?`);
            break;
        }
    }
}

testUnifiedTranslate();
