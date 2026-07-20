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
    
    // Simulate admin login credentials check (mock authentications details)
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[40%] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[40%] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-200">ProjectPilot AI</span>
          </div>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-grow flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-900/40 border border-slate-900 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-6"
        >
          
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-black text-slate-100">Admin Control Center</h2>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">ProjectPilot AI Portal</p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                  placeholder="admin@projectpilot.ai"
                  className="w-full bg-slate-950/80 border border-slate-850 rounded-xl pl-11 pr-4 py-3.5 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors shadow-inner" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-slate-850 rounded-xl pl-11 pr-4 py-3.5 text-xs text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors shadow-inner" 
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-550 to-purple-550 hover:from-indigo-450 hover:to-purple-450 disabled:opacity-50 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/10 cursor-pointer flex items-center justify-center space-x-2"
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
                // If onBack is not defined, we reset view to landing by modifying App.jsx logic
                window.location.reload();
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-355 transition-colors cursor-pointer"
            >
              &larr; Back to Landing Page
            </button>
          </div>

        </motion.div>
      </main>

      <footer className="py-6 text-center text-[10px] text-slate-650">
        Unauthorized access attempts are monitored and logged to security trails.
      </footer>

    </div>
  );
}
