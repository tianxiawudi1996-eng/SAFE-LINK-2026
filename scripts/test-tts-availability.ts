
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load envs manually since we are running a script
const loadEnv = (filename: string) => {
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

async function testQwenTTS() {
    console.log("🔍 Checking TTS Engine Configuration...");

    const qwenKey = process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY;
    const googleKey = process.env.GOOGLE_CLOUD_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    console.log(`\n1. Engine Status:`);
    console.log(`   [${qwenKey ? '✅' : '❌'}] Qwen3-TTS (Primary)`);
    console.log(`   [${googleKey ? '✅' : '❌'}] Google Neural2 (Backup 1)`);
    console.log(`   [${openaiKey ? '✅' : '❌'}] OpenAI TTS (Backup 2)`);

    if (!qwenKey) {
        console.error("\n⚠️  CRITICAL: Qwen/DashScope API Key is MISSING!");
        console.error("   The system is currently falling back to Google/OpenAI.");
        console.error("   Please add 'DASHSCOPE_API_KEY=...' to your .env.local file.");
        return;
    }

    console.log("\n2. Testing Qwen3-TTS Connection...");
    try {
        const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/audio/tts/generation', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${qwenKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'qwen3-tts-flash',
                input: { text: "Hello, this is a test." },
                parameters: {
                    text_type: "PlainText",
                    format: "mp3"
                }
            })
        });

        if (response.ok) {
            console.log("   ✅ Connection Successful! Qwen3 is Live.");
            const data = await response.json();
            console.log("   Explain:", JSON.stringify(data).substring(0, 100) + "...");
        } else {
            const err = await response.json();
            console.error("   ❌ Connection Failed:", JSON.stringify(err));
        }

    } catch (e) {
        console.error("   ❌ Network/Script Error:", e);
    }
}

testQwenTTS();
