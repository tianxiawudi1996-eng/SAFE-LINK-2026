
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load envs manually for standalone script
const loadEnv = (filename) => {
    const p = path.resolve(process.cwd(), filename);
    if (fs.existsSync(p)) {
        const envConfig = dotenv.parse(fs.readFileSync(p));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    }
};
loadEnv('.env');
loadEnv('.env.local');

// Manually set ZHIPU Key if missing (from previous turn context)
// Note: In real production, this should be in .env.local
if (!process.env.ZHIPU_API_KEY) {
    process.env.ZHIPU_API_KEY = "1375f54ded5c4dcf9ac0b0a2c0f00f69.414GJRdXpKAqR1d5";
}

async function testTranslationParams() {
    console.log("⚡ Testing GLM-4 Flash Translation...");

    const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
    if (!ZHIPU_API_KEY) {
        console.error("❌ ZHIPU_API_KEY is missing! Cannot test GLM-4.");
        return;
    }

    const testText = "작업 중지! 즉시 대피하세요!";
    const targetLang = "Vietnamese";

    console.log(`Payload: "${testText}" -> ${targetLang}`);

    try {
        const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${ZHIPU_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "glm-4-flash",
                messages: [
                    {
                        role: "system",
                        content: `You are a professional safety interpreter.
                        Translate the user's text into ${targetLang}.
                        Rules:
                        1. Output MUST be valid JSON: {"translation": "...", "mode": "SAFETY"}
                        2. Tone: Urgent, clear, and authoritative (Safety First).`
                    },
                    { role: "user", content: testText }
                ],
                temperature: 0.1,
                top_p: 0.7,
                max_tokens: 1024
            })
        });

        if (response.ok) {
            const data = await response.json();
            const content = data.choices[0].message.content;
            console.log("\n✅ GLM-4 Flash Response:");
            console.log("--------------------------------------------------");
            console.log(content);
            console.log("--------------------------------------------------");

            // Validate JSON
            try {
                const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleanJson);
                console.log("🔍 JSON Parsed Successfully:", parsed);
            } catch (e) {
                console.warn("⚠️ JSON Parse Warning:", e.message);
            }

        } else {
            const err = await response.json();
            console.error("\n❌ API Error:", JSON.stringify(err, null, 2));
        }

    } catch (e) {
        console.error("\n❌ Network Error:", e);
    }
}

testTranslationParams();
