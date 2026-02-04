import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Service for Call Analysis and Chat
 */

// TODO: User must set their GEMINI_API_KEY
const API_KEY = "YOUR_GEMINI_API_KEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeAudio = async (audioBlob) => {
    // 1. Convert Audio to Transcript (Mocking Whisper API)
    const transcript = await mockTranscription(audioBlob);

    // 2. Analyze Transcript for Fraud (Mocking LLM Analysis)
    const analysis = await mockAnalysis(transcript);

    return {
        transcript,
        ...analysis
    };
};

export const getGeminiResponse = async (userInput) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are RakshaVaani AI, a professional voice protection assistant. 
        "RakshaVaani" means "Voice Protection" in Hindi. Your goal is to protect users from fraudulent voices and scams.
        Keep your tone helpful, secure, and respectful, with a natural Indian touch. 
        If asked about features, explain how we analyze call audio for fraud patterns like 'OTP requests' or 'bank impersonation'.
        Your current task is to answer user queries about the platform or general AI security.`;

        const result = await model.generateContent([systemPrompt, userInput]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return "Namaste! I am having trouble connecting to the secure server. Please check your internet or API key.";
    }
};

const mockTranscription = async (blob) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Sir your bank account will be blocked today. Please share your OTP immediately for verification.");
        }, 2000);
    });
};

const mockAnalysis = async (text) => {
    const fraudKeywords = ['otp', 'blocked', 'account', 'verify', 'bank', 'urgency'];
    const matches = fraudKeywords.filter(word => text.toLowerCase().includes(word));
    const score = Math.min(40 + (matches.length * 15), 98);

    return {
        riskLevel: score > 70 ? 'Fraud' : score > 40 ? 'Suspicious' : 'Safe',
        score: score,
        reasons: ["Urgency detected", "Bank impersonation", "Request for sensitive data (OTP)"],
        riskyPhrases: ["blocked today", "share your OTP", "immediately"]
    };
};
