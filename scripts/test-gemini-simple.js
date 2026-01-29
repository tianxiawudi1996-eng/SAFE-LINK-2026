const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function run() {
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
        console.error("NO API KEY FOUND");
        return;
    }
    console.log("Using Key:", apiKey.substring(0, 10) + "...");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        // generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Return a JSON object with a greeting: { "hello": "world" }`;

    try {
        const result = await model.generateContent(prompt);
        console.log("Result:", result.response.text());
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
