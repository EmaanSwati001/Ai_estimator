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
    <div className="min-h-screen bg-black/90 text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#FF6201]/30">

      {/* Background Gradients */}
      <div className="absolute top-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#FF6201]/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#FF6201]/5 blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#FF6201] to-[#d64f00] flex items-center justify-center shadow-lg shadow-[#FF6201]/20 border border-white/10">
              <Layers className="w-4 h-4 text-white" />
            </div>

            <span className="font-bold text-base tracking-tight text-white">
              ProjectPilot
              <span className="ml-1.5 text-[#FF6201] text-xs font-semibold px-1.5 py-0.5 rounded-md bg-[#FF6201]/10 border border-[#FF6201]/20">
                AI
              </span>
            </span>
          </div>

        </div>
      </header>


      {/* Main Login Card */}
      <main className="grow flex items-center justify-center px-4 py-10">

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#111111]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 space-y-6 text-zinc-100 backdrop-blur-xl"
        >

          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Admin Control Center
            </h2>

            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em]">
              ProjectPilot AI Portal
            </p>
          </div>


          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">

              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Admin Email
              </label>

              <div className="relative">

                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                  placeholder="admin@projectpilot.ai"
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF6201] focus:ring-1 focus:ring-[#FF6201] outline-none transition-all"
                />

              </div>

            </div>

            <div className="space-y-2">

              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Secure Password
              </label>

              <div className="relative">

                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                  placeholder="••••••••"
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-zinc-600 focus:border-[#FF6201] focus:ring-1 focus:ring-[#FF6201] outline-none transition-all"
                />

              </div>

            </div>

            <div className="pt-2">

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6201] hover:bg-[#e55800] disabled:opacity-50 text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#FF6201]/20 cursor-pointer flex items-center justify-center gap-2"
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
              className="text-xs font-bold text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              &larr; Back to Landing Page
            </button>

          </div>

        </motion.div>

      </main>

      <footer className="text-center text-xs text-white/40 pb-6">
        Unauthorized access attempts are monitored and logged to security trails.
      </footer>

    </div>
  );
}
