import React, { useState } from "react";
import {
  Download, RefreshCw, Clock, DollarSign, Users, Calendar,
  AlertTriangle, CheckSquare, Server, Cpu, Database, Globe,
  CloudLightning, ChevronRight, CheckCircle2, Circle, Map, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { getPdfUrl } from "../services/api";

// Feature display metadata
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

// ─── Architecture Visualizer Component ───────────────────────────────────────
function ArchNode({ label, icon: Icon, color = "indigo", sub }) {
  const colorMap = {
    indigo: "border-indigo-500/40 bg-indigo-950/30 text-indigo-300",
    purple: "border-purple-500/40 bg-purple-950/30 text-purple-300",
    slate: "border-slate-600/60 bg-slate-900/60 text-slate-300",
    emerald: "border-emerald-500/40 bg-emerald-950/30 text-emerald-300",
    amber: "border-amber-500/40 bg-amber-950/30 text-amber-300",
    red: "border-red-500/40 bg-red-950/30 text-red-300",
  };
  return (
    <div className={`flex flex-col items-center px-5 py-3 rounded-2xl border backdrop-blur-sm ${colorMap[color]} min-w-[130px] text-center`}>
      {Icon && <Icon className="w-4 h-4 mb-1 opacity-80" />}
      <span className="text-xs font-bold">{label}</span>
      {sub && <span className="text-[10px] opacity-60 mt-0.5">{sub}</span>}
    </div>
  );
}

function ArchArrow() {
  return (
    <div className="flex flex-col items-center my-1">
      <div className="w-px h-4 bg-gradient-to-b from-slate-600 to-slate-700" />
      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-600" />
    </div>
  );
}

function ArchRow({ children }) {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {React.Children.map(children, (child, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div className="w-8 h-px bg-gradient-to-r from-slate-700 to-slate-600" />}
          {child}
        </React.Fragment>
      ))}
    </div>
  );
}

function ArchitectureVisualizer({ features, platforms, industry }) {
  const feat = features.map(f => f.toLowerCase());
  const hasPayments = feat.includes("payments") || feat.includes("coupons");
  const hasNotifs = feat.includes("notifications");
  const hasAI = feat.includes("ai") || feat.includes("analytics");
  const hasMobile = platforms.map(p => p.toLowerCase()).includes("mobile");
  const hasChat = feat.includes("chat");
  const hasStorage = feat.includes("upload") || feat.includes("healthrecords");

  return (
    <div className="flex flex-col items-center gap-0 py-4 overflow-x-auto">
      {/* User Layer */}
      <ArchRow>
        <ArchNode label="End Users" icon={Users} color="slate" sub={hasMobile ? "Web + Mobile" : "Web Browser"} />
      </ArchRow>
      <ArchArrow />

      {/* Frontend */}
      <ArchRow>
        <ArchNode label="React Frontend" icon={Globe} color="indigo" sub="Vite + Tailwind CSS" />
        {hasMobile && <ArchNode label="React Native" icon={Globe} color="indigo" sub="Mobile App" />}
      </ArchRow>
      <ArchArrow />

      {/* API Gateway */}
      <ArchRow>
        <ArchNode label="FastAPI Backend" icon={Server} color="purple" sub="REST + CORS" />
      </ArchRow>
      <ArchArrow />

      {/* Auth + Core */}
      <ArchRow>
        <ArchNode label="Auth Service" icon={CheckCircle2} color="slate" sub="JWT / OAuth2" />
        <ArchNode label="Core API" icon={Zap} color="slate" sub="Business Logic" />
        {hasAI && <ArchNode label="AI Service" icon={Cpu} color="purple" sub="ML / LLM Engine" />}
      </ArchRow>
      <ArchArrow />

      {/* Database */}
      <ArchRow>
        <ArchNode label="Database" icon={Database} color="emerald" sub={industry === "healthcare" || industry === "finance" ? "PostgreSQL (Encrypted)" : "PostgreSQL / SQLite"} />
        {hasStorage && <ArchNode label="File Storage" icon={CloudLightning} color="emerald" sub="AWS S3 / Cloud" />}
      </ArchRow>

      {/* External Services row */}
      {(hasPayments || hasNotifs || hasChat) && (
        <>
          <ArchArrow />
          <ArchRow>
            {hasPayments && <ArchNode label="Payment Gateway" icon={DollarSign} color="amber" sub="Stripe API" />}
            {hasNotifs && <ArchNode label="Notification Service" icon={AlertTriangle} color="amber" sub="Firebase / Twilio" />}
            {hasChat && <ArchNode label="WebSocket Server" icon={Zap} color="amber" sub="Real-time Chat" />}
          </ArchRow>
        </>
      )}
    </div>
  );
}

