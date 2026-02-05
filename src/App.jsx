import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Mail, Smartphone, ArrowRight, Play, Activity, MessageSquare, Cpu, Users, Layers, LogOut } from 'lucide-react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import RecorderContainer from './components/RecorderContainer';
import ChatBot from './components/ChatBot';
import AuthModal from './components/AuthModal';
import ProtocolsModal from './components/ProtocolsModal';

// Hook to handle hash scroll
const ScrollToHash = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);
  return null;
};

// Shared Layout Component
const Layout = ({ children, onOpenAuth, onOpenProtocols, user, onSignOut }) => {
  return (
    <div className="min-h-screen bg-background relative selection:bg-orange-500/30">
      <div className="hero-wave" />

      {/* Cinematic Navigation */}
      <nav className="fixed top-0 inset-x-0 z-[100] px-4 md:px-6 py-4 md:py-8 transition-all duration-300 w-full">
        <div className="max-w-7xl mx-auto glass rounded-full px-4 md:px-8 py-3 md:py-5 flex justify-between items-center border-white/5 shadow-2xl">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 md:gap-3 group shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <ShieldCheck size={18} className="md:w-[22px] md:h-[22px] text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter cinematic-text uppercase truncate">RakshaVaani</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-12 text-sm font-bold tracking-widest uppercase text-slate-400">
            <Link to="/#about" className="hover:text-orange-400 transition-colors">About</Link>
            <Link to="/#features" className="hover:text-orange-400 transition-colors">Features</Link>
            <Link to="/solutions" className="hover:text-orange-400 transition-colors">Solution</Link>
            <button onClick={onOpenProtocols} className="hover:text-orange-400 transition-colors uppercase tracking-widest">Protocols</button>
          </nav>

          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            {user ? (
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 italic truncate max-w-[100px]">{user.email.split('@')[0]}</div>
                <button onClick={onSignOut} className="w-8 h-8 md:w-10 md:h-10 rounded-full glass border-white/5 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors">
                  <LogOut size={16} className="md:w-[18px] md:h-[18px]" />
                </button>
              </div>
            ) : (
              <button onClick={onOpenAuth} className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Portal Access</button>
            )}
            <button onClick={onOpenAuth} className="btn-primary-gradient px-5 md:px-10 py-2 md:py-3 text-[10px] md:text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(255,107,53,0.2)] whitespace-nowrap">
              {user ? 'Secured' : 'Initialize'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>

      <ChatBot />

      {/* Cinematic Footer */}
      <footer className="bg-surface-900 border-t border-white/5 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20">
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-3">
              <ShieldCheck size={28} className="text-orange-500" />
              <span className="text-2xl md:text-3xl font-black tracking-tighter uppercase">RakshaVaani</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
              Protecting users from fraudulent voices. Natural Indian touch, powered by advanced AI.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl glass border-white/5 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all hover:-translate-y-1 cursor-pointer"><Globe size={18} className="md:w-[20px] md:h-[20px]" /></div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl glass border-white/5 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all hover:-translate-y-1 cursor-pointer"><Mail size={18} className="md:w-[20px] md:h-[20px]" /></div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl glass border-white/5 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all hover:-translate-y-1 cursor-pointer"><Smartphone size={18} className="md:w-[20px] md:h-[20px]" /></div>
            </div>
          </div>

          <div>
            <h4 className="font-black mb-6 md:mb-10 text-white uppercase tracking-widest text-xs">Platform Core</h4>
            <ul className="space-y-4 md:space-y-5 text-sm text-slate-500 font-bold">
              <li onClick={onOpenProtocols} className="hover:text-orange-400 cursor-pointer transition-colors">Neural Analysis</li>
              <li onClick={onOpenProtocols} className="hover:text-orange-400 cursor-pointer transition-colors">Fraud Shield</li>
              <li onClick={onOpenProtocols} className="hover:text-orange-400 cursor-pointer transition-colors">Voice Synthesis</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black mb-6 md:mb-10 text-white uppercase tracking-widest text-xs">Ecosystem</h4>
            <ul className="space-y-4 md:space-y-5 text-sm text-slate-500 font-bold">
              <li className="hover:text-orange-400 cursor-pointer transition-colors">Neural Research</li>
              <li className="hover:text-orange-400 cursor-pointer transition-colors">White Papers</li>
              <li className="hover:text-orange-400 cursor-pointer transition-colors">Security Audit</li>
            </ul>
          </div>

          <div className="space-y-6 md:space-y-8">
            <h4 className="font-black mb-6 md:mb-10 text-white uppercase tracking-widest text-xs">Intelligence Feed</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wider">Join our encrypted newsletter list.</p>
            <div className="flex gap-3">
              <input type="text" placeholder="SECURE@EMAIL.COM" className="flex-1 bg-white/5 border border-white/5 rounded-2xl py-3 px-5 text-[10px] font-black focus:outline-none focus:border-orange-500 transition-all tracking-widest min-w-0" />
              <button className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(255,107,53,0.4)] hover:scale-110 transition-transform flex-shrink-0"><ArrowRight size={20} className="text-white" /></button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- PAGES ---

const Home = ({ onOpenProtocols }) => (
  <div className="space-y-24 md:space-y-40 pb-24 md:pb-40">
    <ScrollToHash />
    {/* HERO */}
    <section className="min-h-screen flex flex-col items-center justify-center pt-24 md:pt-20 px-6 md:px-10 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-orange-600/10 blur-[150px] md:blur-[200px] -z-10 rounded-full" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl"
      >
        <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 rounded-full glass border-orange-500/20 text-[8px] md:text-[10px] font-black mb-8 md:mb-12 text-orange-400 uppercase tracking-[0.3em] md:tracking-[0.4em] shadow-2xl">
          <Zap size={12} className="md:w-[14px] md:h-[14px]" /> Shielding 14.2k Active Terminals
        </div>
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-black mb-8 md:mb-12 leading-[1.1] md:leading-[0.9] tracking-tighter text-white font-space">
          <span className="cinematic-text">RakshaVaani</span><br />
          <span className="text-xl md:text-4xl lg:text-6xl text-orange-400 block mt-8 md:mt-16 font-outfit font-bold tracking-normal opacity-90">Protects Users from Fraudulent Voices</span>
        </h1>
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 mt-12 md:mt-16 sm:scale-100 md:scale-110">
          <Link to="/solutions" className="btn-primary-gradient px-8 md:px-14 py-4 md:py-5 text-xs md:text-sm uppercase tracking-[0.2em] shadow-orange-500/20 w-full sm:w-auto flex justify-center">Try for free</Link>
          <button onClick={onOpenProtocols} className="btn-secondary-outline px-8 md:px-14 py-4 md:py-5 text-xs md:text-sm uppercase tracking-[0.2em] w-full sm:w-auto">Audit Protocol &gt;</button>
        </div>
      </motion.div>

      <div className="mt-20 md:mt-32 w-full max-w-6xl h-40 md:h-80 flex items-center justify-center gap-2 relative group cursor-pointer perspective-1000 overflow-hidden">
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent bottom-1/2 -translate-y-1/2 blur-sm" />
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-1000 flex items-center justify-center backdrop-blur-[2px] z-20">
          <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_60px_rgba(255,107,53,0.6)] border-4 border-white/20">
            <Play size={24} className="md:w-[36px] md:h-[36px] ml-1 text-white" />
          </motion.div>
        </div>
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: [10, (i % 5) * 30 + 40, 10], opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 + (i % 3) * 0.5, delay: i * 0.05 }}
            className="w-1.5 md:w-2 rounded-full bg-gradient-to-t from-orange-600 via-pink-600 to-purple-800 shadow-[0_0_15px_rgba(255,107,53,0.2)]"
          />
        ))}
      </div>
    </section>

    {/* ABOUT SECTION */}
    <section id="about" className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 md:gap-32 items-center pt-10 md:pt-24">
      <div className="relative group cursor-pointer order-2 lg:order-1" onClick={onOpenProtocols}>
        <div className="absolute -inset-10 bg-orange-500/10 blur-[100px] rounded-full opacity-50" />
        <div className="glass-card p-4 aspect-square flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-[1.02] duration-700">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-purple-600/20" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-[1px] border-white/5 rounded-full scale-110 opacity-20" />
          <div className="relative z-10 space-y-10 flex flex-col items-center">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-orange-500 via-pink-600 to-purple-700 p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center p-8 md:p-10">
                <Activity size={60} className="md:w-[100px] md:h-[100px] text-orange-500 drop-shadow-[0_0_20px_rgba(255,107,53,0.5)]" />
              </div>
            </div>
            <div className="btn-pill glass py-2 px-6 md:px-8 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-orange-400">Read Protocol Audit</div>
          </div>
        </div>
      </div>
      <div className="space-y-8 md:space-y-12 order-1 lg:order-2">
        <div className="space-y-4">
          <span className="text-orange-500 font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-xs">Voice Protection</span>
          <h2 className="text-5xl md:text-7xl font-black cinematic-text leading-tight">About <span className="gradient-text">RakshaVaani</span></h2>
        </div>
        <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
          RakshaVaani (Voice Protection) creates a secure shield around your calls. We combine natural Indian design sensitivity with cutting-edge AI to identify fraud before it happens.
        </p>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <Link to="/solutions" className="btn-primary-gradient py-4 md:py-5 px-12 uppercase tracking-widest text-xs md:text-sm text-center">Experience the Core</Link>
          <button onClick={onOpenProtocols} className="btn-secondary-outline py-4 md:py-5 px-12 uppercase tracking-widest text-xs md:text-sm hover:text-orange-500">Read Technical Protocols</button>
        </div>
      </div>
    </section>

    {/* WHY CHOOSE US */}
    <section id="features" className="py-24 md:py-40 relative">
      <div className="absolute inset-0 bg-surface-900/40 -z-10" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-16 md:mb-32 space-y-6">
        <h2 className="text-4xl md:text-6xl font-black">Why Choose <span className="gradient-text">Voice AI?</span></h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl font-medium">Evolving communication through high-fidelity intelligence and automated safety protocols.</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-8 md:gap-12">
        <FeatureItem title="Neural Efficiency" icon={<Cpu size={24} />} desc="Hands-free interaction optimized for sub-millisecond latency and cognitive ease." />
        <FeatureItem title="Hyper-Personalization" icon={<Users size={24} />} desc="AI models that adapt to your unique vocal signature and behavioral patterns over time." />
        <FeatureItem title="Ecosystem Lock" icon={<Layers size={24} />} desc="Seamless integration with global mobile carriers and enterprise communication stacks." />
      </div>
    </section>

    {/* LIVE THREAT MAP - Temporarily Disabled
    <ScamMap />
    */}

    {/* RECENT BLOG / BLOG SECTION */}
    <section id="blog" className="max-w-7xl mx-auto px-6 md:px-12 pt-10 md:pt-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 border-b border-white/5 pb-10 gap-6">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Neural Insights</span>
          <h2 className="text-4xl md:text-5xl font-black cinematic-text">Recent <span className="gradient-text">Updates.</span></h2>
        </div>
        <button className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors border-b border-white/10 pb-2">View Archive</button>
      </div>
      <div className="grid md:grid-cols-2 gap-8 md:gap-10">
        <BlogCard onClick={onOpenProtocols} title="The Rise of Voice Cloning Scams" category="SECURITY" date="OCT 2026" />
        <BlogCard onClick={onOpenProtocols} title="Neural Synthesis in Real-time" category="RESEARCH" date="SEP 2026" />
      </div>
    </section>

    {/* CTA */}
    <section className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="bg-gradient-to-br from-orange-600 via-pink-600 to-purple-800 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-32 text-center relative overflow-hidden group shadow-[0_0_100px_rgba(255,107,53,0.3)]">
        <div className="absolute inset-0 bg-black/10 group-hover:opacity-0 transition-opacity" />
        <div className="relative z-10 space-y-8 md:space-y-12">
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter text-white mb-6 md:mb-10 leading-none">Ready to<br />Change the World?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
            <button className="bg-white text-black btn-pill hover:scale-105 shadow-2xl uppercase tracking-widest py-4 md:py-5 px-12 md:px-16 text-xs md:text-sm">Start for free</button>
            <Link to="/solutions" className="glass border-white/20 btn-pill text-white backdrop-blur-md uppercase tracking-widest py-4 md:py-5 px-12 md:px-16 text-xs md:text-sm hover:bg-white/5 transition-colors">Explore Solutions</Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const FeatureItem = ({ title, icon, desc }) => (
  <div className="glass-card p-8 md:p-12 group hover:border-orange-500/40 transition-all hover:-translate-y-2">
    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-orange-500 mb-6 md:mb-10 border border-white/10 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-xl">
      {icon}
    </div>
    <h4 className="text-xl md:text-2xl font-black mb-4 md:mb-6">{title}</h4>
    <p className="text-slate-500 leading-relaxed font-medium text-sm md:text-base">{desc}</p>
  </div>
);

