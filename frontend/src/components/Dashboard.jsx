import React, { useState } from "react";
import { 
  Download, RefreshCw, Clock, DollarSign, Users, Calendar, 
  AlertTriangle, CheckSquare, Server, Cpu, Database, Globe, 
  CloudLightning, ChevronRight, CheckCircle2, Circle, Map, Zap, 
  ShieldCheck, Eye, Layers, Compass, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { getPdfUrl } from "../services/api";

const FEATURE_META = {
  auth: { name: "User Auth & Profiles", desc: "Secure signup, login credentials, and user profiles." },
  dashboard: { name: "Dashboard & Analytics", desc: "Interactive data summaries, graphs, and metric lists." },
  payments: { name: "Payment & Subscriptions", desc: "Stripe integration, invoice billing checkout, and subscriptions." },
  chat: { name: "Real-time Chat Rooms", desc: "Socket-based direct messaging, groups, and logs." },
  notifications: { name: "Push Notifications", desc: "System-wide alert banners and native mobile notifications." },
  search: { name: "Faceted Search & Filter", desc: "Advanced database search, sort options, and filtering keys." },
  social: { name: "Social SSO Logins", desc: "Google, Facebook, and Apple authentication integrations." },
  upload: { name: "Cloud File Uploads", desc: "Image/document uploads connected to AWS S3 storage." },
  ai: { name: "AI Recommendations", desc: "Content ranking engine, search suggestions, and summaries." },
  admin: { name: "Admin Console CMS", desc: "User control systems, dashboards, and app adjustments." },
  multilang: { name: "Multi-Language support", desc: "Localization options and translate translation keys." },
  thirdparty: { name: "External Integrations", desc: "Third-party systems integration via RESTful endpoints." },
  inventory: { name: "Inventory Management", desc: "Track stock levels, product variants, and low-stock alerts." },
  tracking: { name: "Order Tracking", desc: "Interactive delivery timelines with courier API sync." },
  reviews: { name: "Reviews & Ratings", desc: "Product/service rating and review submission system." },
  wishlist: { name: "Customer Wishlists", desc: "Bookmark items and track price changes." },
  coupons: { name: "Coupon & Discount Engine", desc: "Dynamic promo codes and flash sales setups." },
  scheduling: { name: "Appointment Scheduling", desc: "Interactive calendar for booking and rescheduling." },
  telehealth: { name: "Video Consultation", desc: "Patient-doctor telehealth meetings via web/mobile." },
  healthrecords: { name: "EHR Interoperability", desc: "Sync patient health vitals with hospital API schemas." },
  quiz: { name: "Quizzes & Certificates", desc: "Dynamic assignments with automated grading." },
  streaming: { name: "Video Streaming", desc: "HLS adaptive streaming for lecture videos." },
  analytics: { name: "Advanced Analytics", desc: "Custom metrics visualization dashboards." },
  moderation: { name: "Content Moderation", desc: "Filter posts, block spam, and highlight abusive users." },
  security: { name: "Compliance Auditing", desc: "Log all mutations in an immutable audit trail." },
  collaboration: { name: "Collaboration Tools", desc: "Shared workspaces and real-time team editing." },
  export: { name: "Data Export", desc: "Generate PDF/CSV reports and summaries." },
};

export default function Dashboard({ proposal, onReset }) {
  const { project_id, project_name, client_name, email, industry, platforms, features, estimate, ai_response } = proposal;
  const [activeSection, setActiveSection] = useState("overview");
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = () => {
    setDownloading(true);
    window.open(getPdfUrl(project_id), "_blank");
    setTimeout(() => setDownloading(false), 2000);
  };

  // Complexity calculation
  const complexityScore = Math.min(100, Math.max(15, Math.round((estimate.hours / 600) * 100)));
  const getComplexityLabel = (score) => {
    if (score < 35) return { text: "Low Complexity", color: "text-emerald-700 border-emerald-300 bg-emerald-50" };
    if (score < 70) return { text: "Moderate Complexity", color: "text-amber-700 border-amber-300 bg-amber-50" };
    return { text: "High Complexity", color: "text-red-700 border-red-300 bg-red-50" };
  };
  const complexity = getComplexityLabel(complexityScore);

  const breakdown = estimate.breakdown || {
    design: estimate.cost * 0.15,
    frontend: estimate.cost * 0.35,
    backend: estimate.cost * 0.30,
    qa: estimate.cost * 0.12,
    pm: estimate.cost * 0.08
  };

  const recommendApis = [];
  const featLower = features.map(f => f.toLowerCase());
  if (featLower.includes("payments") || featLower.includes("coupons")) {
    recommendApis.push({ name: "Stripe Billing API", desc: "For secure tokenized card transactions and subscriptions checkout." });
  }
  if (featLower.includes("auth") || featLower.includes("social")) {
    recommendApis.push({ name: "Auth0 / JSON Web Token", desc: "Standard identity gateway, OAuth single-sign-on support." });
  }
  if (featLower.includes("upload") || featLower.includes("healthrecords")) {
    recommendApis.push({ name: "AWS S3 / Cloudflare CDN", desc: "Asset bucket storage and lightning fast global caching." });
  }
  if (featLower.includes("chat") || featLower.includes("notifications") || featLower.includes("telehealth")) {
    recommendApis.push({ name: "Twilio & Firebase FCM", desc: "Pushes push updates and handles secure RTC videoConsult channels." });
  }
  if (featLower.includes("ai")) {
    recommendApis.push({ name: "OpenAI API (gpt-4o-mini)", desc: "For dynamic completions, smart parsing, and recommendations." });
  }
  if (featLower.includes("thirdparty")) {
    recommendApis.push({ name: "Plaid API Integration", desc: "Secure open banking sync to retrieve client transaction statements." });
  }
  if (recommendApis.length === 0) {
    recommendApis.push({ name: "SendGrid Email Gateway", desc: "Standard SMTP transactional mailer logs." });
    recommendApis.push({ name: "JWT Encryption Suite", desc: "Local cryptographic signature token validations." });
  }

  const navItems = [
    { id: "overview", label: "Project Summary" },
    { id: "architecture", label: "Architecture Flow" },
    { id: "roadmap", label: "Roadmap Timeline" },
    { id: "sprints", label: "Sprint Planner" },
    { id: "budget", label: "Budget Allocation" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-x-hidden pb-20 selection:bg-emerald-500/30">
      
      {/* Dynamic Background Spotlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 py-4 px-6 sticky top-0 z-50 backdrop-blur-md shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              ProjectPilot <span className="text-emerald-600 font-semibold">AI</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              {downloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Download Proposal PDF</span>
            </button>
            <button 
              onClick={onReset}
              className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl flex items-center space-x-1 transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3 h-3 text-slate-500" />
              <span>New Scoping</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        
        {/* Project Header Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest">Discovery Proposal Compiled</span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">{project_name}</h1>
            <p className="text-slate-600 text-xs mt-1">
              Prepared for <span className="font-bold text-slate-800">{client_name}</span> ({email}) &bull; <span className="capitalize text-slate-700">{industry} Sector</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {platforms.map(p => (
              <span key={p} className="text-[9.5px] font-bold bg-white border border-slate-300 text-slate-700 px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">{p}</span>
            ))}
          </div>
        </motion.div>

        {/* Modular Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          
          {[
            { label: "Estimated Cost", val: `$${estimate.cost.toLocaleString()}`, icon: DollarSign, color: "text-emerald-700 bg-white border-slate-200" },
            { label: "Total Effort", val: `${estimate.hours} Hours`, icon: Clock, color: "text-teal-700 bg-white border-slate-200" },
            { label: "Target Duration", val: estimate.timeline, icon: Calendar, color: "text-slate-800 bg-white border-slate-200" },
            { label: "Team Size", val: `${estimate.team.size} Resources`, icon: Users, color: "text-green-700 bg-white border-slate-200" },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`p-5 rounded-2xl border flex flex-col justify-between h-[120px] shadow-xs ${item.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">{item.label}</span>
                <item.icon className="w-4 h-4 opacity-70 text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{item.val}</h3>
            </motion.div>
          ))}

          {/* Complexity Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between h-[120px] col-span-2 md:col-span-1 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Complexity Score</span>
              <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded border ${complexity.color}`}>
                {complexity.text.split(" ")[0]}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-end justify-between">
                <span className="text-xl font-black text-slate-900">{complexityScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden p-px">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: `${complexityScore}%` }} />
              </div>
            </div>
          </motion.div>

        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 w-fit shadow-xs">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveSection(item.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeSection === item.id ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ── SECTION 1: OVERVIEW & SCOPE ── */}
        {activeSection === "overview" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Col: Executive Summary & Features */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Executive Summary Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Executive Summary & Scope Description
                </h3>
                <p className="text-slate-700 text-xs leading-relaxed">{ai_response.summary}</p>
                <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Brief Objectives Statement</span>
                  <p className="text-slate-600 text-xs leading-normal">
                    Develop a robust core matching the {industry} sector standards. Mapped to client-selected specifications, our technical team recommends deploying containerized configurations on AWS VPC infrastructure, maintaining database integrations, and scaling in modular sprint cycles.
                  </p>
                </div>
              </div>

              {/* Dynamic Effort Chart & Features list */}
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Effort Hour Distribution SVG Chart */}
                <div className="space-y-4 text-left">
                  <h4 className="font-extrabold text-sm text-slate-900">Effort Hour Distribution</h4>
                  
                  <div className="flex items-center space-x-6">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg width="100%" height="100%" viewBox="0 0 42 42" className="transform -rotate-90">
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                        
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="35 65" strokeDashoffset="0" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#0d9488" strokeWidth="4" strokeDasharray="30 70" strokeDashoffset="-35" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#059669" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="-65" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#34d399" strokeWidth="4" strokeDasharray="12 88" strokeDashoffset="-80" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 92" strokeDashoffset="-92" />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Rate</span>
                        <span className="text-xs font-black text-slate-900 font-mono">$100/h</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      {[
                        { name: "Frontend", color: "bg-emerald-500", pct: "35%" },
                        { name: "Backend", color: "bg-teal-600", pct: "30%" },
                        { name: "UI/UX Design", color: "bg-emerald-700", pct: "15%" },
                        { name: "Quality Assurance", color: "bg-emerald-300", pct: "12%" },
                        { name: "Project Management", color: "bg-amber-500", pct: "8%" },
                      ].map((lg, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-sm ${lg.color}`} />
                            <span className="text-slate-600">{lg.name}</span>
                          </div>
                          <span className="font-bold text-slate-900">{lg.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scope modules */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-slate-900">Core Scope Modules</h4>
                  <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-1">
                    {features.map((f) => {
                      const meta = FEATURE_META[f.toLowerCase()] || { name: f.replace(/_/g, " ").toUpperCase(), desc: "Custom business scope integration." };
                      return (
                        <div key={f} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                          <h5 className="text-[10.5px] font-bold text-slate-800 capitalize">{meta.name}</h5>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* Right Col: APIs & Architect Notes */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4.5 h-4.5 text-emerald-600" />
                  Recommended APIs
                </h4>
                <div className="space-y-3">
                  {recommendApis.map((api, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {api.name}
                      </h5>
                      <p className="text-[10px] text-slate-600 leading-normal">{api.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-3.5">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-4.5 h-4.5 text-teal-600" />
                  AI Architect Guidelines
                </h4>
                <p className="text-[10.5px] text-slate-600 leading-relaxed">
                  Compliance validation and integrations have been mapped dynamically to evaluate technical dependencies. Staging runs can execute SQLite schemas locally before production postgres migration runs.
                </p>
              </div>

            </div>
          </motion.div>
        )}

        {/* ── SECTION 2: ARCHITECTURE VISUALIZER ── */}
        {activeSection === "architecture" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            
            {/* High Contrast Flowchart Card (Dark Container on Light Canvas) */}
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center space-y-8 text-zinc-100 shadow-xl">
              
              <div className="space-y-1.5 text-left">
                <h3 className="font-extrabold text-base text-zinc-100">System Flow Visualizer</h3>
                <p className="text-zinc-400 text-xs">Horizontal schema representing service layers and request routing paths.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-stretch relative min-h-[220px]">
                
                <div className="absolute inset-0 pointer-events-none opacity-30 hidden sm:block">
                  <svg width="100%" height="100%">
                    <path d="M 120 110 L 210 110 M 310 110 L 400 110 M 500 110 L 590 110" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" fill="none" />
                  </svg>
                </div>

                {[
                  { layer: "Presentation", title: "Client SPA", sub: "React + Vite SPA", icon: Globe, col: "border-emerald-500/30 bg-zinc-950 text-emerald-300" },
                  { layer: "API Gateway", title: "FastAPI Backend", sub: "Python Async API", icon: Server, col: "border-teal-500/30 bg-zinc-950 text-teal-300" },
                  { layer: "Services Logic", title: "Rule Engine + AI", sub: "Analysis / Prompts", icon: Cpu, col: "border-emerald-500/30 bg-zinc-950 text-emerald-300" },
                  { layer: "Data Layer", title: "PostgreSQL DB", sub: "relational database", icon: Database, col: "border-green-500/30 bg-zinc-950 text-green-300" },
                ].map((node, i) => (
                  <div 
                    key={i}
                    className={`p-5 rounded-2xl border flex flex-col justify-between items-center text-center shadow-md relative z-10 ${node.col}`}
                  >
                    <span className="text-[9px] uppercase font-bold tracking-widest opacity-70 font-mono mb-2">{node.layer}</span>
                    <node.icon className="w-6 h-6 my-2 opacity-90 text-emerald-400" />
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-xs text-zinc-100">{node.title}</h4>
                      <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">{node.sub}</p>
                    </div>
                  </div>
                ))}
                
              </div>
              
            </div>

            {/* Architecture Stack lists */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900">Recommended Tech Stack</h3>
                <div className="space-y-3">
                  {Object.entries(ai_response.tech_stack).map(([layer, rec]) => (
                    <div key={layer} className="space-y-1 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 font-mono">{layer}</span>
                      <p className="text-xs text-slate-800 leading-normal font-semibold">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* ── SECTION 3: PROJECT ROADMAP ── */}
        {activeSection === "roadmap" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
              <div className="space-y-1.5 text-left mb-8">
                <h3 className="font-extrabold text-base text-slate-900">Implementation Timeline Roadmap</h3>
                <p className="text-slate-500 text-xs">Standard three-phase visual scope mapping estimated duration benchmarks.</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-6.5 top-6 bottom-6 w-px bg-gradient-to-b from-emerald-500 via-teal-400 to-transparent" />
                
                <div className="space-y-6">
                  {ai_response.roadmap.map((phase, idx) => (
                    <div key={idx} className="flex gap-6 relative pl-3">
                      
                      <div className="absolute left-[-20px] top-1 w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] font-black z-10 shadow-sm">
                        {idx + 1}
                      </div>

                      <div className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 p-5 rounded-2xl transition-all">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="space-y-3">
                            <h4 className="font-extrabold text-sm text-slate-900">{phase.title}</h4>
                            <div className="space-y-1.5">
                              {phase.features.map((f, fi) => (
                                <div key={fi} className="flex items-center gap-2 text-xs text-slate-700">
                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <span className="text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full whitespace-nowrap">
                            ⏱ &nbsp; {phase.duration}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>

          </motion.div>
        )}

        {/* ── SECTION 4: SPRINT PLANNER ── */}
        {activeSection === "sprints" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg text-slate-900">Agile Sprint Planner</h3>
              <p className="text-slate-500 text-xs">Standard developer capacity allocation sprint logs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ai_response.sprint_plan.map((sprint, idx) => {
                const progress = sprint.progress ?? 0;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4 text-left flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="font-extrabold text-sm text-slate-900">{sprint.title}</span>
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
                          {sprint.effort}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase">
                          <span>Sprint Status</span>
                          <span>{progress}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-100 border border-slate-200 h-2 rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        {sprint.objectives}
                      </p>

                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Deliverables</span>
                      {sprint.deliverables.map((del, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-normal">
                          <Circle className="w-1.5 h-1.5 text-emerald-600 mt-1.5 flex-shrink-0" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>

                  </motion.div>
                );
              })}
            </div>

          </motion.div>
        )}

        {/* ── SECTION 5: BUDGET ALLOCATION ── */}
        {activeSection === "budget" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6">
              
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-slate-900">Budget Breakdown</h3>
                <p className="text-slate-500 text-xs">Cost allocation distribution computed across software engineering phases.</p>
              </div>

              <div className="space-y-3">
                {[
                  { name: "UI/UX Design Phase", desc: "User wireframes, asset vectors, high-fidelity responsive mockups", cost: breakdown.design, pct: 15, barColor: "bg-emerald-600" },
                  { name: "Frontend Development", desc: "Responsive Client interface codes, custom dashboard flow", cost: breakdown.frontend, pct: 35, barColor: "bg-emerald-500" },
                  { name: "Backend Engineering", desc: "FastAPI controllers, database schemas, integrations mapping", cost: breakdown.backend, pct: 30, barColor: "bg-teal-600" },
                  { name: "Quality Assurance", desc: "System responsiveness checks, unit integration test suites logs", cost: breakdown.qa, pct: 12, barColor: "bg-emerald-400" },
                  { name: "Project Management", desc: "Agile sprints checklists updates, solution review reporting", cost: breakdown.pm, pct: 8, barColor: "bg-amber-500" }
                ].map((row, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 pr-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{row.name}</span>
                        <span className="text-[8.5px] font-mono text-slate-500">({row.pct}%)</span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-none">{row.desc}</p>
                      <div className="w-full bg-slate-200 border border-slate-300 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${row.barColor} rounded-full`} style={{ width: `${row.pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-900 font-mono sm:text-right whitespace-nowrap min-w-[100px]">
                      ${row.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}

                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-emerald-900">TOTAL ESTIMATED BUDGET</h4>
                    <p className="text-[9.5px] text-slate-600 mt-0.5">Computed dynamic proposal pricing, excluding third-party API server hosting expenditures</p>
                  </div>
                  <span className="text-base font-black text-emerald-700 font-mono">
                    ${estimate.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

              </div>

            </div>

          </motion.div>
        )}

        {/* Risks & Mitigations Panel */}
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
          className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-5"
        >
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Technical Risk Mitigation Policy
            </h3>
            <p className="text-slate-500 text-xs">Identified risk factors and recommended engineering mitigation policies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ai_response.risks.map((risk, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-[9px] uppercase font-bold bg-amber-100 border border-amber-300 text-amber-800 px-2 py-0.5 rounded-full inline-block font-mono">
                  Risk Factor {idx + 1}
                </span>
                <h4 className="font-extrabold text-xs text-slate-900 leading-relaxed">{risk.risk}</h4>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[8.5px] font-bold text-emerald-700 uppercase tracking-widest block mb-1">Mitigation Plan</span>
                  <p className="text-[10px] text-slate-600 leading-relaxed">{risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
