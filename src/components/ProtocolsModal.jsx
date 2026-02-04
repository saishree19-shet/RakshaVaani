import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Cpu, Fingerprint, Lock, Zap, FileText } from 'lucide-react';

const ProtocolsModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 40 }}
                        className="relative w-full max-w-4xl h-full max-h-[800px] glass-card overflow-hidden flex flex-col border-white/10"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-orange-500/5 to-purple-500/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-[0_0_20px_rgba(255,107,53,0.2)]">
                                    <FileText size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black cinematic-text tracking-tighter uppercase">Audit Protocols</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-1">Degitize Intelligence Systems v4.0.0</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-12 h-12 rounded-full glass border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all hover:scale-110">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-16 scrollbar-hide">

                            {/* SECTION 1: NEURAL FINGERPRINTING */}
                            <div className="grid md:grid-cols-[100px_1fr] gap-10">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-orange-500 mb-4 bg-orange-500/5 border-orange-500/20"><Fingerprint size={32} /></div>
                                    <div className="w-px h-full bg-gradient-to-b from-orange-500/30 to-transparent" />
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black text-white italic tracking-tight">Neural Voice Fingerprinting</h3>
                                    <p className="text-slate-400 leading-relaxed font-medium text-lg">
                                        Our analysis engine creates a high-fidelity biomechanical map of the speaker's vocal tract. Unlike simple keyword matching, we analyze:
                                    </p>
                                    <ul className="grid sm:grid-cols-2 gap-4">
                                        {['Formant Analysis', 'Jitter & Shimmer Levels', 'Prosody Mapping', 'Emotional Sentiment'].map((item) => (
                                            <li key={item} className="p-4 rounded-2xl glass border-white/5 flex items-center gap-3 text-sm font-bold text-slate-300">
                                                <Zap size={14} className="text-orange-500" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* SECTION 2: THREAT MATRIX */}
                            <div className="grid md:grid-cols-[100px_1fr] gap-10">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-pink-500 mb-4 bg-pink-500/5 border-pink-500/20"><ShieldCheck size={32} /></div>
                                    <div className="w-px h-full bg-gradient-to-b from-pink-500/30 to-transparent" />
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black text-white italic tracking-tight">Dynamic Threat Matrix</h3>
                                    <p className="text-slate-400 leading-relaxed font-medium text-lg">
                                        Calls are passed through our real-time inference engine, which cross-references audio segments against known behavioral fraud scripts (BFS).
                                    </p>
                                    <div className="grid sm:grid-cols-3 gap-6">
                                        <div className="p-6 rounded-3xl bg-green-500/5 border border-green-500/20 space-y-3">
                                            <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Safe Zone</span>
                                            <h4 className="font-bold text-white">Score &lt; 40%</h4>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">Verified human interactions with no urgency markers.</p>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-yellow-500/5 border border-yellow-500/20 space-y-3">
                                            <span className="text-[10px] font-black uppercase text-yellow-500 tracking-widest">Suspicious</span>
                                            <h4 className="font-bold text-white">Score 40-75%</h4>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">Aggressive marketing or scripted behaviors identified.</p>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 space-y-3">
                                            <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">Critical</span>
                                            <h4 className="font-bold text-white">Score &gt; 75%</h4>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">Account blocking threats, OTP requests, or bank impersonation.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: PRIVACY SHIELD */}
                            <div className="grid md:grid-cols-[100px_1fr] gap-10 pb-10">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-purple-500 mb-4 bg-purple-500/5 border-purple-500/20"><Lock size={32} /></div>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black text-white italic tracking-tight">End-to-End Privacy Shield</h3>
                                    <p className="text-slate-400 leading-relaxed font-medium text-lg">
                                        All voice sessions are encrypted via SHA-256 and processed in isolated memory enclaves. No voice audio is stored permanently unless explicitly permitted for training.
                                    </p>
                                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-orange-500/10 via-purple-600/10 to-transparent border border-white/5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold">System Status</span>
                                            <span className="flex items-center gap-2 text-xs font-black text-orange-400 uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full">Secure</span>
                                        </div>
                                        <p className="text-sm text-slate-400 font-medium">Internal audit logs confirm 0 leakage events in the previous 14,000 processed sessions.</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/5 glass bg-black/40 flex justify-center">
                            <button onClick={onClose} className="btn-primary-gradient px-12 py-4 uppercase text-sm tracking-widest">Acknowledge Protocol</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProtocolsModal;
