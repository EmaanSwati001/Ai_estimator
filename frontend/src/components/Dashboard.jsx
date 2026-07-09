import React from "react";
import { Download, RefreshCw, Clock, DollarSign, Users, Calendar, HelpCircle, AlertTriangle, CheckSquare, Server, Cpu, Database, Globe, CloudLightning } from "lucide-react";
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
  thirdparty: { name: "External integrations", desc: "Third-party systems integration via RESTful endpoints." }
};

export default function Dashboard({ proposal, onReset }) {
  const {
    project_id,
    project_name,
    client_name,
    email,
    industry,
    platforms,
    features,
    estimate,
    ai_response
  } = proposal;

  const handleDownloadPdf = () => {
    // Navigate window to download endpoints direct
    window.open(getPdfUrl(project_id), "_blank");
  };

  // Generate CSS chart task splits percentages
  const tasks = [
    { name: "Frontend Development", pct: 40, color: "bg-indigo-500" },
    { name: "Backend Engineering", pct: 35, color: "bg-purple-500" },
    { name: "Quality Assurance", pct: 15, color: "bg-pink-500" },
    { name: "Project Management", pct: 10, color: "bg-amber-500" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden pb-20">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/40 py-4 px-6 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="font-bold text-white text-sm">E</span>
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
              EstimatorAI
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleDownloadPdf}
              className="bg-indigo-650 hover:bg-indigo-650/90 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all shadow cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onReset}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>New Estimate</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        
        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-900 pb-8"
        >
          <div>
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Project Proposal Summary</span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-slate-100">{project_name}</h1>
            <p className="text-slate-400 text-sm mt-1">
              Prepared for <span className="font-semibold text-slate-300">{client_name}</span> ({email}) &bull; Domain: <span className="capitalize text-slate-300">{industry}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <span key={p} className="text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-full uppercase tracking-wider">
                {p}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Metrics Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Card 1: Hours */}
          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Est. Effort</p>
              <h3 className="text-2xl font-black text-slate-100 mt-0.5">{estimate.hours} hrs</h3>
            </div>
          </div>

          {/* Card 2: Cost */}
          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Budget Estimate</p>
              <h3 className="text-2xl font-black text-slate-100 mt-0.5">${estimate.cost.toLocaleString()}</h3>
            </div>
          </div>

          {/* Card 3: Timeline */}
          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 flex-shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Timeline</p>
              <h3 className="text-xl font-bold text-slate-100 mt-1">{estimate.timeline}</h3>
            </div>
          </div>

          {/* Card 4: Team */}
          <div className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Recommended Team</p>
              <h3 className="text-2xl font-black text-slate-100 mt-0.5">{estimate.team.size} members</h3>
            </div>
          </div>
        </motion.div>

        {/* Executive Summary & Hour Chart Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Executive Summary */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-slate-900/20 border border-slate-900 p-8 rounded-3xl space-y-4"
          >
            <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Executive Summary</h3>
            <p className="text-slate-400 text-sm leading-relaxed text-justify">
              {ai_response.summary}
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-2">Recommended Team Roles</span>
              <div className="flex flex-wrap gap-1.5">
                {estimate.team.roles.map((role) => (
                  <span key={role} className="text-xs bg-indigo-950/40 border border-indigo-900/50 text-indigo-300 px-3 py-1 rounded-md">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Effort Breakdown Chart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/20 border border-slate-900 p-8 rounded-3xl flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Effort Distribution</h3>
              <p className="text-xs text-slate-400 mt-1">Simulated allocation across software roles.</p>
            </div>

            {/* Simulated Stacked Bar Chart */}
            <div className="my-6">
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-800">
                {tasks.map((task) => (
                  <div
                    key={task.name}
                    className={`${task.color} h-full transition-all`}
                    style={{ width: `${task.pct}%` }}
                    title={`${task.name}: ${task.pct}%`}
                  />
                ))}
              </div>
            </div>

            {/* Legends */}
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <div className={`w-2.5 h-2.5 rounded-full ${task.color}`} />
                    <span>{task.name}</span>
                  </div>
                  <span className="font-semibold text-slate-300">{task.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Feature Scope Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900/20 border border-slate-900 p-8 rounded-3xl space-y-6"
        >
          <div className="border-b border-slate-900 pb-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Scope & Features Breakdown</h3>
            <p className="text-xs text-slate-400 mt-1">Detailed list of components included in the initial calculation scope.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((featKey) => {
              const meta = FEATURE_META[featKey.toLowerCase()] || { 
                name: featKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), 
                desc: "Custom feature integration" 
              };
              return (
                <div key={featKey} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 flex items-start space-x-3.5">
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

        {/* Tech Stack Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900/20 border border-slate-900 p-8 rounded-3xl space-y-6"
        >
          <div className="border-b border-slate-900 pb-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Recommended Architecture Stack</h3>
            <p className="text-xs text-slate-400 mt-1">Tailored technology layers based on selected platforms and business domains.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(ai_response.tech_stack).map(([layer, recommendation]) => {
              // Custom layer icons
              let icon = <Cpu className="w-5 h-5" />;
              if (layer.toLowerCase().includes("front")) icon = <Globe className="w-5 h-5" />;
              if (layer.toLowerCase().includes("back")) icon = <Server className="w-5 h-5" />;
              if (layer.toLowerCase().includes("data")) icon = <Database className="w-5 h-5" />;
              if (layer.toLowerCase().includes("host")) icon = <CloudLightning className="w-5 h-5" />;
              
              return (
                <div key={layer} className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-slate-800/80 transition-all flex flex-col justify-between space-y-3">
                  <div className="flex items-center space-x-2 text-indigo-400">
                    {icon}
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">{layer}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 leading-normal">{recommendation}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Technical Risks & Mitigations */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900/20 border border-slate-900 p-8 rounded-3xl space-y-6"
        >
          <div className="border-b border-slate-900 pb-4">
            <h3 className="text-lg font-bold text-red-400 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Risk Management & Mitigations</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Key technical dependencies and regulatory standards associated with this build.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ai_response.risks.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-red-950/5 border border-red-900/20 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold bg-red-900/20 text-red-400 px-2 py-0.5 rounded-full inline-block">
                    Risk Factor {idx + 1}
                  </span>
                  <h4 className="font-semibold text-sm text-red-200 leading-snug">{item.risk}</h4>
                </div>
                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider text-indigo-300">Mitigation Strategy</p>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Download Call to Action Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <div>
            <h3 className="font-bold text-lg text-slate-200">Ready to present this proposal?</h3>
            <p className="text-slate-400 text-xs mt-1">Download the document compile in ReportLab containing all the details from the dashboard.</p>
          </div>
          <button
            onClick={handleDownloadPdf}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Proposal (PDF)</span>
          </button>
        </motion.div>

      </main>
    </div>
  );
}
