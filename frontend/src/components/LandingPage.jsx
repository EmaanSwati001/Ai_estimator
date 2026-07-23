import React, { useState } from "react";
import { ArrowRight, Sparkles, Shield, DollarSign, Clock, Layers, MessageSquare, Star, HelpCircle, ChevronDown, CheckCircle, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage({ onStart, onAdminClick }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const FAQS = [
    {
      q: "How does the estimation rule engine calculate development cost?",
      a: "Our rule engine uses a rigid calculation system based on standard developer hours required for each system module. Industry multipliers (e.g. Healthcare for HIPAA compliance, Finance for banking standards) and platform factors (Web, iOS, Android, Desktop) calibrate the totals. Cost is computed strictly by multiplying developer effort with a standard rate, while AI generates descriptive summaries."
    },
    {
      q: "Can I download the full proposal as a PDF?",
      a: "Yes. Once the proposal compiler processes your inputs and calculates specifications, the proposal dashboard provides an instant PDF download option. The report includes an executive cover page, objectives, scope list, architecture stack, timeline, agile sprint planning, and technical risk mitigations."
    },
    {
      q: "How fast can I generate a full project proposal?",
      a: "The guided form takes less than 3 minutes to complete. Once submitted, our deterministic rule engine and AI compiler instantly generate your custom proposal dashboard and downloadable PDF report."
    },
    {
      q: "Are the recommendations binding?",
      a: "Not at all. Recommendations are tailored based on your target domain and features to ensure you don't miss crucial elements (like secure ledger logging for Finance, or appointment booking calendars for Healthcare). You have absolute control to add or ignore any recommendations."
    }
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden flex flex-col justify-between selection:bg-emerald-500/30">
      
      {/* Ambient Gradient Spotlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[40%] rounded-full bg-gradient-to-bl from-green-500/5 via-teal-500/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[40%] rounded-full bg-gradient-to-tr from-emerald-500/10 to-teal-500/5 blur-[120px] pointer-events-none" />

      {/* High-Contrast Navigation Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-50 transition-all shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                ProjectPilot <span className="text-emerald-600 font-semibold">AI</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase hidden sm:block">Enterprise Discovery</span>
            {onAdminClick && (
              <button 
                onClick={onAdminClick}
                className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1"
              >
                <span>Admin Panel</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - Dual Tone Contrast Layout */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-28 md:pb-32 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Hero Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 text-left space-y-6"
        >
          {/* Tagline Pill */}
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200/80 rounded-full px-4 py-1.5 text-[11px] font-bold text-emerald-800 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="tracking-wide uppercase">AI-Driven Estimation & Discovery Engine</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-slate-900">
            Automate your client <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              discovery phase.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
            Replace manual requirements gathering. Intelligently structure application scopes, calculate costs through a robust rule engine, outline roadmaps, and generate professional PDF proposals instantly.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="group relative inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all cursor-pointer"
            >
              <span>Launch Discovery Engine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-100" />
            </motion.button>
            
            <a 
              href="#how-it-works"
              className="inline-flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold px-6 py-4 rounded-2xl transition-all shadow-xs"
            >
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Hero Right Visual (High-Contrast Dark Preview Card on Light Canvas) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="lg:col-span-5 flex items-center justify-center"
        >
          <div className="relative w-full max-w-[420px] h-[360px] bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden text-zinc-100">
            
            {/* Embedded illustration lines and pulses */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
              <svg width="100%" height="100%">
                <line x1="20%" y1="20%" x2="80%" y2="20%" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5,5" />
                <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#14b8a6" strokeWidth="1.5" />
                <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="#059669" strokeWidth="1.5" />
                <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#34d399" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Top Node */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center space-x-2 bg-zinc-950/90 border border-zinc-800 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] text-zinc-400 font-mono">Input: Web + Healthcare</span>
              </div>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>

            {/* Floating visual block */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="bg-zinc-950/80 border border-emerald-500/30 p-4.5 rounded-2xl z-10 shadow-lg text-left"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-zinc-100">Engine Rule Calculation</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                "HIPAA Compliance multiplier applied (1.25x). Feature hours totaled & validated."
              </p>
            </motion.div>

            {/* Inferred Node list */}
            <div className="flex justify-between items-center z-10 text-[10px] text-zinc-300 font-mono">
              <div className="bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Web + Mobile</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Stripe Billing</span>
              </div>
              <div className="bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Est: 240 Hours</span>
              </div>
            </div>
            
          </div>
        </motion.div>
      </section>

      {/* Trusted By Banner */}
      <section className="border-y border-slate-200 bg-white/70 py-10 w-full z-10 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-6">TRUSTED BY AGENCIES AND TEAMS AT</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 hover:opacity-100 transition-all duration-300">
            {["Vercel", "Notion", "Stripe", "Linear", "Retool", "Supabase"].map((brand) => (
              <span key={brand} className="text-lg font-black tracking-tight text-slate-700 font-mono">{brand.toUpperCase()}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-24 w-full text-center z-10">
        <div className="space-y-4 mb-16">
          <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Features Suite</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Intelligent Scoping, Built in Real-Time</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm">Everything you need to bypass slow development discovery and prepare complete scopes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all text-left space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform shadow-xs">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Guided Scoping Engine</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Step-by-step requirements collection that guides you through selecting platforms, constraints, and features cleanly.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all text-left space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 group-hover:scale-105 transition-transform shadow-xs">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">Deterministic Calculations</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              A robust rule engine that guarantees consistent estimates. AI does not hallucinate numbers—costing, hours, and timeline mapping belong strictly to calculation rules.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all text-left space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-green-600 group-hover:scale-105 transition-transform shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">SaaS Proposal Exports</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Instantly compile clean ReportLab PDF proposals containing cover letters, roadmap charts, agile sprint planners, and architecture matrices.
            </p>
          </div>
          
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-slate-200 bg-white/50 py-24 w-full z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-4 mb-16">
            <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Three Steps to Scope Finalization</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-4xl mx-auto">
            
            {[
              { step: "01", title: "Discovery Interaction", desc: "Use our guided form to quickly select target platforms, business industry, and custom project features." },
              { step: "02", title: "Compile Parameters", desc: "Our engine executes industry complexity multipliers and feature rules to calculate hours, costs, and timeline scopes." },
              { step: "03", title: "Review & Proposal", desc: "Interact with the proposal visualizer, review technology recommendations, inspect roadmaps, and download the client PDF." }
            ].map((item, idx) => (
              <div key={idx} className="space-y-4 text-left bg-white border border-slate-200 p-7 rounded-3xl shadow-sm hover:border-emerald-300 transition-all">
                <span className="text-4xl font-black text-emerald-600 font-mono block">{item.step}</span>
                <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
            
          </div>
        </div>
      </section>

      {/* Statistics Section - High Contrast Dark Banner on Light Canvas */}
      <section className="max-w-6xl mx-auto px-6 py-20 w-full text-center z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-3xl p-10 shadow-2xl">
          {[
            { n: "5 Min", label: "Average Scope Time" },
            { n: "100%", label: "Consistent Pricing" },
            { n: "98%", label: "Report Accuracy" },
            { n: "12k+", label: "Generated Proposals" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-emerald-400">{stat.n}</h2>
              <p className="text-xs uppercase font-bold text-zinc-400 tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-slate-200 bg-slate-100/50 py-24 w-full z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-4 mb-16">
            <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Social Proof</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">What Product Managers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                text: "ProjectPilot AI transformed our agency discovery meetings. What used to take two business analysts a week now takes us 5 minutes right in front of the client.",
                author: "Sarah Jenkins",
                role: "VP of Product, DevLab Inc."
              },
              {
                text: "The guided wizard approach is simple and efficient. Our technical clients love it, and the rule engine ensures we never underquote.",
                author: "Alex Rivera",
                role: "Founder, Zenith SaaS Agency"
              },
              {
                text: "The generated ReportLab PDF proposals are incredibly complete. They contain roadmaps, risks, and sprints formatted exactly how enterprises expect.",
                author: "David Vance",
                role: "Director of Delivery, CloudEngine"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-6.5 rounded-3xl text-left space-y-4 flex flex-col justify-between shadow-xs">
                <p className="text-slate-600 text-xs italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center space-x-3 pt-3 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-xs text-emerald-700 border border-emerald-200">
                    {t.author[0]}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{t.author}</h5>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-6 py-24 w-full z-10">
        <div className="space-y-4 text-center mb-16">
          <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Support</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs transition-all duration-300">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-5 text-left font-semibold text-slate-800 text-sm flex items-center justify-between cursor-pointer hover:bg-slate-50"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-350 ${isOpen ? "rotate-180 text-emerald-600" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* High Contrast Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12 w-full z-10 text-xs text-zinc-400">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-sm text-zinc-100">ProjectPilot AI</span>
            </div>
            <p className="text-zinc-500 text-xs max-w-sm">
              An enterprise-grade SaaS proposal generation platform that integrates rule-engine logic and solution design schemas into professional reports.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-300 uppercase tracking-widest text-[10px] mb-3">Discovery Mode</h5>
            <ul className="space-y-2 text-zinc-400 text-xs font-semibold">
              <li><button onClick={onStart} className="hover:text-emerald-400 cursor-pointer">Start Form Wizard</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-300 uppercase tracking-widest text-[10px] mb-3">Company</h5>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li><a href="#" className="hover:text-emerald-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400">Terms of Service</a></li>
            </ul>
          </div>
          
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-zinc-900 text-center text-[10px] text-zinc-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} ProjectPilot AI Platform. All rights reserved.</span>
          <span>Powered by SQLite and Gemini 3.5 Flash.</span>
        </div>
      </footer>

    </div>
  );
}