// ─── Roadmap Timeline Component ───────────────────────────────────────────────
function RoadmapTimeline({ roadmap }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-transparent" />
      <div className="space-y-6">
        {roadmap.map((phase, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="flex gap-6 pl-2">
            {/* Node */}
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-indigo-500/20 z-10">
              {idx + 1}
            </div>
            {/* Card */}
            <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h4 className="font-bold text-sm text-slate-200">{phase.title}</h4>
                  <div className="mt-3 space-y-1.5">
                    {phase.features.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckSquare className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="text-xs font-bold bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {phase.duration}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Sprint Planner Component ─────────────────────────────────────────────────
function SprintCard({ sprint, idx }) {
  const progress = sprint.progress ?? 0;
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
      className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
      {/* Sprint Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-black text-sm text-slate-200">{sprint.title}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-1 rounded-full">
          {sprint.effort}
        </span>
      </div>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Progress</span>
          <span className="text-[10px] font-bold text-slate-400">{progress}%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${progress}%` }} />
        </div>
      </div>
      {/* Objectives */}
      <p className="text-xs text-slate-400 leading-relaxed mb-4">{sprint.objectives}</p>
      {/* Deliverables */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Deliverables</p>
        {sprint.deliverables.map((d, di) => (
          <div key={di} className="flex items-start gap-2 text-xs text-slate-400">
            <Circle className="w-2.5 h-2.5 text-indigo-500 mt-0.5 flex-shrink-0" />
            <span>{d}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ proposal, onReset }) {
  const { project_id, project_name, client_name, email, industry, platforms, features, estimate, ai_response } = proposal;
  const [activeSection, setActiveSection] = useState("overview");

  const handleDownloadPdf = () => window.open(getPdfUrl(project_id), "_blank");

  const tasks = [
    { name: "Frontend Development", pct: 40, color: "bg-indigo-500" },
    { name: "Backend Engineering", pct: 35, color: "bg-purple-500" },
    { name: "Quality Assurance", pct: 15, color: "bg-pink-500" },
    { name: "Project Management", pct: 10, color: "bg-amber-500" },
  ];

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "architecture", label: "Architecture" },
    { id: "roadmap", label: "Roadmap" },
    { id: "sprints", label: "Sprint Plan" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden pb-20">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/40 py-4 px-6 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="font-bold text-white text-sm">E</span>
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">EstimatorAI</span>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={handleDownloadPdf}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all shadow cursor-pointer">
              <Download className="w-3.5 h-3.5" /><span>Download PDF</span>
            </button>
            <button onClick={onReset}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 transition-all cursor-pointer">
              <RefreshCw className="w-3 h-3" /><span>New Estimate</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Project Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-8">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Project Proposal Ready</span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1">{project_name}</h1>
            <p className="text-slate-400 text-sm mt-1">
              Prepared for <span className="font-semibold text-slate-300">{client_name}</span> ({email}) &bull; <span className="capitalize text-slate-300">{industry}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {platforms.map(p => (
              <span key={p} className="text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-full uppercase tracking-wider">{p}</span>
            ))}
          </div>
        </motion.div>

        {/* Section Navigation Tabs */}
        <div className="flex gap-1 bg-slate-900/60 border border-slate-800 rounded-xl p-1 w-fit">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeSection === item.id ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}>
              {item.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeSection === "overview" && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: "Est. Effort", value: `${estimate.hours} hrs`, icon: Clock, color: "text-indigo-400 bg-indigo-500/10" },
                { label: "Budget Estimate", value: `$${estimate.cost.toLocaleString()}`, icon: DollarSign, color: "text-purple-400 bg-purple-500/10" },
                { label: "Timeline", value: estimate.timeline, icon: Calendar, color: "text-pink-400 bg-pink-500/10" },
                { label: "Team Size", value: `${estimate.team.size} members`, icon: Users, color: "text-amber-400 bg-amber-500/10" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                    <h3 className="text-xl font-black text-slate-100 mt-0.5">{value}</h3>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Executive Summary + Effort Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="lg:col-span-2 bg-slate-900/20 border border-slate-900 p-8 rounded-3xl space-y-4">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Executive Summary</h3>
                <p className="text-slate-400 text-sm leading-relaxed text-justify">{ai_response.summary}</p>
                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Team Roles</span>
                  <div className="flex flex-wrap gap-1.5">
                    {estimate.team.roles.map(role => (
                      <span key={role} className="text-xs bg-indigo-950/40 border border-indigo-900/50 text-indigo-300 px-3 py-1 rounded-md">{role}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-slate-900/20 border border-slate-900 p-8 rounded-3xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Effort Distribution</h3>
                  <p className="text-xs text-slate-400 mt-1">Simulated allocation across roles.</p>
                </div>
                <div className="my-5">
                  <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-800">
                    {tasks.map(t => <div key={t.name} className={`${t.color} h-full`} style={{ width: `${t.pct}%` }} />)}
                  </div>
                </div>
                <div className="space-y-2">
                  {tasks.map(t => (
                    <div key={t.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <div className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                        <span>{t.name}</span>
                      </div>
                      <span className="font-semibold text-slate-300">{t.pct}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Features */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-slate-900/20 border border-slate-900 p-8 rounded-3xl space-y-5">
              <div className="border-b border-slate-900 pb-4">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Scope & Features</h3>
                <p className="text-xs text-slate-400 mt-1">All features included in the project scope.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map(featKey => {
                  const meta = FEATURE_META[featKey.toLowerCase()] || {
                    name: featKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                    desc: "Custom feature integration."
                  };
                  return (
                    <div key={featKey} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 flex items-start space-x-3">
                      <div className="w-5 h-5 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 mt-0.5 flex-shrink-0">
                        <CheckSquare className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-200">{meta.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-normal">{meta.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-slate-900/20 border border-slate-900 p-8 rounded-3xl space-y-5">
              <div className="border-b border-slate-900 pb-4">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Recommended Architecture Stack</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.entries(ai_response.tech_stack).map(([layer, rec]) => {
                  let icon = Cpu;
                  if (layer.toLowerCase().includes("front")) icon = Globe;
                  else if (layer.toLowerCase().includes("back")) icon = Server;
                  else if (layer.toLowerCase().includes("data")) icon = Database;
                  else if (layer.toLowerCase().includes("host")) icon = CloudLightning;
                  const Icon = icon;
                  return (
                    <div key={layer} className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 transition-all space-y-3">
                      <div className="flex items-center space-x-2 text-indigo-400">
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">{layer}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-200 leading-normal">{rec}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Risks */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="bg-slate-900/20 border border-slate-900 p-8 rounded-3xl space-y-5">
              <div className="border-b border-slate-900 pb-4">
                <h3 className="text-lg font-bold text-red-400 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" /><span>Risk Management</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {ai_response.risks.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-red-950/5 border border-red-900/20 space-y-3">
                    <span className="text-[10px] uppercase font-bold bg-red-900/20 text-red-400 px-2 py-0.5 rounded-full">Risk {idx + 1}</span>
                    <h4 className="font-semibold text-sm text-red-200">{item.risk}</h4>
                    <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Mitigation</p>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.mitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Download CTA */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-bold text-lg text-slate-200">Ready to present this proposal?</h3>
                <p className="text-slate-400 text-xs mt-1">Download the professionally compiled PDF with cover page, roadmap, and sprint plan.</p>
              </div>
              <button onClick={handleDownloadPdf}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-all cursor-pointer">
                <Download className="w-4 h-4" /><span>Download Proposal (PDF)</span>
              </button>
            </motion.div>
          </div>
        )}

        {/* ── ARCHITECTURE TAB ── */}
        {activeSection === "architecture" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/20 border border-slate-900 p-8 rounded-3xl space-y-6">
            <div className="border-b border-slate-900 pb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Recommended Architecture</h3>
              <p className="text-slate-400 text-sm mt-1">Visual system architecture adapts to your selected platforms and features.</p>
            </div>
            <ArchitectureVisualizer features={features} platforms={platforms} industry={industry} />
          </motion.div>
        )}

        {/* ── ROADMAP TAB ── */}
        {activeSection === "roadmap" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/20 border border-slate-900 p-8 rounded-3xl space-y-6">
            <div className="border-b border-slate-900 pb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent flex items-center gap-2">
                <Map className="w-5 h-5 text-indigo-400" /> Project Roadmap
              </h3>
              <p className="text-slate-400 text-sm mt-1">Implementation phases based on project complexity and selected features.</p>
            </div>
            {ai_response.roadmap && ai_response.roadmap.length > 0 ? (
              <RoadmapTimeline roadmap={ai_response.roadmap} />
            ) : (
              <p className="text-slate-500 text-sm text-center py-8">Roadmap not available for this estimate.</p>
            )}
          </motion.div>
        )}

        {/* ── SPRINTS TAB ── */}
        {activeSection === "sprints" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/20 border border-slate-900 p-8 rounded-3xl space-y-6">
            <div className="border-b border-slate-900 pb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" /> Agile Sprint Plan
              </h3>
              <p className="text-slate-400 text-sm mt-1">Work broken into focused 2-week delivery sprints with objectives and deliverables.</p>
            </div>
            {ai_response.sprint_plan && ai_response.sprint_plan.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {ai_response.sprint_plan.map((sprint, idx) => (
                  <SprintCard key={idx} sprint={sprint} idx={idx} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-8">Sprint plan not available for this estimate.</p>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
