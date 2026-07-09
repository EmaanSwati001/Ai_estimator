import React from "react";
import { ArrowRight, Sparkles, Shield, DollarSign, Clock, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage({ onStart, onAdminClick }) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden flex flex-col justify-between">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
              EstimatorAI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:block">Automated Discovery Phase</span>
            {onAdminClick && (
              <button onClick={onAdminClick}
                className="text-xs font-semibold text-slate-400 hover:text-indigo-300 border border-slate-800 hover:border-indigo-700 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                Admin Portal
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24 flex-grow flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Sparkle Tagline */}
          <div className="inline-flex items-center space-x-2 bg-indigo-950/50 border border-indigo-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Project discovery</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            AI Project Estimator &{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Proposal Generator
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Transform your software ideas into a comprehensive development proposal, technical scope description, budget estimate, and timeline report in minutes.
          </p>

          {/* CTA */}
          <div className="pt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="relative group inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <span>Build Project Proposal</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-20"
        >
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 backdrop-blur-sm transition-all text-left space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Instant Costing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Calculates development costs dynamically based on target platforms, industry multipliers, and detailed feature sets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 backdrop-blur-sm transition-all text-left space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Project Timeline</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Provides estimated development durations and team sizing guidelines mapped to project complexity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 backdrop-blur-sm transition-all text-left space-y-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Risk & Architecture</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Identifies technical compliance risks (HIPAA, PCI-DSS), mitigations, and custom architecture stack recommendations.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} EstimatorAI MVP. All rights reserved.
      </footer>
    </div>
  );
}
