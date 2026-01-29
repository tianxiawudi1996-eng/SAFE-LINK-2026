const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const KEY = process.env.GOOGLE_CLOUD_API_KEY || process.env.GEMINI_API_KEY;

async function check() {
    console.log("--- START CHECK ---");
    if (!KEY) { console.log("NO KEY"); return; }

    // 1. Check V2
    try {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${KEY}`;
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ q: "Hello", target: "ko", format: "text" })
        });
        const d = await res.json();
        if (res.ok) console.log("V2_STATUS: OK - " + d.data.translations[0].translatedText);
        else console.log("V2_STATUS: FAIL - " + JSON.stringify(d.error));
    } catch (e) { console.log("V2_STATUS: ERROR - " + e.message); }

    // 2. Check Gemini
    try {
        const genAI = new GoogleGenerativeAI(KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const res = await model.generateContent("Hi");
        console.log("GEMINI_STATUS: OK - " + res.response.text());
    } catch (e) {
        console.log("GEMINI_STATUS: FAIL - " + e.message);
    }
    console.log("--- END CHECK ---");
}
check();
