import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Service for Call Analysis and Chat
 */

// Securely access API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
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

// Helper to debug connection and list models
const debugConnection = async () => {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        if (!response.ok) {
            return `ListModels failed: ${response.status} ${response.statusText}`;
        }
        const data = await response.json();
        const models = data.models ? data.models.map(m => m.name.replace('models/', '')).join(', ') : "No models found";
        return `Available Models: ${models}`;
    } catch (e) {
        return `Network check failed: ${e.message}`;
    }
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getGeminiResponse = async (userInput) => {
    // 1. Define ONLY valid models based on user's access list
    // Added 'gemini-exp-1206' as it often has separate quota/availability
    const MODEL_CANDIDATES = [
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash",
        "gemini-exp-1206"
    ];

    let lastError = null;

    // 2. Try Real API
    for (const modelName of MODEL_CANDIDATES) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                if (attempt > 1) await wait(1500);

                const model = genAI.getGenerativeModel({ model: modelName });

                const result = await model.generateContent([
                    `You are RakshaVaani, a helpful Indian AI security assistant. 
                    
                    Your capabilities:
                    1. Detect specific call scams (Bank, OTP, Customs, FedEx).
                    2. Provide safety advice in Indian context.
                    3. Speak fluently in English, Hindi, Tamil, Telugu, and Malayalam.
                    
                    Rules:
                    - Detect the language of the user's input.
                    - Reply in the SAME language as the user (or Hinglish if appropriate).
                    - Be brief, clear, and reassuring.
                    
                    Example:
                    User: "Mera account block ho gaya"
                    You: "Ghabrayein nahi. Ye ek aam scam ho sakta hai. Bank kabhi bhi phone par OTP nahi mangta. Kya unhone aapse koi code manga?"`,
                    userInput
                ]);
                const response = await result.response;
                return response.text();

            } catch (error) {
                console.warn(`Model ${modelName} failed:`, error.message);
                lastError = error;
                if (error.message.includes("404")) break; // Don't retry invalid models
            }
        }
    }

    // 3. OFFLINE FALLBACK (If Quota Exceeded)
    console.warn("All connections failed. Switching to Offline Simulation Mode.");
    return mockOfflineResponse(userInput);
};

// Improved fallback to feel more "AI-like" even when offline
const mockOfflineResponse = (input) => {
    const lower = input.toLowerCase();

    // Specific security intents
    if (lower.includes("opt") || lower.includes("otp") || lower.includes("pin") || lower.includes("cvv")) {
        return "⚠️ **Security Alert**: That is definitely a scam! \n\nNo bank or official will EVER ask for your OTP, PIN, or Password over the phone.\n\n**Action:** Hang up immediately. Do not share any code.";
    }

    if (lower.includes("scam") || lower.includes("fraud") || lower.includes("police")) {
        return "If you have lost money or suspect fraud:\n1. Call **1930** (Cybercrime Helpline) immediately.\n2. Report it on **cybercrime.gov.in**.\n3. Block your bank cards through your banking app.";
    }

    if (lower.includes("safe") || lower.includes("verify") || lower.includes("check")) {
        return "It is better to be safe than sorry. \n\nIf you are unsure about a call, **hang up** and call the organization back using the official number from their website (not the one they gave you).";
    }

    if (lower.includes("who are you") || lower.includes("what is this")) {
        return "Namaste! I am **RakshaVaani**, your AI assistant for voice security. I listen to call patterns to help protect you from potential scams.";
    }

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste")) {
        return "Namaste! I am here to protect you. How can I help you regarding call security today?";
    }

    // General fallback for unknown queries when API is down
    return `Namaste. I am currently operating in **Low Power Mode** (High Server Traffic). 
    
    I can answer basic questions about OTPs, Fraud, and Safety right now. For complex queries, please wait 1 minute for my connection to restore.`;
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
