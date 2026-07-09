import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Layers, ShieldCheck, Sparkles, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRecommendations } from "../services/api";

const INDUSTRIES = [
  { id: "ecommerce", name: "E-Commerce", desc: "Online retail, shopping carts, transactions" },
  { id: "finance", name: "Finance & Fintech", desc: "Banking, ledgers, wallets, security audits" },
  { id: "healthcare", name: "Healthcare & MedTech", desc: "HIPAA-compliant patient portals, health records" },
  { id: "education", name: "Education & EdTech", desc: "Virtual classrooms, student quizzes, video streams" },
  { id: "social", name: "Social Networking", desc: "Interactive feeds, connections, sharing profiles" },
  { id: "saas", name: "SaaS & Cloud Apps", desc: "B2B efficiency tools, tenants, subscriptions" },
  { id: "other", name: "Custom / Other", desc: "Specific bespoke utility workflows" }
];

const PLATFORMS = [
  { id: "web", name: "Web App", desc: "Built for standard desktop and mobile browsers" },
  { id: "mobile", name: "Mobile App", desc: "Native iOS & Android phone applications" },
  { id: "desktop", name: "Desktop App", desc: "Executable packages for macOS & Windows systems" }
];

const FEATURES = [
  { id: "auth", name: "User Auth & Profiles", hours: 40, desc: "Sign up, logins, password recovery, edit profiles" },
  { id: "dashboard", name: "Dashboard & Analytics", hours: 50, desc: "Interactive charts, statistical reports, metric cards" },
  { id: "payments", name: "Payment & Subscriptions", hours: 30, desc: "Stripe checkout billing, subscription plan webhooks" },
  { id: "chat", name: "Real-time Chat Rooms", hours: 60, desc: "Socket-based direct messaging, groups, online logs" },
  { id: "notifications", name: "Push Notifications", hours: 20, desc: "In-app banner updates and mobile phone OS alerts" },
  { id: "search", name: "Faceted Search & Filter", hours: 25, desc: "Advanced database querying, category filters, sorting" },
  { id: "social", name: "Social SSO Logins", hours: 15, desc: "Fast oauth credentials (Google, Apple, Facebook)" },
  { id: "upload", name: "Cloud File Uploads", hours: 25, desc: "Image/document attachments, AWS S3 buckets" },
  { id: "ai", name: "AI Recommendations", hours: 80, desc: "Intelligent predictions, search autocomplete, LLM summaries" },
  { id: "admin", name: "Admin Console CMS", hours: 40, desc: "Management UI, client access control toggles" },
  { id: "multilang", name: "Multi-Language (i18n)", hours: 20, desc: "Global i18n support, localized language files" },
  { id: "thirdparty", name: "External integrations", hours: 30, desc: "Third-party APIs connection (CRM, ERP, Maps)" }
];

const EFFORT_COLORS = {
  Small: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
  Medium: "text-amber-400 bg-amber-950/40 border-amber-500/30",
  Large: "text-red-400 bg-red-950/40 border-red-500/30",
};

const TOTAL_STEPS = 6;

