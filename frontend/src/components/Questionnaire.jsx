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
    <div className="min-h-screen bg-black/90 text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#FF6201]/30">

      {/* Dynamic Background Spotlights */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[40%] rounded-full bg-[#FF6201]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[40%] rounded-full bg-[#FF6201]/5 blur-[130px] pointer-events-none" />


      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 py-4 px-6 fixed w-full top-0 z-50 backdrop-blur-xl shadow-xl shadow-black/30">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6201] to-[#d64f00] flex items-center justify-center shadow-lg shadow-[#FF6201]/25 border border-white/10">
              <Layers className="w-4 h-4 text-white" />
            </div>


            <span className="font-bold text-base tracking-tight text-white">
              ProjectPilot
              <span className="ml-1.5 text-[#FF6201] font-semibold text-xs px-1.5 py-0.5 rounded-md bg-[#FF6201]/10 border border-[#FF6201]/20">
                AI
              </span>
            </span>

          </div>


          {/* Wizard Progress */}
          {discoveryPath === "wizard" && (
            <div className="flex items-center gap-3 sm:gap-4">

              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider whitespace-nowrap">
                Step {step} of 6
              </span>


              <div className="w-24 sm:w-28 bg-white/10 border border-white/10 h-2 rounded-full overflow-hidden p-0.5">

                <div
                  className="bg-gradient-to-r from-[#FF6201] to-[#ff8a3d] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(step / 6) * 100}%` }}
                />

              </div>

            </div>
          )}

        </div>

      </header>


      {/* Main Container */}
      <main className="grow flex mt-12 items-center justify-center px-4 py-10">

        {discoveryPath === "wizard" && (
          <div className="max-w-3xl w-full bg-[#111111]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 text-zinc-100 backdrop-blur-xl">

            <AnimatePresence mode="wait">
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs font-semibold"
                >
                  ⚠️ &nbsp; {validationError}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="min-h-95 flex flex-col justify-between">

              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >

                  <div>
                    <h2 className="text-2xl font-extrabold text-white">
                      Project Scoping Overview
                    </h2>

                    <p className="text-zinc-400 text-xs mt-1">
                      Provide core details so the estimation calculations can align.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { label: "Project Name", name: "project_name", placeholder: "e.g., Apex Health Booking Platform", type: "text", span: false },
                      { label: "Your Full Name", name: "name", placeholder: "Jane Doe", type: "text", span: false },
                      { label: "Email Address", name: "email", placeholder: "jane@example.com", type: "email", span: true },
                    ].map(({ label, name, placeholder, type, span }) => (

                      <div key={name} className={`space-y-2 ${span ? "md:col-span-2" : ""}`}>

                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                          {label}
                        </label>

                        <input
                          type={type}
                          name={name}
                          value={formData[name]}
                          onChange={handleTextChange}
                          placeholder={placeholder}
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:border-[#FF6201] focus:ring-1 focus:ring-[#FF6201] outline-none text-xs transition-all shadow-inner"
                        />

                      </div>
                    ))}
                    <div className="space-y-2 md:col-span-2">

                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        Brief Application Description
                      </label>

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleTextChange}
                        rows={4}
                        placeholder="Explain what the app does, its primary objective, and its target audience..."
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:border-[#FF6201] focus:ring-1 focus:ring-[#FF6201] outline-none text-xs transition-all resize-none shadow-inner"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Industry */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">
                      Select Business Industry
                    </h2>

                    <p className="text-zinc-400 text-xs mt-1">
                      This sets custom compliance standards and risk factors.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[310px] overflow-y-auto pr-1 select-none">
                    {INDUSTRIES.map((ind) => {
                      const isSelected = formData.industry === ind.id;
                      return (

                        <button
                          key={ind.id}
                          onClick={() => handleSelectIndustry(ind.id)}
                          className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] cursor-pointer ${isSelected
                            ? "bg-[#FF6201]/10 border-[#FF6201]/50 shadow-md shadow-[#FF6201]/10"
                            : "bg-black/50 border-white/10 hover:border-white/20"
                            }`}
                        >

                          <h4 className="font-extrabold text-xs flex items-center justify-between text-white">

                            <span>
                              {ind.name}
                            </span>

                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#FF6201]" />
                            )}

                          </h4>

                          <p className="text-[10px] text-zinc-400 mt-1 leading-normal">
                            {ind.desc}
                          </p>


                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Platforms */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">
                      Target Platforms
                    </h2>

                    <p className="text-zinc-400 text-xs mt-1">
                      Select where your app will run. Effort calculations adjust for cross-platform support.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3.5 select-none">
                    {PLATFORMS.map((plat) => {
                      const isSelected = formData.platforms.includes(plat.id);
                      return (

                        <button
                          key={plat.id}
                          onClick={() => handleTogglePlatform(plat.id)}
                          className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${isSelected
                            ? "bg-[#FF6201]/10 border-[#FF6201]/50 shadow-md shadow-[#FF6201]/10"
                            : "bg-black/50 border-white/10 hover:border-white/20"
                            }`}
                        >
                          <div>

                            <h4 className="font-extrabold text-xs text-white">
                              {plat.name}
                            </h4>

                            <p className="text-[10px] text-zinc-400 mt-0.5">
                              {plat.desc}
                            </p>

                          </div>

                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isSelected
                              ? "bg-[#FF6201] border-[#FF6201]"
                              : "border-white/20"
                              }`}
                          >

                            {isSelected && (
                              <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                            )}

                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Features */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >

                  <div>
                    <h2 className="text-2xl font-extrabold text-white">
                      Select System Features
                    </h2>

                    <p className="text-zinc-400 text-xs mt-1">
                      Select core specifications. The rule engine calculates effort based on selections.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-75 overflow-y-auto pr-1 select-none">
                    {FEATURES.map((feat) => {
                      const isSelected = formData.features.includes(feat.id);
                      return (

                        <button
                          key={feat.id}
                          onClick={() => handleToggleFeature(feat.id)}
                          className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${isSelected
                            ? "bg-[#FF6201]/10 border-[#FF6201]/50 shadow-md shadow-[#FF6201]/10"
                            : "bg-black/50 border-white/10 hover:border-white/20"
                            }`}
                        >
                          <div className="pr-3">

                            <h4 className="font-extrabold text-[11px] text-white flex items-center space-x-1.5">

                              <span>
                                {feat.name}
                              </span>

                              <span className="text-[9px] bg-white/5 border border-white/10 text-[#FF6201] font-bold px-1.5 py-0.5 rounded">
                                +{feat.hours}h
                              </span>

                            </h4>

                            <p className="text-[10px] text-zinc-400 mt-1 leading-normal">
                              {feat.desc}
                            </p>

                          </div>

                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${isSelected
                              ? "bg-[#FF6201] border-[#FF6201]"
                              : "border-white/20"
                              }`}
                          >

                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-sm bg-white" />
                            )}

                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 5: AI Feature Recommendations */}
              {step === 5 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >

                  <div>

                    <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">

                      <Sparkles className="w-5 h-5 text-[#FF6201] animate-pulse" />

                      AI Feature Recommendations

                    </h2>


                    <p className="text-zinc-400 text-xs mt-1">
                      Our system suggests these custom features based on your industry segment. Review the benefit metrics below.
                    </p>

                  </div>


                  {loadingRecs && (

                    <div className="flex flex-col items-center justify-center py-12 space-y-4">

                      <div className="w-12 h-12 rounded-2xl bg-[#FF6201]/10 border border-[#FF6201]/30 flex items-center justify-center shadow-lg shadow-[#FF6201]/10">

                        <Loader2 className="w-6 h-6 text-[#FF6201] animate-spin" />

                      </div>

                      <p className="text-zinc-400 text-xs">
                        Analyzing requirements for value additions...
                      </p>

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

                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
                          AI Suggestions — Click to Add
                        </p>


                        <div className="grid grid-cols-1 gap-3 max-h-[220px] overflow-y-auto pr-1">

                          {recommendations.map((rec) => {

                            const isAdded = addedRecommendations.find(r => r.id === rec.id);

                            return (

                              <div
                                key={rec.id}
                                className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all group ${isAdded
                                  ? "bg-[#FF6201]/10 border-[#FF6201]/50 shadow-md shadow-[#FF6201]/10"
                                  : "bg-black/50 border-white/10 hover:border-white/20"
                                  }`}
                              >

                                <div className="pr-4 space-y-1">

                                  <div className="flex items-center gap-2 flex-wrap">

                                    <h4 className="font-extrabold text-xs text-white">
                                      {rec.name}
                                    </h4>


                                    <span
                                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${EFFORT_COLORS[rec.effort] || EFFORT_COLORS.Medium
                                        }`}
                                    >
                                      {rec.effort} Effort
                                    </span>

                                  </div>


                                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                                    {rec.desc}
                                  </p>


                                  <p className="text-[9.5px] text-[#FF6201]/90 font-medium leading-relaxed pt-0.5">
                                    💡 <strong>Why:</strong> {RECS_EXPLANATIONS[rec.id.toLowerCase()] || "Accelerates launch velocity and meets standard regulatory integration paths."}
                                  </p>

                                </div>


                                <button
                                  onClick={() => isAdded ? handleRemoveRec(rec.id) : handleAddRec(rec)}
                                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${isAdded
                                    ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                    : "bg-[#FF6201]/20 text-[#FF6201] hover:bg-[#FF6201]/30"
                                    }`}
                                >

                                  {isAdded
                                    ? <X className="w-4 h-4" />
                                    : <Plus className="w-4 h-4" />
                                  }

                                </button>


                              </div>

                            );

                          })}

                        </div>

                      </div>


                      {/* Added scope summaries */}
                      {addedRecommendations.length > 0 && (

                        <div className="space-y-2">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF6201]">
                            ✔ Added to Scope ({addedRecommendations.length})
                          </p>


                          <div className="flex flex-wrap gap-2">

                            {addedRecommendations.map(r => (

                              <span
                                key={r.id}
                                className="flex items-center gap-1.5 text-[10px] bg-[#FF6201]/10 border border-[#FF6201]/30 text-[#FF6201] px-3 py-1.5 rounded-full"
                              >

                                {r.name}

                                <button
                                  onClick={() => handleRemoveRec(r.id)}
                                  className="hover:text-red-400 cursor-pointer"
                                >
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

                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No additional suggestions. Proceed to proposal review.
                    </div>

                  )}

                </motion.div>
              )}

              {/* STEP 6: Review */}
              {step === 6 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >

                  <div>
                    <h2 className="text-2xl font-extrabold text-white">
                      Review Project Profile
                    </h2>

                    <p className="text-zinc-400 text-xs mt-1">
                      Verify scope details before invoking the estimate calculations.
                    </p>
                  </div>


                  <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-4 text-xs max-h-[300px] overflow-y-auto backdrop-blur-sm">

                    {[
                      { label: "Project Name", value: formData.project_name },
                      { label: "Client Partner", value: `${formData.name} (${formData.email})` },
                      { label: "Industry Domain", value: INDUSTRIES.find(i => i.id === formData.industry)?.name || formData.industry },
                      { label: "Target Platforms", value: formData.platforms.map(p => PLATFORMS.find(pl => pl.id === p)?.name || p).join(", ") },
                      { label: "Core Scope Features", value: formData.features.map(f => FEATURES.find(fe => fe.id === f)?.name || f).join(", ") },
                    ].map(({ label, value }) => (

                      <div
                        key={label}
                        className="grid grid-cols-3 gap-2 py-2 border-b border-white/10 last:border-b-0"
                      >

                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                          {label}
                        </span>

                        <span className="col-span-2 text-zinc-200 font-semibold">
                          {value}
                        </span>

                      </div>

                    ))}


                    {addedRecommendations.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 py-2">

                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                          AI Features Added
                        </span>

                        <span className="col-span-2 text-[#FF6201] font-semibold">
                          {addedRecommendations.map(r => r.name).join(", ")}
                        </span>

                      </div>
                    )}

                  </div>


                  <div className="flex items-center gap-3 bg-[#FF6201]/10 border border-[#FF6201]/30 rounded-2xl p-4 text-[11px] text-orange-200">

                    <ShieldCheck className="w-5 h-5 text-[#FF6201] flex-shrink-0" />

                    <span className="leading-relaxed">
                      All metrics are evaluated in compliance with scoping parameters. Project costs are calculated strictly on calculation rules.
                    </span>

                  </div>

                </motion.div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-8">

                <button
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{step === 1 ? "Exit Scoper" : "Back"}</span>
                </button>


                {step < 6 ? (

                  <button
                    onClick={handleNext}
                    disabled={loadingRecs}
                    className="bg-[#FF6201] hover:bg-[#e55800] disabled:opacity-50 text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-[#FF6201]/20"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4 text-white/90" />
                  </button>

                ) : (

                  <button
                    onClick={handleSubmitForm}
                    className="bg-linear-to-r from-[#FF6201] to-[#ff8a3d] hover:from-[#e55800] hover:to-[#ff7a25] text-white text-xs font-bold px-6 py-3.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-[#FF6201]/25 transition-all cursor-pointer"
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

      <footer className="py-4 text-center text-xs text-white/20 pb-6">
        All requirements calculations are evaluated strictly in the local backend Rule Engine instance.
      </footer>
    </div>
  );
}
