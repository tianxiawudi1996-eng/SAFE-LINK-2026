const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const KEY = process.env.GOOGLE_CLOUD_API_KEY || process.env.GEMINI_API_KEY;

async function check() {
    console.log("--- GEMINI SAFETY CHECK ---");
    const genAI = new GoogleGenerativeAI(KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
    });

    try {
        const res = await model.generateContent("Hello, translate this to Korean.");
        console.log("RESPONSE:", res.response.text());
    } catch (e) {
        console.log("ERROR FULL:", JSON.stringify(e, null, 2));
        console.log("ERROR MSG:", e.message);
    }
}
check();
