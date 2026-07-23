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
    <div className="relative min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden flex flex-col justify-between selection:bg-[#FF6201]/30">

      {/* Ambient Gradient Spotlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-linear-to-br from-[#FF6201]/20 via-orange-600/10 to-transparent blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[40%] rounded-full bg-linear-to-bl from-[#061A59]/20 via-blue-600/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[40%] rounded-full bg-linear-to-tr from-[#FF6201]/15 to-orange-600/5 blur-[130px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Glass Navigation Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-2xl sticky top-0 z-50 transition-all shadow-2xl shadow-black/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div className="flex items-center space-x-2.5" whileHover={{ scale: 1.02 }}>
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#FF6201] to-orange-600 flex items-center justify-center shadow-lg shadow-[#FF6201]/40 backdrop-blur"><Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                ProjectPilot <span className="text-[#FF6201] font-semibold">AI</span>
              </span>
            </div>
          </motion.div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-white/60 tracking-wider uppercase hidden sm:block">Enterprise Discovery</span>
            {onAdminClick && (
              <motion.button
                onClick={onAdminClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs font-bold text-white bg-white/10 hover:bg-[#FF6201]/20 border border-white/20 hover:border-[#FF6201]/50 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-lg backdrop-blur-md flex items-center gap-1 group">
                <span>Admin Panel</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#FF6201] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
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
          {/* Tagline Pill with Glass */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-[11px] font-bold text-white/90 shadow-lg backdrop-blur-md hover:bg-white/15 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6201] animate-pulse" />
            <span className="tracking-wide uppercase">AI-Driven Estimation & Discovery Engine</span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">Automate your client <br />
            <span className="bg-linear-to-r from-[#FF6201] to-orange-400 bg-clip-text text-transparent">
              discovery phase.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-base sm:text-lg max-w-xl leading-relaxed">
            Replace manual requirements gathering. Intelligently structure application scopes, calculate costs through a robust rule engine, outline roadmaps, and generate professional PDF proposals instantly.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 98, 1, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="group relative inline-flex items-center justify-center space-x-2 bg-linear-to-r from-[#FF6201] to-orange-500 hover:from-orange-500 hover:to-[#FF6201] text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-[#FF6201]/50 transition-all cursor-pointer backdrop-blur-sm border border-white/20">
              <span>Launch Discovery Engine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-bold px-6 py-4 rounded-2xl transition-all shadow-lg backdrop-blur-md"
            >
              See How It Works
            </motion.a>
          </div>
        </motion.div>

        {/* Hero Right Visual (High-Contrast Dark Preview Card on Light Canvas) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="lg:col-span-5 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="relative w-full max-w-105 h-90 bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl shadow-[#FF6201]/20 flex flex-col justify-between overflow-hidden text-white backdrop-blur-xl"
          >

            {/* Embedded illustration lines and pulses */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg width="100%" height="100%">
                <line x1="20%" y1="20%" x2="80%" y2="20%" stroke="#FF6201" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#FF6201" strokeWidth="1.5" opacity="0.4" />
                <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="#FF6201" strokeWidth="1.5" opacity="0.4" />
                <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#FF8533" strokeWidth="1.5" opacity="0.3" />
              </svg>
            </div>

            {/* Top Node */}
            <div className="flex items-center justify-between z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm hover:bg-white/15 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-[#FF6201] animate-pulse" />
                <span className="text-[10px] text-white/80 font-mono">Input: Web + Healthcare</span>
              </motion.div>
              <Layers className="w-4 h-4 text-[#FF6201]" />
            </div>

            {/* Floating visual block */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="bg-white/15 border border-[#FF6201]/40 p-4.5 rounded-2xl z-10 shadow-lg text-left backdrop-blur-md hover:bg-white/20 transition-all"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-[#FF6201]" />
                <span className="text-xs font-bold text-white">Engine Rule Calculation</span>
              </div>
              <p className="text-[11px] text-white/70 leading-normal">
                "HIPAA Compliance multiplier applied (1.25x). Feature hours totaled & validated."
              </p>
            </motion.div>

            {/* Inferred Node list */}
            <div className="flex justify-between items-center z-10 text-[10px] text-white/80 font-mono gap-2">
              <motion.div
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                className="bg-white/10 border border-white/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm flex-1 transition-all"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#FF6201]" />
                <span>Web + Mobile</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                className="bg-white/10 border border-white/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1 backdrop-blur-sm flex-1 transition-all"
              >  <CheckCircle className="w-3.5 h-3.5 text-[#FF6201]" />
                <span>Stripe Billing</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-[#FF6201]/20 border border-[#FF6201]/40 text-[#FF6201] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm flex-1 transition-all"
              ><span className="w-1.5 h-1.5 rounded-full bg-[#FF6201] animate-pulse" />
                <span>Est: 240 Hours</span>
              </motion.div>
            </div>

          </motion.div>
        </motion.div>
      </section>

      {/* Trusted By Banner */}
      <section className="border-y bg-white/5 py-10 w-full z-10 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs uppercase font-bold text-white/90 tracking-widest mb-6">TRUSTED BY AGENCIES AND TEAMS AT</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 hover:opacity-100 transition-all duration-300">
            {["Vercel", "Notion", "Stripe", "Linear", "Retool", "Supabase"].map((brand) => (
              <span key={brand} className="text-lg font-black tracking-tight text-white/80 font-mono">{brand.toUpperCase()}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-24 w-full text-center z-10">
        <div className="space-y-4 mb-16 text-center">
          <span className="text-xs uppercase font-bold text-[#FF6201] tracking-wider">Features Suite</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Intelligent Scoping, Built in Real-Time</h2>
          <p className="text-white/70 max-w-xl mx-auto text-sm">Everything you need to bypass slow development discovery and prepare complete scopes.</p></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-8 rounded-3xl bg-white/10 border border-white/20 shadow-lg backdrop-blur-xl hover:shadow-2xl hover:shadow-[#FF6201]/20 hover:border-[#FF6201]/50 transition-all text-left space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#FF6201]/40 to-orange-500/20 border border-[#FF6201]/40 flex items-center justify-center text-[#FF6201] group-hover:scale-110 transition-transform shadow-lg"><MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white">Guided Scoping Engine</h3>
            <p className="text-white/70 text-sm leading-relaxed">Step-by-step requirements collection that guides you through selecting platforms, constraints, and features cleanly.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
            className="p-8 rounded-3xl bg-white/10 border border-white/20 shadow-lg backdrop-blur-xl hover:shadow-2xl hover:shadow-[#FF6201]/20 hover:border-[#FF6201]/50 transition-all text-left space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#FF6201]/40 to-orange-500/20 border border-[#FF6201]/40 flex items-center justify-center text-[#FF6201] group-hover:scale-110 transition-transform shadow-lg"><DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white">Deterministic Calculations</h3>
            <p className="text-white/70 text-sm leading-relaxed"> A robust rule engine that guarantees consistent estimates. AI does not hallucinate numbers—costing, hours, and timeline mapping belong strictly to calculation rules.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="p-8 rounded-3xl bg-white/10 border border-white/20 shadow-lg backdrop-blur-xl hover:shadow-2xl hover:shadow-[#FF6201]/20 hover:border-[#FF6201]/50 transition-all text-left space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#FF6201]/40 to-orange-500/20 border border-[#FF6201]/40 flex items-center justify-center text-[#FF6201] group-hover:scale-110 transition-transform shadow-lg"><Shield className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white">SaaS Proposal Exports</h3>
            <p className="text-white/70 text-sm leading-relaxed">Instantly compile clean ReportLab PDF proposals containing cover letters, roadmap charts, agile sprint planners, and architecture matrices.
            </p>
          </motion.div>

        </div>
      </section >

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-white/10 bg-white/5 backdrop-blur-md py-24 w-full z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-4 mb-16">
            <span className="text-xs uppercase font-bold text-[#FF6201] tracking-wider">Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Three Steps to Scope Finalization</h2></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-6xl mx-auto">

            {[
              { step: "01", title: "Discovery Interaction", desc: "Use our guided form to quickly select target platforms, business industry, and custom project features." },
              { step: "02", title: "Compile Parameters", desc: "Our engine executes industry complexity multipliers and feature rules to calculate hours, costs, and timeline scopes." },
              { step: "03", title: "Review & Proposal", desc: "Interact with the proposal visualizer, review technology recommendations, inspect roadmaps, and download the client PDF." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300, delay: idx * 0.1 }}
                className="space-y-4 text-left bg-white/10 border border-white/20 p-7 rounded-3xl shadow-lg backdrop-blur-xl hover:bg-white/15 hover:border-[#FF6201]/50 hover:shadow-2xl hover:shadow-[#FF6201]/20 transition-all"
              >
                <span className="text-4xl font-black bg-linear-to-r from-[#FF6201] to-orange-400 bg-clip-text text-transparent font-mono block">{item.step}</span>
                <h4 className="font-bold text-white text-base">{item.title}</h4>
                <p className="text-white/70 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}

          </div>
        </div>
      </section >

      {/* Statistics Section - High Contrast Dark Banner on Light Canvas */}
      < section className="max-w-6xl mx-auto px-6 py-20 w-full text-center z-10" >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/10 text-white border border-white/20 rounded-3xl p-10 shadow-2xl shadow-[#FF6201]/20 backdrop-blur-xl"
        >{[
          { n: "5 Min", label: "Average Scope Time" },
          { n: "100%", label: "Consistent Pricing" },
          { n: "98%", label: "Report Accuracy" },
          { n: "12k+", label: "Generated Proposals" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1, y: -5 }}
            className="space-y-2"
          >
            <h2 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-[#FF6201] to-orange-400 bg-clip-text text-transparent">{stat.n}</h2>
            <p className="text-xs uppercase font-bold text-white/70 tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
        </motion.div>
      </section >

      {/* Testimonials */}
      <section className="border-t border-white/10 bg-white/5 backdrop-blur-md py-24 w-full z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-4 mb-16">
            <span className="text-xs uppercase font-bold text-[#FF6201] tracking-wider">Social Proof</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">What Product Managers Say</h2></div>

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
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300, delay: idx * 0.1 }}
                className="bg-white/10 border border-white/20 p-6.5 rounded-3xl text-left space-y-4 flex flex-col justify-between shadow-lg backdrop-blur-xl hover:bg-white/15 hover:border-[#FF6201]/50 hover:shadow-2xl hover:shadow-[#FF6201]/20 transition-all"
              >
                <p className="text-white/80 text-xs italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#FF6201]/40 to-orange-600/40 flex items-center justify-center font-bold text-xs text-[#FF6201] border border-[#FF6201]/40">
                    {t.author[0]}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{t.author}</h5>
                    <p className="text-[10px] text-white/60">{t.role}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* FAQ Accordion */}
      < section className="max-w-6xl mx-auto px-6 py-24 w-full z-10" >
        <div className="space-y-4 text-center mb-16">
          <span className="text-xs uppercase font-bold text-[#FF6201] tracking-wider">Support</span>
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-white/15 hover:border-[#FF6201]/50"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-5 text-left font-semibold text-white text-sm flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/70 transition-transform duration-350 ${isOpen ? "rotate-180 text-[#FF6201]" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 text-xs text-white/70 leading-relaxed border-t border-white/10 pt-3 bg-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section >

      {/* High Contrast Footer */}
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl py-12 w-full z-10 text-xs text-white/70">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">

          <div className="space-y-4 col-span-1 md:col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#FF6201] to-orange-600 flex items-center justify-center shadow-lg shadow-[#FF6201]/40">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-sm text-white">ProjectPilot AI</span>
            </motion.div>
            <p className="text-white/60 text-xs max-w-sm">
              An enterprise-grade SaaS proposal generation platform that integrates rule-engine logic and solution design schemas into professional reports.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-widest text-[10px] mb-3">Discovery Mode</h5>
            <ul className="space-y-2 text-white/70 text-xs font-semibold">
              <li><motion.button
                whileHover={{ scale: 1.05, color: "#FF6201" }}
                onClick={onStart}
                className="hover:text-[#FF6201] cursor-pointer transition-colors"
              >
                Start Form Wizard
              </motion.button></li></ul>
          </div>

          <div>
            <h5 className="font-bold text-white uppercase tracking-widest text-[10px] mb-3">Company</h5>
            <ul className="space-y-2 text-white/70 text-xs">
              <li><motion.a
                whileHover={{ scale: 1.05, color: "#FF6201" }}
                href="#"
                className="hover:text-[#FF6201] transition-colors"
              >
                Privacy Policy
              </motion.a></li>
              <li><motion.a
                whileHover={{ scale: 1.05, color: "#FF6201" }}
                href="#"
                className="hover:text-[#FF6201] transition-colors"
              >
                Terms of Service
              </motion.a></li>
            </ul>
          </div>

        </div>
        <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-white/10 text-center text-[10px] text-white/50 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} ProjectPilot AI Platform. All rights reserved.</span>
          <span>Powered by SQLite and Gemini 3.5 Flash.</span>
        </div>
      </footer >

    </div >
  );
}
