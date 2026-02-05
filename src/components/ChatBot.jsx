import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, X, MessageSquare, Sparkles, Zap, ShieldCheck, Activity, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Standalone Mode: Local state only, no Firebase
    useEffect(() => {
        // Initial greeting
        setMessages([{
            id: 'welcome',
            text: "Namaste! I am **RakshaVaani**. How can I protect you today?",
            sender: 'bot'
        }]);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const getAIResponse = async (userInput) => {
        setIsTyping(true);

        try {
            // Call the real Gemini Service
            const { getGeminiResponse } = await import('../lib/aiService');
            const aiResponse = await getGeminiResponse(userInput);

            setMessages(prev => [...prev, { text: aiResponse, sender: 'bot', id: Date.now().toString() }]);
        } catch (e) {
            console.error("Chat Error:", e);
            const errorMsg = `Error: ${e.message || "Connection failed"}. API Key loaded: ${import.meta.env.VITE_GEMINI_API_KEY ? "Yes" : "No"}`;
            setMessages(prev => [...prev, { text: errorMsg, sender: 'bot', id: Date.now().toString() }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input;
        setInput('');

        // Add user message immediately to local state
        setMessages(prev => [...prev, { text: userMsg, sender: 'user', id: Date.now().toString() }]);

        await getAIResponse(userMsg);
    };

    const handleReset = () => {
        setMessages([{
            id: 'start',
            text: "Namaste! Chat cleared. How can I help you regarding **OTP fraud**, **Call Scams**, or **Digital Safety**?",
            sender: 'bot'
        }]);
    };

    // Helper to detect alert messages
    const isAlertMessage = (text) => {
        const lower = text.toLowerCase();
        return lower.includes("warning") || lower.includes("caution") || lower.includes("alert") || lower.includes("scam");
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="mb-8 w-[380px] md:w-[450px] h-[600px] rounded-[2.5rem] flex flex-col overflow-hidden shadow-[0_20px_60px_-10px_rgba(255,107,53,0.3)] border border-white/10 backdrop-blur-3xl bg-black/60 relative"
                    >
                        {/* Background Gradients */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-pink-600/10 to-transparent pointer-events-none" />

                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10 bg-white/5 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-orange-500 blur-xl opacity-40 animate-pulse" />
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/20 relative z-10 border border-white/20">
                                        <Bot size={24} className="text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-black z-20" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                        RakshaVaani
                                        <ShieldCheck size={14} className="text-orange-500" />
                                    </h3>
                                    <span className="text-xs text-slate-400 font-medium tracking-wide">AI Protection Active</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleReset}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                    title="Reset Chat"
                                >
                                    <RefreshCw size={16} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => {
                                    const isBot = msg.sender === 'bot';
                                    const isAlert = isBot && isAlertMessage(msg.text);

                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex ${!isBot ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] px-5 py-4 text-sm leading-6 shadow-sm relative group ${!isBot ? 'bg-white text-black rounded-3xl rounded-tr-sm' :
                                                        isAlert ? 'bg-red-950/50 border border-red-500/30 text-red-100 rounded-3xl rounded-tl-sm shadow-[0_0_20px_rgba(239,68,68,0.1)]' :
                                                            'bg-white/5 border border-white/5 text-slate-200 rounded-3xl rounded-tl-sm'
                                                    }`}
                                            >
                                                {/* Message Content */}
                                                <div className="markdown-content">
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                            strong: ({ node, ...props }) => <strong className="font-bold text-orange-400" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                                            li: ({ node, ...props }) => <li className="text-slate-300" {...props} />
                                                        }}
                                                    >
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                </div>

                                                {/* Timestamp/Icon */}
                                                {isBot && (
                                                    <div className="absolute -left-10 top-0 opacity-0 group-hover:opacity-50 transition-opacity">
                                                        <Sparkles size={12} className="text-orange-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center backdrop-blur-md">
                                        <span className="text-[10px] text-slate-500 font-bold mr-2">THINKING</span>
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                                className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-5 bg-black/40 backdrop-blur-xl border-t border-white/5">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/5 focus:border-orange-500/50 rounded-full py-4 px-6 text-sm focus:outline-none transition-all text-white placeholder:text-slate-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
                                >
                                    <Send size={20} fill="currentColor" />
                                </button>
                            </div>
                            <div className="text-center mt-3">
                                <p className="text-[10px] text-slate-600 font-medium tracking-wider uppercase">
                                    Secured by Gemini 2.0 Flash
                                </p>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="group relative"
            >
                <div className="absolute inset-0 bg-orange-500 rounded-[2rem] blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
                <div className="w-16 h-16 rounded-[1.8rem] bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center text-white shadow-2xl shadow-orange-500/30 relative z-10 border border-white/20">
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                <X size={28} />
                            </motion.div>
                        ) : (
                            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                                <MessageSquare size={28} fill="currentColor" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-orange-600 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 border-orange-500 z-20">1</span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatBot;
