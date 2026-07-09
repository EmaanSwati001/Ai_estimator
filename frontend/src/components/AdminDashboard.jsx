import React, { useState, useEffect, useMemo } from "react";
import {
  Layers, LogOut, Search, Trash2, Download, Eye, X, ChevronUp, ChevronDown,
  DollarSign, Clock, Users, BarChart2, Calendar, AlertTriangle, CheckSquare,
  Map, Zap, Server, Globe, Database, CloudLightning, Cpu, Circle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllEstimates, deleteEstimate, getPdfUrl } from "../services/api";

// Industry display helper
const INDUSTRY_LABELS = {
  ecommerce: "E-Commerce", finance: "Finance & Fintech", healthcare: "Healthcare",
  education: "Education", social: "Social Media", saas: "SaaS", other: "Other"
};

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-black text-slate-100 mt-0.5">{value}</h3>
      </div>
    </div>
  );
}

// ─── Industry Distribution Bar ────────────────────────────────────────────────
function IndustryBar({ estimates }) {
  const counts = {};
  estimates.forEach(e => {
    const key = e.industry || "other";
    counts[key] = (counts[key] || 0) + 1;
  });
  const total = estimates.length || 1;
  const COLORS = ["bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-amber-500", "bg-emerald-500", "bg-sky-500", "bg-red-500"];
  const entries = Object.entries(counts);

  return (
    <div className="space-y-3">
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
        {entries.map(([key, cnt], i) => (
          <div key={key} className={`${COLORS[i % COLORS.length]} h-full`}
            style={{ width: `${(cnt / total) * 100}%` }}
            title={`${INDUSTRY_LABELS[key] || key}: ${cnt}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {entries.map(([key, cnt], i) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className={`w-2.5 h-2.5 rounded-full ${COLORS[i % COLORS.length]}`} />
            <span>{INDUSTRY_LABELS[key] || key} ({cnt})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Project Detail Modal ─────────────────────────────────────────────────────
function ProjectModal({ project, onClose }) {
  const [activeTab, setActiveTab] = useState("summary");
  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "roadmap", label: "Roadmap" },
    { id: "sprints", label: "Sprints" },
    { id: "risks", label: "Risks" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 flex-shrink-0">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">Project Detail</span>
            <h2 className="text-xl font-extrabold mt-0.5">{project.project_name}</h2>
            <p className="text-slate-400 text-xs mt-0.5">{project.client_name} · {project.email} · <span className="capitalize">{project.industry}</span></p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => window.open(getPdfUrl(project.project_id), "_blank")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center cursor-pointer transition-all">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-4 border-b border-slate-800 flex-shrink-0">
          {[
            { label: "Hours", value: `${project.estimate.hours}h` },
            { label: "Cost", value: `$${project.estimate.cost.toLocaleString()}` },
            { label: "Timeline", value: project.estimate.timeline },
            { label: "Team", value: `${project.estimate.team.size} members` },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 text-center border-r border-slate-800 last:border-r-0">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</p>
              <p className="text-sm font-black text-slate-200 mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Tab Nav */}
        <div className="flex gap-1 p-3 border-b border-slate-800 flex-shrink-0">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === t.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {activeTab === "summary" && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Executive Summary</p>
                <p className="text-sm text-slate-300 leading-relaxed">{project.ai_response.summary}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Features in Scope</p>
                <div className="flex flex-wrap gap-2">
                  {project.features.map(f => (
                    <span key={f} className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md capitalize">{f.replace(/_/g, " ")}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Recommended Team Roles</p>
                <div className="flex flex-wrap gap-2">
                  {project.estimate.team.roles.map(r => (
                    <span key={r} className="text-xs bg-indigo-950/40 border border-indigo-900/50 text-indigo-300 px-2.5 py-1 rounded-md">{r}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Tech Stack</p>
                <div className="space-y-2">
                  {Object.entries(project.ai_response.tech_stack).map(([layer, rec]) => (
                    <div key={layer} className="flex gap-3 text-xs bg-slate-950/40 border border-slate-800 p-3 rounded-xl">
                      <span className="font-bold text-indigo-300 min-w-[120px] flex-shrink-0">{layer}</span>
                      <span className="text-slate-400">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "roadmap" && (
            <div className="space-y-4">
              {project.ai_response.roadmap?.length > 0 ? project.ai_response.roadmap.map((phase, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black">{idx + 1}</div>
                  <div className="flex-1 bg-slate-950/40 border border-slate-800 rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h4 className="font-bold text-sm text-slate-200">{phase.title}</h4>
                        <div className="mt-2 space-y-1">
                          {phase.features.map((f, fi) => (
                            <div key={fi} className="flex items-center gap-2 text-xs text-slate-400">
                              <CheckSquare className="w-3 h-3 text-indigo-400" />{f}
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs font-bold bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full flex-shrink-0">
                        <Clock className="w-3 h-3 inline mr-1" />{phase.duration}
                      </span>
                    </div>
                  </div>
                </div>
              )) : <p className="text-slate-500 text-sm">No roadmap data available.</p>}
            </div>
          )}

          {activeTab === "sprints" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.ai_response.sprint_plan?.length > 0 ? project.ai_response.sprint_plan.map((sp, idx) => (
                <div key={idx} className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-200">{sp.title}</span>
                    <span className="text-[10px] font-bold bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">{sp.effort}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${sp.progress ?? 0}%` }} />
                  </div>
                  <p className="text-xs text-slate-400">{sp.objectives}</p>
                  <div className="space-y-1.5">
                    {sp.deliverables.map((d, di) => (
                      <div key={di} className="flex items-start gap-2 text-xs text-slate-400">
                        <Circle className="w-2 h-2 text-indigo-500 mt-1 flex-shrink-0" />{d}
                      </div>
                    ))}
                  </div>
                </div>
              )) : <p className="text-slate-500 text-sm col-span-2">No sprint plan available.</p>}
            </div>
          )}

          {activeTab === "risks" && (
            <div className="space-y-4">
              {project.ai_response.risks.map((r, idx) => (
                <div key={idx} className="p-4 bg-red-950/5 border border-red-900/20 rounded-2xl space-y-2">
                  <span className="text-[10px] uppercase font-bold bg-red-900/20 text-red-400 px-2 py-0.5 rounded-full">Risk {idx + 1}</span>
                  <h4 className="font-semibold text-sm text-red-200">{r.risk}</h4>
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-1">Mitigation</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{r.mitigation}</p>
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
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first
  const [selectedProject, setSelectedProject] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllEstimates();
      setEstimates(data);
    } catch (e) {
      setError("Failed to load estimates. Ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project and its PDF? This action cannot be undone.")) return;
    setDeletingId(projectId);
    try {
      await deleteEstimate(projectId);
      setEstimates(prev => prev.filter(est => est.project_id !== projectId));
      if (selectedProject?.project_id === projectId) setSelectedProject(null);
    } catch (e) {
      alert("Failed to delete project: " + e.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Stats computations
  const totalProjects = estimates.length;
  const now = new Date();
  const thisMonth = estimates.filter(e => {
    // We don't have created_at, so all visible ones count for now
    return true;
  }).length;
  const avgCost = totalProjects > 0
    ? Math.round(estimates.reduce((sum, e) => sum + e.estimate.cost, 0) / totalProjects)
    : 0;
  const avgTimeline = totalProjects > 0
    ? (() => {
        const weeks = estimates.map(e => {
          const m = e.estimate.timeline.match(/\d+/g);
          return m ? parseInt(m[m.length - 1]) : 4;
        });
        return Math.round(weeks.reduce((a, b) => a + b, 0) / weeks.length);
      })()
    : 0;

  // Filtered + sorted list
  const filteredEstimates = useMemo(() => {
    let list = [...estimates];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.project_name.toLowerCase().includes(q) ||
        e.client_name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    }
    if (filterIndustry) {
      list = list.filter(e => e.industry === filterIndustry);
    }
    // Sort by cost as a proxy for complexity/date
    list.sort((a, b) => sortOrder === "desc"
      ? b.estimate.cost - a.estimate.cost
      : a.estimate.cost - b.estimate.cost
    );
    return list;
  }, [estimates, search, filterIndustry, sortOrder]);

  const industries = [...new Set(estimates.map(e => e.industry))];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-950/20 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/60 py-4 px-6 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">EstimatorAI</span>
              <span className="text-slate-500 text-xs ml-2 font-semibold uppercase tracking-wider">Admin</span>
            </div>
          </div>
          <button onClick={onLogout}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer">
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Page Title */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">View, search, and manage all generated project estimates.</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Projects" value={totalProjects} icon={BarChart2} color="text-indigo-400 bg-indigo-500/10" />
          <StatCard label="Projects Loaded" value={thisMonth} icon={Calendar} color="text-purple-400 bg-purple-500/10" />
          <StatCard label="Average Cost" value={`$${avgCost.toLocaleString()}`} icon={DollarSign} color="text-emerald-400 bg-emerald-500/10" />
          <StatCard label="Avg Timeline" value={`${avgTimeline} wks`} icon={Clock} color="text-amber-400 bg-amber-500/10" />
        </motion.div>

        {/* Industry Distribution */}
        {estimates.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-300">Industry Distribution</h3>
            <IndustryBar estimates={estimates} />
          </motion.div>
        )}

        {/* Search / Filter / Sort */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by project name, client, or email..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
          </div>
          <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-sm outline-none focus:border-indigo-500 cursor-pointer">
            <option value="">All Industries</option>
            {industries.map(ind => <option key={ind} value={ind}>{INDUSTRY_LABELS[ind] || ind}</option>)}
          </select>
          <button onClick={() => setSortOrder(s => s === "desc" ? "asc" : "desc")}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-2.5 text-slate-300 text-sm flex items-center gap-2 cursor-pointer transition-all">
            {sortOrder === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            {sortOrder === "desc" ? "Highest Cost" : "Lowest Cost"}
          </button>
        </motion.div>

        {/* Projects Table */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-slate-900/20 border border-slate-900 rounded-3xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3 bg-slate-900/60 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span className="col-span-3">Project</span>
            <span className="col-span-2">Client</span>
            <span className="col-span-1 text-center">Industry</span>
            <span className="col-span-2 text-center">Hours / Cost</span>
            <span className="col-span-2 text-center">Timeline</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="p-8 text-center text-red-400 text-sm flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />{error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredEstimates.length === 0 && (
            <div className="py-16 text-center text-slate-500 text-sm">
              {search || filterIndustry ? "No projects match your filters." : "No projects generated yet."}
            </div>
          )}

          {/* Rows */}
          {!loading && !error && filteredEstimates.map((est, idx) => (
            <div key={est.project_id}
              className="grid grid-cols-12 px-6 py-4 border-b border-slate-900 last:border-b-0 hover:bg-slate-900/30 transition-all items-center cursor-pointer group"
              onClick={() => setSelectedProject(est)}>
              <div className="col-span-3 pr-4">
                <p className="font-semibold text-sm text-slate-200 truncate">{est.project_name}</p>
                <p className="text-[11px] text-slate-500 truncate">{est.project_id.slice(0, 12)}...</p>
              </div>
              <div className="col-span-2 pr-3">
                <p className="text-xs text-slate-300 truncate">{est.client_name}</p>
                <p className="text-[11px] text-slate-500 truncate">{est.email}</p>
              </div>
              <div className="col-span-1 text-center">
                <span className="text-[10px] font-semibold bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full capitalize">
                  {INDUSTRY_LABELS[est.industry] || est.industry}
                </span>
              </div>
              <div className="col-span-2 text-center">
                <p className="text-xs font-bold text-slate-200">${est.estimate.cost.toLocaleString()}</p>
                <p className="text-[11px] text-slate-500">{est.estimate.hours}h</p>
              </div>
              <div className="col-span-2 text-center text-xs text-slate-400">{est.estimate.timeline}</div>
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button onClick={e => { e.stopPropagation(); setSelectedProject(est); }}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-all cursor-pointer"
                  title="View Project">
                  <Eye className="w-3.5 h-3.5 text-slate-300" />
                </button>
                <button onClick={e => { e.stopPropagation(); window.open(getPdfUrl(est.project_id), "_blank"); }}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-emerald-700 flex items-center justify-center transition-all cursor-pointer"
                  title="Download PDF">
                  <Download className="w-3.5 h-3.5 text-slate-300" />
                </button>
                <button onClick={e => handleDelete(est.project_id, e)} disabled={deletingId === est.project_id}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-red-700 disabled:opacity-50 flex items-center justify-center transition-all cursor-pointer"
                  title="Delete Project">
                  {deletingId === est.project_id
                    ? <div className="w-3 h-3 border border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
                    : <Trash2 className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