const BlogCard = ({ title, category, date, onClick }) => (
  <div className="glass-card p-8 md:p-10 group cursor-pointer hover:border-orange-500/20 transition-all" onClick={onClick}>
    <div className="flex justify-between items-center mb-6 md:mb-10">
      <span className="text-[8px] md:text-[10px] font-black text-orange-400 tracking-[0.3em]">{category}</span>
      <span className="text-[8px] md:text-[10px] font-black text-slate-600 tracking-widest">{date}</span>
    </div>
    <h4 className="text-2xl md:text-3xl font-black mb-6 md:mb-10 group-hover:text-orange-500 transition-colors leading-tight">{title}</h4>
    <div className="flex items-center gap-3 text-slate-400 group-hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
      Read Protocol <ArrowRight size={16} />
    </div>
  </div>
);

const AnalysisPage = () => (
  <main className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 space-y-24 md:space-y-32">
    <div className="text-center space-y-6 md:space-y-8">
      <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-orange-500/20 text-[10px] font-black text-orange-400 uppercase tracking-[0.4em] mb-4">
        <Activity size={14} /> Neural Interface V4.2 Online
      </div>
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none"><span className="gradient-text">Neural Audit</span> Hub.</h1>
      <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">Secure your communication web. Tap into the live neural feed for instant behavioral screening.</p>
    </div>

    <div className="glass-card border-white/10 overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-500 via-pink-600 to-purple-700" />
      <div className="p-6 md:p-24 relative z-10">
        <RecorderContainer />
      </div>
    </div>
  </main>
);

const App = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProtocolsOpen, setIsProtocolsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <Router>
      <AnimatePresence>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <ProtocolsModal isOpen={isProtocolsOpen} onClose={() => setIsProtocolsOpen(false)} />
      </AnimatePresence>
      <Layout
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProtocols={() => setIsProtocolsOpen(true)}
        user={user}
        onSignOut={handleSignOut}
      >
        <Routes>
          <Route path="/" element={<Home onOpenProtocols={() => setIsProtocolsOpen(true)} />} />
          <Route path="/solutions" element={<AnalysisPage />} />
          <Route path="/about" element={<Home onOpenProtocols={() => setIsProtocolsOpen(true)} />} />
          <Route path="/features" element={<Home onOpenProtocols={() => setIsProtocolsOpen(true)} />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
