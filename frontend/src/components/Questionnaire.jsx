import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Layers, ShieldCheck, Sparkles, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRecommendations } from "../services/api";

const INDUSTRIES = [
  { id: "ecommerce", name: "E-Commerce & Retail", desc: "Online retail, shopping carts, checkout, coupons" },
  { id: "finance", name: "Finance & Fintech", desc: "Banking modules, immutable ledgers, transaction reports" },
  { id: "healthcare", name: "Healthcare & MedTech", desc: "HIPAA compliance, telehealth, doctor booking calendars" },
  { id: "education", name: "Education & EdTech", desc: "Virtual classrooms, adaptive HLS video, automatic grading" },
  { id: "social", name: "Social Networking", desc: "Interactive feeds, geo-connection filters, profile reach stats" },
  { id: "saas", name: "SaaS & Cloud Apps", desc: "B2B tenant isolation, shared workspaces, seat billing" },
  { id: "other", name: "Custom / Other", desc: "Bespoke internal administrative operations" }
];

const PLATFORMS = [
  { id: "web", name: "Web Application", desc: "Built for standard desktop and mobile browsers" },
  { id: "mobile", name: "Mobile Application", desc: "Native iOS & Android phone apps (React Native/Expo)" },
  { id: "desktop", name: "Desktop Application", desc: "Executable packages for macOS & Windows systems (Electron)" }
];

const FEATURES = [
  { id: "auth", name: "User Auth & Profiles", hours: 40, desc: "Secure logins, JWT session logs, password recovery, edit profiles" },
  { id: "dashboard", name: "Dashboard & Analytics", hours: 50, desc: "Interactive metric summaries, charts, statistical logs" },
  { id: "payments", name: "Payment & Subscriptions", hours: 30, desc: "Stripe checkout, customer portals, subscription plans" },
  { id: "chat", name: "Real-time Messaging", hours: 60, desc: "Direct chat rooms, WebSockets gateway, persistent chat history" },
  { id: "notifications", name: "Push Notifications", hours: 20, desc: "In-app banner updates and mobile phone OS notification alerts" },
  { id: "search", name: "Faceted Search & Filter", hours: 25, desc: "Advanced database querying, tag filtering, indexing" },
  { id: "social", name: "Social SSO Logins", hours: 15, desc: "Fast OAuth credentials (Google, Apple, Facebook)" },
  { id: "upload", name: "Cloud File Uploads", hours: 25, desc: "Image/document attachments, secure AWS S3 buckets integration" },
  { id: "ai", name: "AI Recommendations", hours: 80, desc: "Intelligent predictions, search autocomplete, LLM summaries" },
  { id: "admin", name: "Admin Console CMS", hours: 40, desc: "Management dashboard UI, client access control toggles" },
  { id: "multilang", name: "Multi-Language (i18n)", hours: 20, desc: "Global i18n support, localized language translation files" },
  { id: "thirdparty", name: "External integrations", hours: 30, desc: "Third-party APIs connection (CRM, ERP, Google Maps)" }
];

const RECS_EXPLANATIONS = {
  inventory: "Provides automatic low-stock notifications and variant tracking, minimizing inventory errors by up to 35%.",
  tracking: "Integrates directly with courier APIs (FedEx/UPS) to offer visual tracking timelines, lowering customer support load.",
  reviews: "Social proof increases product conversion rates. Allows text reviews, ratings, and photo uploads.",
  wishlist: "Let buyers bookmark products and receive price-drop notifications, boosting customer return rates.",
  coupons: "A dynamic marketing engine to deploy custom percentage discounts, flash sales, and referral promotions.",
  telehealth: "Enables secure patient-doctor consultations inside the app via WebRTC, ensuring medical accessibility.",
  healthrecords: "Ensures compliance with HIPAA and FHIR standards, securing communication with hospital EHR databases.",
  scheduling: "Enables self-service appointment scheduling with automated email reminders, reducing client no-shows.",
  billing: "Submit medical billing codes to insurers and verify client coverage statuses in real-time.",
  security: "Maintains an immutable database audit log of all record alterations, essential for bank audits.",
  analytics: "Renders visual charts showing capital flow, monthly recurring charges, and business projections.",
  export: "Enables users to download formatted transaction records or course curricula in one click.",
  thirdparty: "Direct Plaid API sync to securely aggregate banking transactions and evaluate user accounts.",
  quiz: "Renders dynamic course assignments, automated grades compilation, and downloadable certificates.",
  streaming: "Optimizes streaming using HLS protocol, dynamically scaling video quality to match connection speeds.",
  collaboration: "Enables shared workspaces, allowing corporate members to co-edit project boards.",
  moderation: "Uses AI classification models to filter inappropriate user posts, protecting community spaces."
};

