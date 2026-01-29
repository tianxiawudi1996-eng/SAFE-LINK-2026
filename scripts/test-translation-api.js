const { NOGADA_SLANG } = require('../lib/constants.ts');

async function testTranslation() {
    console.log('🤖 [Self-Test] Starting Translation & Glossary Check...');

    const testInputs = [
        { text: "아시바 단도리 잘 해놔", expectedPatterns: [/Giàn giáo|Scaffold/i, /Chuẩn bị|Prepare/i], lang: "Vietnam" },
        { text: "동바리 보강하세요", expectedPatterns: [/Cây chống|Shoring/i, /Gia cố|Reinforce/i], lang: "Vietnam" },
        { text: "야리끼리 끝났어?", expectedPatterns: [/Công khoán|Quota/i], lang: "Vietnam" }
    ];

    let successCount = 0;

    for (const input of testInputs) {
        console.log(`\n🧪 Testing: "${input.text}" -> ${input.lang}`);

        try {
            const response = await fetch('http://localhost:3000/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: input.text,
                    langName: input.lang,
                    isManager: true
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Status ${response.status} - ${errText}`);
            }

            const data = await response.json();
            const translation = data.translation;

            console.log(`   👉 Result: "${translation}"`);

            const validation = input.expectedPatterns.every(pattern => pattern.test(translation));

            if (validation) {
                console.log('   ✅ PASS: Glossary terms correctly applied.');
                successCount++;
            } else {
                console.log(`   ❌ FAIL: Expected patterns ${input.expectedPatterns} not found.`);
            }

        } catch (error) {
            console.error(`   🚨 ERROR: ${error.message}`);
        }
    }

    console.log(`\n📊 Test Summary: ${successCount}/${testInputs.length} Passed`);

    if (successCount === testInputs.length) {
        console.log('🚀 SYSTEM READY: 100% Functionality Verified.');
    } else {
        console.log('⚠️ WARNING: Some glossaries might require stricter prompting.');
    }
}

testTranslation();
