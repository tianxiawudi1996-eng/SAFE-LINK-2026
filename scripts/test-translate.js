
async function testTranslate() {
    try {
        const tests = [
            { text: "안전모 착용하세요", langName: "Russian", isManager: true },
            { text: "Xin chào", langName: "Korean", isManager: false },
            { text: "공구리 언제 쳐요?", langName: "Vietnamese", isManager: true }
        ];

        for (const test of tests) {
            console.log(`--- Testing: "${test.text}" (${test.langName}) ---`);
            const response = await fetch('http://localhost:3000/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(test)
            });

            const data = await response.json();
            console.log("Body:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Test Error:", e);
    }
}

testTranslate();
