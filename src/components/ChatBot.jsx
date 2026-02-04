import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, X, MessageSquare, Sparkles, Zap, ShieldCheck, Activity } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Fetch global chats or per-user chats if auth is ready
        const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
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

            await addDoc(collection(db, "chats"), {
                text: aiResponse,
                sender: 'bot',
                timestamp: serverTimestamp()
            });
        } catch (e) {
            console.error("Chat Error:", e);
            // Fallback for demo if API fails
            await addDoc(collection(db, "chats"), {
                text: "Namaste! I am having trouble forcing a neural handshake. Please check your API key connection.",
                sender: 'bot',
                timestamp: serverTimestamp()
            });
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input;
        setInput('');

        try {
            await addDoc(collection(db, "chats"), {
                text: userMsg,
                sender: 'user',
                timestamp: serverTimestamp()
            });

            getAIResponse(userMsg);
        } catch (e) {
            console.warn("Firebase not configured, showing local only.");
            setMessages(prev => [...prev, { text: userMsg, sender: 'user', id: Date.now() }]);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-6 w-[360px] md:w-[420px] h-[550px] glass-card flex flex-col overflow-hidden border-orange-500/20 shadow-[0_0_100px_rgba(255,107,53,0.1)]"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-white/5 bg-gradient-to-r from-orange-500/10 via-pink-600/10 to-purple-500/10 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-5"><Activity size={48} /></div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group cursor-pointer hover:scale-110 transition-transform">
                                    <Bot size={22} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white italic">RakshaVaani AI</h3>
                                    <div className="flex items-center gap-1.5 pt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Online Protection</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full glass border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            <AnimatePresence initial={false}>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] p-4 rounded-3xl text-[13px] font-medium leading-relaxed ${msg.sender === 'user'
                                                ? 'bg-gradient-to-br from-orange-500 to-pink-600 text-white rounded-tr-none shadow-xl shadow-orange-500/10'
                                                : 'glass border-white/5 text-slate-200 rounded-tl-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="glass border-white/5 p-4 rounded-3xl rounded-tl-none flex gap-1.5 items-center">
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }}
                                                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                                                className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-background/50 backdrop-blur-md">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Inquire Neural Core..."
                                    className="w-full bg-surface-950 border border-white/5 rounded-[1.5rem] py-4 px-6 pr-14 text-sm focus:outline-none focus:border-orange-500/40 transition-all font-medium placeholder:text-slate-600 shadow-inner"
                                />
                                <button
                                    type="submit"
                                    disabled={isTyping}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 active:scale-90 transition-all disabled:opacity-50"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <p className="text-[10px] text-center mt-4 uppercase tracking-[0.2em] font-black text-slate-600 italic">RakshaVaani Protection Engine Online</p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-18 h-18 rounded-[2rem] bg-gradient-to-br from-orange-500 via-pink-600 to-purple-700 flex items-center justify-center text-white shadow-[0_0_50px_rgba(255,107,53,0.3)] group relative overflow-hidden overflow-visible"
            >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X size={32} />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="flex flex-col items-center">
                            <MessageSquare size={32} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notification Badge */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-orange-600 shadow-xl border-2 border-orange-500 animate-bounce">1</span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatBot;
