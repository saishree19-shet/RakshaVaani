import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ShieldCheck, Github, Chrome } from 'lucide-react';
import { auth } from '../lib/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider
} from 'firebase/auth';

const AuthModal = ({ isOpen, onClose }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            onClose();
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md glass-card p-8 md:p-10 overflow-hidden border-orange-500/20"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600" />

                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={24} className="text-orange-500" />
                                <h2 className="text-xl font-black cinematic-text uppercase">{isSignUp ? 'Join RakshaVaani' : 'RakshaVaani Login'}</h2>
                            </div>
                            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Secure Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="identity@rakshavaani.ai"
                                            className="w-full glass bg-white/5 border-white/5 rounded-2xl py-3.5 px-12 text-sm focus:outline-none focus:border-orange-500 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Protocol</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full glass bg-white/5 border-white/5 rounded-2xl py-3.5 px-12 text-sm focus:outline-none focus:border-orange-500 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary-gradient py-4 text-sm uppercase tracking-widest shadow-orange-500/20"
                            >
                                {loading ? 'Processing...' : isSignUp ? 'Initialize Profile' : 'Access System'}
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black"><span className="bg-surface-900 px-4 text-slate-500">Fast Neural Auth</span></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="glass border-white/5 py-3 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors group">
                                    <Chrome size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-white">Google</span>
                                </button>
                                <button className="glass border-white/5 py-3 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors group">
                                    <Github size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-white">Github</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-xs text-slate-500 hover:text-orange-400 transition-colors font-bold uppercase tracking-widest"
                            >
                                {isSignUp ? 'Already deep linked? Access system' : 'New identity? Initialize profile'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