export default function Questionnaire({ onSubmit, onBackToLanding }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", email: "", project_name: "", description: "",
    industry: "", platforms: [], features: []
  });
  const [recommendations, setRecommendations] = useState([]);
  const [addedRecommendations, setAddedRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recsError, setRecsError] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError("");
  };
  const handleSelectIndustry = (id) => { setFormData({ ...formData, industry: id }); setValidationError(""); };
  const handleTogglePlatform = (id) => {
    const updated = formData.platforms.includes(id)
      ? formData.platforms.filter((p) => p !== id)
      : [...formData.platforms, id];
    setFormData({ ...formData, platforms: updated }); setValidationError("");
  };
  const handleToggleFeature = (id) => {
    const updated = formData.features.includes(id)
      ? formData.features.filter((f) => f !== id)
      : [...formData.features, id];
    setFormData({ ...formData, features: updated }); setValidationError("");
  };

  // Add/remove a recommended feature
  const handleAddRec = (rec) => {
    if (!addedRecommendations.find(r => r.id === rec.id)) {
      setAddedRecommendations([...addedRecommendations, rec]);
    }
  };
  const handleRemoveRec = (recId) => {
    setAddedRecommendations(addedRecommendations.filter(r => r.id !== recId));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.project_name.trim()) return "Project Name is required.";
      if (!formData.description.trim()) return "Project Description is required.";
      if (!formData.name.trim()) return "Your Name is required.";
      if (!formData.email.trim()) return "Your Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Please enter a valid email address.";
    }
    if (step === 2 && !formData.industry) return "Please select an industry domain.";
    if (step === 3 && formData.platforms.length === 0) return "Please select at least one platform.";
    if (step === 4 && formData.features.length === 0) return "Please select at least one feature.";
    return "";
  };

  const handleNext = async () => {
    const err = validateStep();
    if (err) { setValidationError(err); return; }

    // Entering Step 5 — fetch AI recommendations
    if (step === 4) {
      setStep(5);
      setValidationError("");
      setLoadingRecs(true);
      setRecsError("");
      try {
        const recs = await getRecommendations(formData.industry, formData.features);
        setRecommendations(recs);
      } catch (e) {
        setRecsError("Could not load recommendations. You may proceed without them.");
      } finally {
        setLoadingRecs(false);
      }
      return;
    }

    setStep(step + 1);
    setValidationError("");
  };

  const handlePrev = () => {
    if (step === 1) { onBackToLanding(); return; }
    setStep(step - 1);
    setValidationError("");
  };

  const handleSubmitForm = () => {
    // Merge added recommended feature IDs into the features list
    const allFeatureIds = [
      ...formData.features,
      ...addedRecommendations.map(r => r.id).filter(id => !formData.features.includes(id))
    ];
    onSubmit({ ...formData, features: allFeatureIds });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/40 py-4 px-6 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
              EstimatorAI
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 font-medium">Step {step} of {TOTAL_STEPS}</span>
            <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full bg-slate-900/55 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
          <AnimatePresence>
            {validationError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-sm">
                {validationError}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="min-h-[380px]">
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div><h2 className="text-2xl font-bold">Tell us about your project</h2>
                  <p className="text-slate-400 text-sm mt-1">Provide details so our engine and AI can tailor your proposal.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Project Name", name: "project_name", placeholder: "e.g. DocConnect Health System", type: "text", span: false },
                    { label: "Your Full Name", name: "name", placeholder: "Jane Doe", type: "text", span: false },
                    { label: "Email Address", name: "email", placeholder: "jane@example.com", type: "email", span: true },
                  ].map(({ label, name, placeholder, type, span }) => (
                    <div key={name} className={`space-y-2 ${span ? "md:col-span-2" : ""}`}>
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label>
                      <input type={type} name={name} value={formData[name]} onChange={handleTextChange} placeholder={placeholder}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all" />
                    </div>
                  ))}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Brief Description</label>
                    <textarea name="description" value={formData.description} onChange={handleTextChange} rows={4}
                      placeholder="Explain what the app does, its primary goal, and its target audience..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all resize-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Industry */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div><h2 className="text-2xl font-bold">Select business industry</h2>
                  <p className="text-slate-400 text-sm mt-1">This applies custom risk assessment metrics and compliance structures.</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[320px] overflow-y-auto pr-1">
                  {INDUSTRIES.map((ind) => {
                    const isSelected = formData.industry === ind.id;
                    return (
                      <button key={ind.id} onClick={() => handleSelectIndustry(ind.id)}
                        className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.01] cursor-pointer ${isSelected ? "bg-indigo-500/10 border-indigo-500 shadow-md shadow-indigo-500/10" : "bg-slate-950/60 border-slate-800 hover:border-slate-700"}`}>
                        <h4 className="font-semibold text-sm flex items-center justify-between">
                          <span>{ind.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">{ind.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Platforms */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div><h2 className="text-2xl font-bold">Select target platforms</h2>
                  <p className="text-slate-400 text-sm mt-1">Where will your application be available? (Select all that apply)</p></div>
                <div className="grid grid-cols-1 gap-4">
                  {PLATFORMS.map((plat) => {
                    const isSelected = formData.platforms.includes(plat.id);
                    return (
                      <button key={plat.id} onClick={() => handleTogglePlatform(plat.id)}
                        className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${isSelected ? "bg-indigo-500/10 border-indigo-500" : "bg-slate-950/60 border-slate-800 hover:border-slate-700"}`}>
                        <div><h4 className="font-semibold text-sm">{plat.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{plat.desc}</p></div>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? "bg-indigo-500 border-indigo-500" : "border-slate-700"}`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Features */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div><h2 className="text-2xl font-bold">Select system features</h2>
                  <p className="text-slate-400 text-sm mt-1">Choose features to calculate overall complexity. AI recommendations follow next.</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {FEATURES.map((feat) => {
                    const isSelected = formData.features.includes(feat.id);
                    return (
                      <button key={feat.id} onClick={() => handleToggleFeature(feat.id)}
                        className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${isSelected ? "bg-indigo-500/10 border-indigo-500" : "bg-slate-950/60 border-slate-800 hover:border-slate-700"}`}>
                        <div className="pr-3">
                          <h4 className="font-semibold text-xs flex items-center space-x-1.5">
                            <span>{feat.name}</span>
                            <span className="text-[10px] bg-slate-800 text-indigo-300 font-bold px-1.5 py-0.5 rounded">+{feat.hours}h</span>
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1">{feat.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 flex-shrink-0 ${isSelected ? "bg-indigo-500 border-indigo-500" : "border-slate-700"}`}>
                          {isSelected && <div className="w-2 h-2 rounded bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 5: AI Recommendations */}
            {step === 5 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-indigo-400" />
                      AI Feature Recommendations
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      Based on your industry and features, our AI suggests these additions.
                    </p>
                  </div>
                </div>

                {loadingRecs && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                    </div>
                    <p className="text-slate-400 text-sm">Analyzing your project for smart suggestions...</p>
                  </div>
                )}

                {recsError && !loadingRecs && (
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-400 text-sm">
                    {recsError}
                  </div>
                )}

                {!loadingRecs && recommendations.length > 0 && (
                  <div className="space-y-5">
                    {/* Available Recommendations */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Suggested Features — Click to Add</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-1">
                        {recommendations.map((rec) => {
                          const isAdded = addedRecommendations.find(r => r.id === rec.id);
                          return (
                            <button key={rec.id} onClick={() => isAdded ? handleRemoveRec(rec.id) : handleAddRec(rec)}
                              className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer group ${isAdded ? "bg-indigo-500/10 border-indigo-500" : "bg-slate-950/60 border-slate-800 hover:border-indigo-500/50"}`}>
                              <div className="pr-3">
                                <h4 className="font-semibold text-xs text-slate-200">{rec.name}</h4>
                                <p className="text-[11px] text-slate-400 mt-1">{rec.desc}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-2 inline-block ${EFFORT_COLORS[rec.effort] || EFFORT_COLORS.Medium}`}>
                                  {rec.effort} effort
                                </span>
                              </div>
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isAdded ? "bg-red-500/10 text-red-400" : "bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20"}`}>
                                {isAdded ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Added Recommendations */}
                    {addedRecommendations.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                          ✓ Added to Scope ({addedRecommendations.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {addedRecommendations.map(r => (
                            <span key={r.id} className="flex items-center gap-1.5 text-xs bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-full">
                              {r.name}
                              <button onClick={() => handleRemoveRec(r.id)} className="hover:text-red-400 transition-colors cursor-pointer">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!loadingRecs && recommendations.length === 0 && !recsError && (
                  <div className="text-center py-8 text-slate-500 text-sm">No additional recommendations available. Proceed to review.</div>
                )}
              </motion.div>
            )}

            {/* STEP 6: Review */}
            {step === 6 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div><h2 className="text-2xl font-bold">Review information</h2>
                  <p className="text-slate-400 text-sm mt-1">Double check details before generating the proposal document.</p></div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 space-y-4 text-sm max-h-[320px] overflow-y-auto">
                  {[
                    { label: "Project Name", value: formData.project_name },
                    { label: "Client Contact", value: `${formData.name} (${formData.email})` },
                    { label: "Industry", value: INDUSTRIES.find(i => i.id === formData.industry)?.name || formData.industry },
                    { label: "Platforms", value: formData.platforms.join(", ") },
                    { label: "Core Features", value: formData.features.map(f => FEATURES.find(fe => fe.id === f)?.name || f).join(", ") },
                  ].map(({ label, value }) => (
                    <div key={label} className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-900">
                      <span className="text-slate-400 text-xs font-semibold uppercase">{label}</span>
                      <span className="col-span-2 text-slate-200 font-medium text-xs capitalize">{value}</span>
                    </div>
                  ))}
                  {addedRecommendations.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 py-1.5">
                      <span className="text-slate-400 text-xs font-semibold uppercase">AI-Added Features</span>
                      <span className="col-span-2 text-emerald-300 font-medium text-xs">{addedRecommendations.map(r => r.name).join(", ")}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-3.5 text-xs text-indigo-300">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span>The platform applies pre-defined complexity logic combined with AI generation for a professional proposal.</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-6 mt-8">
            <button onClick={handlePrev} className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-slate-200 transition-all cursor-pointer font-medium">
              <ArrowLeft className="w-4 h-4" />
              <span>{step === 1 ? "Cancel" : "Back"}</span>
            </button>
            {step < TOTAL_STEPS ? (
              <button onClick={handleNext} disabled={loadingRecs}
                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-100 text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer">
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmitForm}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-sm font-semibold px-6 py-3 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-indigo-500/15 transition-all cursor-pointer">
                <span>Generate Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-[10px] text-slate-600">
        All inputs are stored securely in the local SQLite engine instance.
      </footer>
    </div>
  );
}
