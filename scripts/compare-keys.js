const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testKey(keyName, keyValue) {
    if (!keyValue) {
        console.log(`❌ ${keyName} is MISSING`);
        return;
    }
    console.log(`🔍 Testing ${keyName} (${keyValue.substring(0, 8)}...)...`);

    // Test for Generative Language API (Translation/Chat)
    const genAI = new GoogleGenerativeAI(keyValue);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const result = await model.generateContent("Test");
        const resp = result.response.text();
        console.log(`✅ ${keyName} WORKS for Translation!`);
    } catch (e) {
        console.log(`❌ ${keyName} FAILED.`);
        console.log(`REASON: ${e.message}`);
        console.log(JSON.stringify(e, null, 2));
    }
}

async function run() {
    await testKey("GEMINI_API_KEY", process.env.GEMINI_API_KEY);
    console.log("------------------------------------------------");
    await testKey("GOOGLE_CLOUD_API_KEY", process.env.GOOGLE_CLOUD_API_KEY);
}

run();