const EFFORT_COLORS = {
  Small: "text-emerald-400 bg-emerald-950/60 border-emerald-500/30",
  Medium: "text-amber-400 bg-amber-950/60 border-amber-500/30",
  Large: "text-red-400 bg-red-950/60 border-red-500/30",
};

export default function Questionnaire({ onSubmit, onBackToLanding }) {
  const [discoveryPath, setDiscoveryPath] = useState("wizard");

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

  const handleSelectIndustry = (id) => {
    setFormData({ ...formData, industry: id });
    setValidationError("");
  };

  const handleTogglePlatform = (id) => {
    const updated = formData.platforms.includes(id)
      ? formData.platforms.filter((p) => p !== id)
      : [...formData.platforms, id];
    setFormData({ ...formData, platforms: updated });
    setValidationError("");
  };

  const handleToggleFeature = (id) => {
    const updated = formData.features.includes(id)
      ? formData.features.filter((f) => f !== id)
      : [...formData.features, id];
    setFormData({ ...formData, features: updated });
    setValidationError("");
  };

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
      if (!formData.name.trim()) return "Your Full Name is required.";
      if (!formData.email.trim()) return "Your Email Address is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Please enter a valid email address.";
    }
    if (step === 2 && !formData.industry) return "Please select a business industry.";
    if (step === 3 && formData.platforms.length === 0) return "Please select at least one platform.";
    if (step === 4 && formData.features.length === 0) return "Please select at least one feature.";
    return "";
  };

  const handleNext = async () => {
    const err = validateStep();
    if (err) { setValidationError(err); return; }

    if (step === 4) {
      setStep(5);
      setValidationError("");
      setLoadingRecs(true);
      setRecsError("");
      try {
        const recs = await getRecommendations(formData.industry, formData.features);
        setRecommendations(recs);
      } catch (e) {
        setRecsError("Could not load smart recommendations. You can proceed with standard features.");
      } finally {
        setLoadingRecs(false);
      }
      return;
    }

    setStep(step + 1);
    setValidationError("");
  };

  const handlePrev = () => {
    if (step === 1) {
      onBackToLanding();
      return;
    }
    setStep(step - 1);
    setValidationError("");
  };

  const handleSubmitForm = () => {
    const allFeatureIds = [
      ...formData.features,
      ...addedRecommendations.map(r => r.id).filter(id => !formData.features.includes(id))
    ];
    onSubmit({ ...formData, features: allFeatureIds });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-x-hidden selection:bg-emerald-500/30">
      {/* Dynamic Background Spotlights */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[40%] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[40%] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />

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
          {discoveryPath === "wizard" && (
            <div className="flex items-center space-x-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Step {step} of 6</span>
              <div className="w-28 bg-slate-200 border border-slate-300 h-2 rounded-full overflow-hidden p-0.5">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(step / 6) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Container - High Contrast Dark Card on Half-White Canvas */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">

        {discoveryPath === "wizard" && (
          <div className="max-w-3xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-zinc-100">
            <AnimatePresence mode="wait">
              {validationError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold">
                  ⚠️ &nbsp; {validationError}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="min-h-[380px] flex flex-col justify-between">
              
              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-zinc-100">Project Scoping Overview</h2>
                    <p className="text-zinc-400 text-xs mt-1">Provide core details so the estimation calculations can align.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { label: "Project Name", name: "project_name", placeholder: "e.g., Apex Health Booking Platform", type: "text", span: false },
                      { label: "Your Full Name", name: "name", placeholder: "Jane Doe", type: "text", span: false },
                      { label: "Email Address", name: "email", placeholder: "jane@example.com", type: "email", span: true },
                    ].map(({ label, name, placeholder, type, span }) => (
                      <div key={name} className={`space-y-2 ${span ? "md:col-span-2" : ""}`}>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</label>
                        <input 
                          type={type} 
                          name={name} 
                          value={formData[name]} 
                          onChange={handleTextChange} 
                          placeholder={placeholder}
                          className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-xs transition-all shadow-inner" 
                        />
                      </div>
                    ))}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Brief Application Description</label>
                      <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleTextChange} 
                        rows={4}
                        placeholder="Explain what the app does, its primary objective, and its target audience..."
                        className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-xs transition-all resize-none shadow-inner" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Industry */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-zinc-100">Select Business Industry</h2>
                    <p className="text-zinc-400 text-xs mt-1">This sets custom compliance standards and risk factors.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[310px] overflow-y-auto pr-1 select-none">
                    {INDUSTRIES.map((ind) => {
                      const isSelected = formData.industry === ind.id;
                      return (
                        <button 
                          key={ind.id} 
                          onClick={() => handleSelectIndustry(ind.id)}
                          className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] cursor-pointer ${isSelected ? "bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-500/10" : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700"}`}
                        >
                          <h4 className="font-extrabold text-xs flex items-center justify-between text-zinc-100">
                            <span>{ind.name}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </h4>
                          <p className="text-[10px] text-zinc-400 mt-1 leading-normal">{ind.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Platforms */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-zinc-100">Target Platforms</h2>
                    <p className="text-zinc-400 text-xs mt-1">Select where your app will run. Effort calculations adjust for cross-platform support.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3.5 select-none">
                    {PLATFORMS.map((plat) => {
                      const isSelected = formData.platforms.includes(plat.id);
                      return (
                        <button 
                          key={plat.id} 
                          onClick={() => handleTogglePlatform(plat.id)}
                          className={`p-4.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${isSelected ? "bg-emerald-950/60 border-emerald-500" : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700"}`}
                        >
                          <div>
                            <h4 className="font-extrabold text-xs text-zinc-100">{plat.name}</h4>
                            <p className="text-[10px] text-zinc-400 mt-0.5">{plat.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isSelected ? "bg-emerald-500 border-emerald-500" : "border-zinc-700"}`}>
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Features */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-zinc-100">Select System Features</h2>
                    <p className="text-zinc-400 text-xs mt-1">Select core specifications. The rule engine calculates effort based on selections.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 select-none">
                    {FEATURES.map((feat) => {
                      const isSelected = formData.features.includes(feat.id);
                      return (
                        <button 
                          key={feat.id} 
                          onClick={() => handleToggleFeature(feat.id)}
                          className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${isSelected ? "bg-emerald-950/60 border-emerald-500" : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700"}`}
                        >
                          <div className="pr-3">
                            <h4 className="font-extrabold text-[11px] text-zinc-100 flex items-center space-x-1.5">
                              <span>{feat.name}</span>
                              <span className="text-[9px] bg-zinc-800 border border-zinc-700 text-emerald-300 font-bold px-1.5 py-0.5 rounded">+{feat.hours}h</span>
                            </h4>
                            <p className="text-[10px] text-zinc-400 mt-1 leading-normal">{feat.desc}</p>
                          </div>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${isSelected ? "bg-emerald-500 border-emerald-500" : "border-zinc-700"}`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-sm bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 5: AI Feature Recommendations */}
              {step === 5 && (
                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2">
                      <Sparkles className="w-5.5 h-5.5 text-emerald-400 animate-pulse" />
                      AI Feature Recommendations
                    </h2>
                    <p className="text-zinc-400 text-xs mt-1">
                      Our system suggests these custom features based on your industry segment. Review the benefit metrics below.
                    </p>
                  </div>

                  {loadingRecs && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                      </div>
                      <p className="text-zinc-400 text-xs">Analyzing requirements for value additions...</p>
                    </div>
                  )}

                  {recsError && !loadingRecs && (
                    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs">
                      {recsError}
                    </div>
                  )}

                  {!loadingRecs && recommendations.length > 0 && (
                    <div className="space-y-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">AI Suggestions — Click to Add</p>
                        <div className="grid grid-cols-1 gap-3 max-h-[220px] overflow-y-auto pr-1">
                          {recommendations.map((rec) => {
                            const isAdded = addedRecommendations.find(r => r.id === rec.id);
                            return (
                              <div key={rec.id} 
                                className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all group ${isAdded ? "bg-emerald-950/60 border-emerald-500" : "bg-zinc-950/60 border-zinc-800"}`}
                              >
                                <div className="pr-4 space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-extrabold text-xs text-zinc-100">{rec.name}</h4>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${EFFORT_COLORS[rec.effort] || EFFORT_COLORS.Medium}`}>
                                      {rec.effort} Effort
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-zinc-400 leading-relaxed">{rec.desc}</p>
                                  <p className="text-[9.5px] text-emerald-300/90 font-medium leading-relaxed pt-0.5">
                                    💡 <strong>Why:</strong> {RECS_EXPLANATIONS[rec.id.toLowerCase()] || "Accelerates launch velocity and meets standard regulatory integration paths."}
                                  </p>
                                </div>
                                <button 
                                  onClick={() => isAdded ? handleRemoveRec(rec.id) : handleAddRec(rec)}
                                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${isAdded ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"}`}
                                >
                                  {isAdded ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Added scope summaries */}
                      {addedRecommendations.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">✔ Added to Scope ({addedRecommendations.length})</p>
                          <div className="flex flex-wrap gap-2">
                            {addedRecommendations.map(r => (
                              <span key={r.id} className="flex items-center gap-1.5 text-[10px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-full">
                                {r.name}
                                <button onClick={() => handleRemoveRec(r.id)} className="hover:text-red-400 cursor-pointer">
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
                    <div className="text-center py-8 text-zinc-500 text-xs">No additional suggestions. Proceed to proposal review.</div>
                  )}
                </motion.div>
              )}

              {/* STEP 6: Review */}
              {step === 6 && (
                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-zinc-100">Review Project Profile</h2>
                    <p className="text-zinc-400 text-xs mt-1">Verify scope details before invoking the estimate calculations.</p>
                  </div>
                  
                  <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-5 space-y-4 text-xs max-h-[300px] overflow-y-auto">
                    {[
                      { label: "Project Name", value: formData.project_name },
                      { label: "Client Partner", value: `${formData.name} (${formData.email})` },
                      { label: "Industry Domain", value: INDUSTRIES.find(i => i.id === formData.industry)?.name || formData.industry },
                      { label: "Target Platforms", value: formData.platforms.map(p => PLATFORMS.find(pl => pl.id === p)?.name || p).join(", ") },
                      { label: "Core Scope Features", value: formData.features.map(f => FEATURES.find(fe => fe.id === f)?.name || f).join(", ") },
                    ].map(({ label, value }) => (
                      <div key={label} className="grid grid-cols-3 gap-2 py-2 border-b border-zinc-850 last:border-b-0">
                        <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">{label}</span>
                        <span className="col-span-2 text-zinc-200 font-semibold">{value}</span>
                      </div>
                    ))}
                    {addedRecommendations.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 py-2">
                        <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">AI Features Added</span>
                        <span className="col-span-2 text-emerald-300 font-semibold">{addedRecommendations.map(r => r.name).join(", ")}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 text-[11px] text-emerald-300">
                    <ShieldCheck className="w-5.5 h-5.5 text-emerald-400 flex-shrink-0" />
                    <span className="leading-relaxed">All metrics are evaluated in compliance with scoping parameters. Project costs are calculated strictly on calculation rules.</span>
                  </div>
                </motion.div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t border-zinc-800 pt-6 mt-8">
                <button 
                  onClick={handlePrev} 
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-100 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{step === 1 ? "Exit Scoper" : "Back"}</span>
                </button>
                {step < 6 ? (
                  <button 
                    onClick={handleNext} 
                    disabled={loadingRecs}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center space-x-1 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4 text-emerald-100" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmitForm}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                  >
                    <span>Compile Proposal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      <footer className="py-4 text-center text-[10px] text-slate-500">
        All requirements calculations are evaluated strictly in the local backend Rule Engine instance.
      </footer>
    </div>
  );
}
