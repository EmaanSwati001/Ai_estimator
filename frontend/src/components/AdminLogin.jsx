import React, { useState } from "react";
import { Lock, Mail, Loader2, ArrowLeft, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    
    setTimeout(() => {
      if (email.trim() === "admin@projectpilot.ai" && password === "admin123") {
        onLogin();
      } else {
        setErrorMsg("Invalid administrator email or password details.");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden selection:bg-emerald-500/30">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[40%] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[40%] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              ProjectPilot <span className="text-emerald-600 font-semibold">AI</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Card - Sleek Dark Card on Light Canvas */}
      <main className="flex-grow flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6 text-zinc-100"
        >
          
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-black text-zinc-100">Admin Control Center</h2>
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">ProjectPilot AI Portal</p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                  placeholder="admin@projectpilot.ai"
                  className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-xs text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors shadow-inner" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-xs text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors shadow-inner" 
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Access Admin Panel</span>
                )}
              </button>
            </div>

          </form>

          <div className="text-center pt-2">
            <button 
              type="button" 
              onClick={() => {
                window.location.reload();
              }}
              className="text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              &larr; Back to Landing Page
            </button>
          </div>

        </motion.div>
      </main>

      <footer className="py-6 text-center text-[10px] text-slate-500">
        Unauthorized access attempts are monitored and logged to security trails.
      </footer>

    </div>
  );
}
