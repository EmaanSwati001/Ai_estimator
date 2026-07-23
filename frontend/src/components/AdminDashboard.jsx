import React, { useState, useEffect, useMemo } from "react";
import { 
  Layers, LogOut, Search, Trash2, Download, Eye, X, ChevronUp, ChevronDown, 
  DollarSign, Clock, Users, BarChart2, Calendar, AlertTriangle, CheckSquare, 
  Map, Zap, Server, Globe, Database, CloudLightning, Cpu, Circle, Filter, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllEstimates, deleteEstimate, getPdfUrl } from "../services/api";

const INDUSTRY_LABELS = {
  ecommerce: "E-Commerce", finance: "Finance & Fintech", healthcare: "Healthcare", 
  education: "Education", social: "Social Media", saas: "SaaS", other: "Other"
};

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5.5 h-5.5" />
      </div>
      <div>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{label}</p>
        <h3 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}

// ─── Industry Distribution Chart (SVG-based) ─────────────────────────
function IndustryDistributionChart({ estimates }) {
  const counts = {};
  estimates.forEach(e => {
    const key = e.industry || "other";
    counts[key] = (counts[key] || 0) + 1;
  });
  
  const total = estimates.length || 1;
  const entries = Object.entries(counts);
  const maxVal = Math.max(...entries.map(([, c]) => c), 1);
  
  const COLORS = {
    ecommerce: "bg-emerald-600",
    finance: "bg-teal-600",
    healthcare: "bg-emerald-500",
    education: "bg-green-600",
    social: "bg-amber-500",
    saas: "bg-sky-600",
    other: "bg-slate-500"
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {entries.map(([key, count]) => {
          const pct = Math.round((count / total) * 100);
          const colorClass = COLORS[key] || "bg-emerald-500";
          return (
            <div key={key} className="space-y-1 text-xs">
              <div className="flex justify-between text-[10.5px]">
                <span className="font-bold text-slate-600 capitalize">{INDUSTRY_LABELS[key] || key}</span>
                <span className="font-mono text-slate-800">{count} ({pct}%)</span>
              </div>
              <div className="w-full bg-slate-100 border border-slate-200 h-2.5 rounded-full overflow-hidden p-0.5">
                <div 
                  className={`h-full ${colorClass} rounded-full transition-all`} 
                  style={{ width: `${(count / maxVal) * 100}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Project Detail Modal (Sleek Dark Container on Overlay) ─────────────────
function ProjectModal({ project, onClose }) {
  const [activeTab, setActiveTab] = useState("summary");
  const tabs = [
    { id: "summary", label: "Summary & Scope" },
    { id: "roadmap", label: "Implementation Roadmap" },
    { id: "sprints", label: "Agile Sprints" },
    { id: "risks", label: "Mitigations" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl max-h-[85vh] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-zinc-800 flex-shrink-0">
          <div>
            <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider">Proposal Details View</span>
            <h2 className="text-xl font-black mt-0.5 text-zinc-100">{project.project_name}</h2>
            <p className="text-zinc-400 text-xs mt-0.5">{project.client_name} &bull; {project.email} &bull; <span className="capitalize text-zinc-300">{project.industry}</span></p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={() => window.open(getPdfUrl(project.project_id), "_blank")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" /> 
              <span>PDF Report</span>
            </button>
            <button 
              onClick={onClose} 
              className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center cursor-pointer transition-all border border-zinc-700 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 border-b border-zinc-800 bg-zinc-950/60 flex-shrink-0">
          {[
            { label: "Hours", value: `${project.estimate.hours}h` },
            { label: "Cost", value: `$${project.estimate.cost.toLocaleString()}` },
            { label: "Timeline", value: project.estimate.timeline },
            { label: "Team Size", value: `${project.estimate.team.size} members` },
          ].map(({ label, value }) => (
            <div key={label} className="p-4.5 text-center border-r border-zinc-800 last:border-r-0">
              <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{label}</p>
              <p className="text-xs font-black text-zinc-100 mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Tab Selection */}
        <div className="flex gap-1 p-3 border-b border-zinc-800 bg-zinc-950/40 flex-shrink-0">
          {tabs.map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === t.id ? "bg-emerald-600 text-white shadow-xs" : "text-zinc-400 hover:text-zinc-100"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        <div className="overflow-y-auto flex-1 p-6 text-left">
          
          {activeTab === "summary" && (
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Executive Summary</p>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 border border-zinc-800 p-4 rounded-2xl">{project.ai_response.summary}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Features in Scope</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.features.map(f => (
                      <span key={f} className="text-[10px] bg-zinc-950/80 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg capitalize">{f.replace(/_/g, " ")}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Recommended Team Roles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.estimate.team.roles.map(r => (
                      <span key={r} className="text-[10px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">Recommended Tech Stack Layers</p>
                <div className="space-y-2">
                  {Object.entries(project.ai_response.tech_stack).map(([layer, rec]) => (
                    <div key={layer} className="flex gap-3 text-xs bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-xl">
                      <span className="font-bold text-emerald-400 min-w-[130px] flex-shrink-0 font-mono text-[10px] uppercase tracking-wider">{layer}</span>
                      <span className="text-zinc-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "roadmap" && (
            <div className="space-y-5 relative pl-6">
              <div className="absolute left-6.5 top-3 bottom-3 w-px bg-gradient-to-b from-emerald-500/60 to-transparent" />
              {project.ai_response.roadmap?.length > 0 ? project.ai_response.roadmap.map((phase, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  <div className="absolute left-[-22px] w-6 h-6 rounded bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-[10px] font-bold">{idx + 1}</div>
                  <div className="flex-1 bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4.5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-xs text-zinc-100">{phase.title}</h4>
                        <div className="space-y-1">
                          {phase.features.map((f, fi) => (
                            <div key={fi} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-full flex-shrink-0">
                        ⏱ {phase.duration}
                      </span>
                    </div>
                  </div>
                </div>
              )) : <p className="text-zinc-500 text-xs">No roadmap available.</p>}
            </div>
          )}

          {activeTab === "sprints" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.ai_response.sprint_plan?.length > 0 ? project.ai_response.sprint_plan.map((sp, idx) => (
                <div key={idx} className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-4.5 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-extrabold text-xs text-zinc-100">{sp.title}</span>
                    <span className="text-[9px] font-bold bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full">{sp.effort}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">{sp.objectives}</p>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-wider">Deliverables</span>
                    {sp.deliverables.map((d, di) => (
                      <div key={di} className="flex items-start gap-1.5 text-[11px] text-zinc-400 leading-none">
                        <Circle className="w-1.5 h-1.5 text-emerald-400 mt-1 flex-shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )) : <p className="text-zinc-500 text-xs col-span-2">No sprint plan available.</p>}
            </div>
          )}

          {activeTab === "risks" && (
            <div className="space-y-4">
              {project.ai_response.risks.map((r, idx) => (
                <div key={idx} className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-2">
                  <span className="text-[9px] uppercase font-bold bg-amber-950/60 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full inline-block font-mono">Risk {idx + 1}</span>
                  <h4 className="font-extrabold text-xs text-zinc-100 leading-relaxed">{r.risk}</h4>
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <span className="text-[9px] font-bold uppercase text-emerald-400 tracking-widest block mb-1">Mitigation Strategy</span>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">{r.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard({ onLogout }) {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedProject, setSelectedProject] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllEstimates();
      setEstimates(data);
    } catch (e) {
      setError("Failed to load estimate proposals. Verify estimation server is active on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to permanently delete this project proposal?")) return;
    setDeletingId(projectId);
    try {
      await deleteEstimate(projectId);
      setEstimates(estimates.filter(e => e.project_id !== projectId));
    } catch (err) {
      alert("Failed to delete proposal.");
    } finally {
      setDeletingId(null);
    }
  };

  const stats = useMemo(() => {
    if (estimates.length === 0) {
      return { totalCount: 0, pipeline: 0, avgCost: 0, avgHours: 0 };
    }
    const totalCount = estimates.length;
    const pipeline = estimates.reduce((acc, curr) => acc + (curr.estimate.cost || 0), 0);
    const avgCost = pipeline / totalCount;
    const avgHours = estimates.reduce((acc, curr) => acc + (curr.estimate.hours || 0), 0) / totalCount;
    
    return { totalCount, pipeline, avgCost, avgHours };
  }, [estimates]);

  const processedEstimates = useMemo(() => {
    let result = [...estimates];
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e => 
        e.project_name.toLowerCase().includes(q) ||
        e.client_name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    }

    if (filterIndustry) {
      result = result.filter(e => e.industry === filterIndustry);
    }

    if (filterPlatform) {
      result = result.filter(e => e.platforms.includes(filterPlatform));
    }

    result.sort((a, b) => {
      const aVal = a.estimate.cost;
      const bVal = b.estimate.cost;
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

    return result;
  }, [estimates, search, filterIndustry, filterPlatform, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 relative overflow-x-hidden text-left selection:bg-emerald-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />

      {/* Header banner */}
      <header className="border-b border-slate-200 bg-white/80 py-4 px-6 sticky top-0 z-45 backdrop-blur-md shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              ProjectPilot <span className="text-emerald-600 font-semibold">Admin</span>
            </span>
          </div>
          <button 
            onClick={onLogout}
            className="text-xs font-bold text-slate-700 hover:text-red-600 border border-slate-300 hover:border-red-300 bg-white px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1 shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Portal</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8 z-10 relative">
        
        {/* Banner Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Proposal Registry</h1>
            <p className="text-slate-600 text-xs mt-0.5">Monitor and evaluate gathered client requirements estimates.</p>
          </div>
          <button 
            onClick={fetchData}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Refresh Records
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {error}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Scoped Projects" value={stats.totalCount} icon={CheckSquare} color="text-emerald-700 bg-emerald-50 border border-emerald-200" />
          <StatCard label="Pipeline Contract Value" value={`$${Math.round(stats.pipeline).toLocaleString()}`} icon={DollarSign} color="text-teal-700 bg-teal-50 border border-teal-200" />
          <StatCard label="Average Proposal Cost" value={`$${Math.round(stats.avgCost).toLocaleString()}`} icon={Zap} color="text-emerald-800 bg-emerald-100 border border-emerald-300" />
          <StatCard label="Average Developer Effort" value={`${Math.round(stats.avgHours)} Hours`} icon={Clock} color="text-green-700 bg-green-50 border border-green-200" />
        </div>

        {/* Analytics Distribution Graphs Grid */}
        {!loading && estimates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <BarChart2 className="w-4.5 h-4.5 text-emerald-600" />
                Industry Proposal Volume
              </h3>
              <IndustryDistributionChart estimates={estimates} />
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4.5 h-4.5 text-teal-600" />
                Monthly Scoping Influx
              </h3>
              
              <div className="h-[120px] flex items-end justify-between relative pt-6 font-mono text-[9px] text-slate-500">
                <div className="absolute inset-x-0 bottom-4 border-b border-slate-200" />
                
                <svg className="absolute inset-0 w-full h-[100px]" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M 0 35 Q 25 25 50 15 T 100 5" fill="none" stroke="url(#gradient-emerald)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="flex flex-col items-center z-10">
                  <span className="font-bold text-slate-900">2</span>
                  <span className="mt-4">May</span>
                </div>
                <div className="flex flex-col items-center z-10">
                  <span className="font-bold text-slate-900">5</span>
                  <span className="mt-4">June</span>
                </div>
                <div className="flex flex-col items-center z-10">
                  <span className="font-bold text-slate-900">12</span>
                  <span className="mt-4">July</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Table Container */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, clients..." 
                className="w-full bg-white border border-slate-300 rounded-xl pl-11 pr-4 py-3 text-xs outline-none focus:border-emerald-500 text-slate-900 transition-colors shadow-xs"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              
              <div className="flex items-center space-x-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select 
                  value={filterIndustry} 
                  onChange={(e) => setFilterIndustry(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-emerald-500 shadow-xs"
                >
                  <option value="">All Industries</option>
                  {Object.entries(INDUSTRY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <select 
                value={filterPlatform} 
                onChange={(e) => setFilterPlatform(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-emerald-500 shadow-xs"
              >
                <option value="">All Platforms</option>
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
              </select>

              <button 
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold shadow-xs"
              >
                <span>Cost: {sortOrder === "desc" ? "High to Low" : "Low to High"}</span>
                {sortOrder === "desc" ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>

            </div>

          </div>

          {/* Proposals List Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-slate-500 text-xs">Querying database records...</p>
            </div>
          ) : processedEstimates.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-xs">No project proposals matched the filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    <th className="px-6 py-4 text-left">Project Title</th>
                    <th className="px-6 py-4 text-left">Client Partner</th>
                    <th className="px-6 py-4 text-left">Platforms</th>
                    <th className="px-6 py-4 text-left">Hours</th>
                    <th className="px-6 py-4 text-right">Estimate Cost</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {processedEstimates.map((est) => (
                    <tr key={est.project_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-left">
                        <span className="font-extrabold text-slate-900 block">{est.project_name}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider capitalize">{est.industry} sector</span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <span className="font-semibold text-slate-800 block">{est.client_name}</span>
                        <span className="text-[10px] text-slate-500">{est.email}</span>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex gap-1">
                          {est.platforms.map(p => (
                            <span key={p} className="text-[9px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded capitalize">{p}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-left font-mono">{est.estimate.hours}h</td>
                      <td className="px-6 py-4 text-right font-black font-mono text-emerald-700">${est.estimate.cost.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setSelectedProject(est)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => window.open(getPdfUrl(est.project_id), "_blank")}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(est.project_id)}
                            disabled={deletingId === est.project_id}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-400 hover:text-red-600 hover:border-red-300 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                            title="Delete Estimate"
                          >
                            {deletingId === est.project_id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>

      {/* Modal Inspector Component */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
}
