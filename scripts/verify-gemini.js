const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' }); // Try .env.local first
require('dotenv').config(); // Fallback to .env

async function testGemini() {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
    console.log("Checking API Key...");
    if (!key) {
        console.error("❌ ERROR: No GEMINI_API_KEY or GOOGLE_CLOUD_API_KEY found in process.env");
        console.log("Env vars found:", Object.keys(process.env).filter(k => k.includes('KEY')));
        return;
    }
    console.log(`✅ Key found (length: ${key.length})`);

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("Sending test prompt...");
    try {
        const result = await model.generateContent("Hello, are you working?");
        console.log("✅ Response received:", result.response.text());
    } catch (error) {
        console.error("❌ API Call Failed:", error.message);
    }
}

testGemini();
