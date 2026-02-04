import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, AlertTriangle, ShieldCheck, Activity, Sparkles, Wand2 } from 'lucide-react';
import { useRecorder } from '../hooks/useRecorder';
import { analyzeAudio } from '../lib/aiService';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const RecorderContainer = () => {
    const [status, setStatus] = useState('initial');
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);

    const { isRecording, startRecording, stopRecording, audioBlob } = useRecorder();

    const handleStart = () => {
        setStatus('recording');
        startRecording();
    };

    const handleStop = () => {
        stopRecording();
        setStatus('processing');
    };

    useEffect(() => {
        if (status === 'processing' && !isRecording && audioBlob) {
            const runAnalysis = async () => {
                let p = 0;
                const interval = setInterval(() => {
                    p += Math.random() * 8;
                    if (p >= 96) {
                        clearInterval(interval);
                        setProgress(96);
                    } else {
                        setProgress(Math.floor(p));
                    }
                }, 100);

                try {
                    const analysisResult = await analyzeAudio(audioBlob);

                    setTimeout(async () => {
                        setResult(analysisResult);
                        setProgress(100);

                        try {
                            await addDoc(collection(db, "analyses"), {
                                ...analysisResult,
                                timestamp: serverTimestamp()
                            });
                        } catch (_e) {
                            console.warn("Firebase not configured, skipping store.");
                        }

                        setTimeout(() => setStatus('result'), 800);
                    }, 1500);

                } catch (err) {
                    console.error(err);
                    setStatus('initial');
                }
            };

            runAnalysis();
        }
    }, [status, isRecording, audioBlob]);

    return (
        <div className="w-full relative min-h-[450px] flex items-center justify-center">
            <AnimatePresence mode="wait">

                {/* STATE 1: INITIAL */}
                {status === 'initial' && (
                    <motion.div
                        key="initial"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center gap-10 text-center"
                    >
                        <div className="relative group">
                            <motion.div
                                animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute inset-0 bg-orange-500 rounded-full blur-[80px] -z-10"
                            />
                            <button
                                onClick={handleStart}
                                className="w-40 h-40 rounded-full glass border border-orange-500/20 flex items-center justify-center group-hover:border-orange-500/50 transition-all duration-700 hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(255,107,53,0.15)] bg-surface-900/40 backdrop-blur-3xl"
                            >
                                <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20" />
                                <Mic size={56} className="text-orange-500 group-hover:scale-110 transition-transform duration-700" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black cinematic-text tracking-tight">AI Neural Screening</h2>
                            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">Start a voice session or upload an recording to activate the Degitize fraud protection engine.</p>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4">
                                <button onClick={handleStart} className="btn-primary-gradient px-12 py-4">Activate Scanner</button>
                                <label className="btn-secondary-outline px-12 py-4 cursor-pointer hover:bg-white/5 transition-colors">
                                    Upload File
                                    <input type="file" className="hidden" accept="audio/*" />
                                </label>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* STATE 2: RECORDING */}
                {status === 'recording' && (
                    <motion.div
                        key="recording"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex flex-col items-center"
                    >
                        <div className="flex items-center gap-3 mb-16 border border-white/5 px-4 py-2 rounded-full glass">
                            <span className="flex h-2.5 w-2.5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Live Neural Feed</span>
                        </div>

                        <div className="h-48 w-full flex items-center justify-center gap-1.5 mb-20 px-8 relative overflow-hidden rounded-3xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10" />
                            {[...Array(32)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [10, (i % 8) * 15 + 30, 10] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 0.3 + (i % 4) * 0.2,
                                        delay: i * 0.04
                                    }}
                                    className="w-2 rounded-full bg-gradient-to-t from-orange-500 via-pink-600 to-purple-600 opacity-80 shadow-[0_0_10px_rgba(255,107,53,0.3)]"
                                />
                            ))}
                        </div>

                        <div className="flex flex-col items-center gap-12">
                            <div className="text-5xl font-mono text-white tracking-widest bg-white/5 px-10 py-5 rounded-3xl border border-white/5 shadow-inner">
                                00:00:<motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }}>14</motion.span>
                            </div>
                            <button
                                onClick={handleStop}
                                className="group flex flex-col items-center gap-5"
                            >
                                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-red-500/10 group-hover:border-red-500/30 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                                    <Square size={28} className="text-white group-hover:text-red-500 transition-colors" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 group-hover:text-red-500 transition-colors">Terminate Feed</span>
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STATE 3: PROCESSING */}
                {status === 'processing' && (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center text-center py-12"
                    >
                        <div className="relative w-64 h-64 flex items-center justify-center mb-16">
                            <motion.div
                                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-[6px] border-white/5 border-t-orange-500 shadow-[0_0_80px_rgba(255,107,53,0.1)]"
                            />
                            <div className="flex flex-col items-center">
                                <motion.span
                                    animate={{ opacity: [1, 0.6, 1] }}
                                    className="text-7xl font-black cinematic-text mb-2"
                                >
                                    {progress}%
                                </motion.span>
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Neural Sync</span>
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-6 cinematic-text">Analyzing Vocal Footprint</h3>
                        <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">
                            Securing session data. Processing through Degitize v4.0 multi-model inference engines.
                        </p>
                    </motion.div>
                )}

                {/* STATE 4: RESULT */}
                {status === 'result' && result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                    >
                        <div className={`glass-card p-10 md:p-14 border-2 transition-all duration-1000 overflow-hidden relative ${result.riskLevel === 'Fraud' ? 'border-orange-500/30 shadow-orange-500/5' :
                            result.riskLevel === 'Suspicious' ? 'border-pink-500/30' :
                                'border-green-500/30'
                            }`}>

                            {/* Background decoration in card */}
                            <div className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[100px] -z-10 opacity-10 rounded-full ${result.riskLevel === 'Fraud' ? 'bg-orange-500' : 'bg-green-500'
                                }`} />

                            <div className="flex flex-col lg:flex-row gap-16 items-start">
                                <div className={`w-28 h-28 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl ${result.riskLevel === 'Fraud' ? 'bg-orange-500 text-white shadow-orange-500/20' :
                                    result.riskLevel === 'Suspicious' ? 'bg-pink-600 text-white' :
                                        'bg-green-600 text-white'
                                    }`}>
                                    {result.riskLevel === 'Fraud' ? <AlertTriangle size={56} /> :
                                        result.riskLevel === 'Suspicious' ? <AlertTriangle size={56} /> :
                                            <ShieldCheck size={56} />}
                                </div>

                                <div className="flex-1 space-y-12">
                                    <header className="space-y-4">
                                        <div className="flex items-center gap-3 scale-90 origin-left">
                                            <Wand2 size={16} className="text-orange-500" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Degitize Threat Audit</span>
                                        </div>
                                        <h3 className={`text-5xl font-black tracking-tight leading-none ${result.riskLevel === 'Fraud' ? 'text-orange-500' :
                                            result.riskLevel === 'Suspicious' ? 'text-pink-500' :
                                                'text-green-500'
                                            }`}>
                                            {result.riskLevel === 'Fraud' ? 'NEURAL THREAT DETECTED' :
                                                result.riskLevel === 'Suspicious' ? 'SUSPICIOUS ACTIVITY' :
                                                    'SCAN VERIFIED SAFE'}
                                        </h3>
                                        <p className="text-slate-400 italic text-lg leading-relaxed">Verification protocol complete. Identified {result.reasons.length} critical risk markers.</p>
                                    </header>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="bg-white/5 rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
                                            <span className="text-[10px] font-black uppercase text-slate-500 block mb-3 tracking-widest">Inference Score</span>
                                            <div className="flex items-end gap-2">
                                                <span className={`text-5xl font-black ${result.riskLevel === 'Fraud' ? 'text-orange-500' : 'text-green-400'
                                                    }`}>{result.score}%</span>
                                                <span className="text-slate-600 text-sm mb-2">Confidence Range</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
                                            <span className="text-[10px] font-black uppercase text-slate-500 block mb-3 tracking-widest">Status Report</span>
                                            <p className="text-xl font-bold flex items-center gap-3">
                                                <Activity size={20} className="text-orange-500" />
                                                Action Recommended
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-10 bg-surface-950/80 rounded-[2rem] border border-white/10 relative overflow-hidden">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 blur-[50px] rounded-full" />
                                        <div className="flex justify-between items-center mb-10">
                                            <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">AI Transcript Reconstruction</h4>
                                            <ShieldCheck size={18} className="text-orange-500 opacity-50" />
                                        </div>
                                        <p className="text-2xl italic text-slate-300 leading-relaxed font-serif max-w-2xl">
                                            {result.transcript.split(' ').map((word, i) => {
                                                const isRisky = result.riskyPhrases.some(phrase =>
                                                    phrase.toLowerCase().includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''))
                                                );
                                                return (
                                                    <span key={i} className={isRisky ? 'text-white font-black bg-orange-600 px-1 rounded mx-0.5 shadow-lg shadow-orange-600/30 transition-all' : 'opacity-80'}>
                                                        {word} </span>
                                                );
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-6 pt-6">
                                        <button onClick={() => setStatus('initial')} className="btn-primary-gradient flex-1 py-5 text-lg">New Audit</button>
                                        <button className="btn-secondary-outline flex-1 py-5 text-lg">Generate AI Report</button>
                                        <button className="glass px-8 py-5 rounded-full text-slate-400 hover:text-orange-500 transition-colors">Export .LOG</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecorderContainer;
