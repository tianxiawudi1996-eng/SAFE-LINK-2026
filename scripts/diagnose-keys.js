const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const KEY = process.env.GOOGLE_CLOUD_API_KEY || process.env.GEMINI_API_KEY;

async function diagnose() {
    console.log("=== KEY DIAGNOSIS ===");
    console.log("Key being used:", KEY ? `${KEY.substring(0, 10)}...` : "NONE");

    if (!KEY) {
        console.error("❌ No API Key found.");
        return;
    }

    // 1. Test Google Translate V2 (Basic)
    console.log("\n[1] Testing Google Translate V2 (Basic)...");
    try {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${KEY}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: "Hello", target: "ko", format: "text" })
        });
        const data = await res.json();
        if (res.ok) {
            console.log("✅ V2 Success:", data.data.translations[0].translatedText);
        } else {
            console.error("❌ V2 Failed:", data.error.message);
        }
    } catch (e) {
        console.error("❌ V2 Exception:", e.message);
    }

    // 2. Test Gemini (Brain)
    console.log("\n[2] Testing Gemini 1.5 Flash (Brain)...");
    try {
        const genAI = new GoogleGenerativeAI(KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log("✅ Gemini Success:", result.response.text().trim());
    } catch (e) {
        console.error("❌ Gemini Failed:", e.message);
        if (e.message.includes("API key not valid")) {
            console.log("   -> TIP: Ensure 'Google Generative AI API' is enabled in Cloud Console.");
        }
    }
}

diagnose();
