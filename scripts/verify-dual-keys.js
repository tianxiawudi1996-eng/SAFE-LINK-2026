const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function verifyBoth() {
    console.log("=== DUAL KEY VERIFICATION ===");

    // 1. Google Cloud Key (Translate V2)
    const cloudKey = process.env.GOOGLE_CLOUD_API_KEY;
    console.log(`[1] Cloud Key: ${cloudKey ? cloudKey.substring(0, 6) + '...' : 'MISSING'}`);

    if (cloudKey) {
        try {
            const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${cloudKey}`, {
                method: 'POST',
                body: JSON.stringify({ q: "Test", target: "ko", format: "text" })
            });
            const d = await res.json();
            if (res.ok) console.log("   ✅ Translation V2: OK");
            else console.log("   ❌ Translation V2: FAIL - " + d.error.message);
        } catch (e) { console.log("   ❌ Connection Error"); }
    }

    // 2. Gemini Key (AI)
    const geminiKey = process.env.GEMINI_API_KEY;
    console.log(`[2] Gemini Key: ${geminiKey ? geminiKey.substring(0, 6) + '...' : 'MISSING'}`);

    if (geminiKey) {
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const res = await model.generateContent("Say 'OK'");
            console.log("   ✅ Gemini AI: OK - " + res.response.text().trim());
        } catch (e) {
            console.log("   ❌ Gemini AI: FAIL - " + e.message);
        }
    }
}

verifyBoth();
