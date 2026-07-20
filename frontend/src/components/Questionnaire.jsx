import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Layers, ShieldCheck, Sparkles, Plus, X, Loader2, MessageSquare, Compass, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRecommendations, submitChatDiscovery } from "../services/api";

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

// Rich, professional WHY explanations for AI feature recommendations
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
  Small: "text-emerald-400 bg-emerald-950/40 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-950/40 border-amber-500/20",
  Large: "text-red-400 bg-red-950/40 border-red-500/20",
};

export default function Questionnaire({ onSubmit, onBackToLanding }) {
  // Discovery Path: null (choice), 'wizard' (form), 'chat' (conversational)
  const [discoveryPath, setDiscoveryPath] = useState(null);

  // Wizard state variables
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

  // Conversational state variables
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hello! I am ScopePilot AI, your project discovery assistant. Let's design your software. To get started, what is your full name and email address?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatLoading]);

  // Wizard input handlers
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
      setDiscoveryPath(null);
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

  // Conversational Assistant Handlers
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = { role: "user", content: chatInput.trim() };
    const updatedMessages = [...chatMessages, userMessage];
    
    setChatMessages(updatedMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await submitChatDiscovery(updatedMessages);
      
      if (response.finished && response.project_data) {
        setChatMessages(prev => [...prev, { 
          role: "assistant", 
          content: `🎉 Discovery Complete! I have successfully mapped your project '${response.project_data.project_name}'. Generating estimate proposal...` 
        }]);
        
        // Auto submit after a brief visual confirmation delay
        setTimeout(() => {
          onSubmit(response.project_data);
        }, 2000);
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", content: response.question }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I encountered a network problem connecting to the ScopePilot AI discovery server. Please ensure the backend is running locally." 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-x-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[40%] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[40%] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/40 py-4 px-6 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
              ProjectPilot AI
            </span>
          </div>
          {discoveryPath === "wizard" && (
            <div className="flex items-center space-x-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Step {step} of 6</span>
              <div className="w-28 bg-slate-900 border border-slate-800/80 h-2 rounded-full overflow-hidden p-0.5">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(step / 6) * 100}%` }} />
              </div>
            </div>
          )}
          {discoveryPath === "chat" && (
            <div className="flex items-center space-x-2 bg-indigo-950/40 border border-indigo-500/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Discovery Session Active</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        
        {/* CHOICE: Select Path */}
        {discoveryPath === null && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl w-full text-center space-y-8"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 bg-indigo-950/40 border border-indigo-500/20 rounded-full px-4.5 py-1.5 text-xs font-bold text-indigo-300 shadow">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Choose Your Discovery Method</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">How would you like to scope your project?</h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">
                Configure your MVP parameters through our step-by-step wizard, or discuss goals conversationally with our ScopePilot AI Business Analyst.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              
              {/* Wizard Choice Card */}
              <button 
                onClick={() => setDiscoveryPath("wizard")}
                className="p-8 rounded-3xl bg-slate-900/35 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 transition-all text-left flex flex-col justify-between h-[230px] group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shadow-inner">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-lg text-slate-200">Classic Form Wizard</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Select target platforms, industries, and modular scope features step-by-step through guided cards.
                  </p>
                </div>
              </button>

              {/* Chat Choice Card */}
              <button 
                onClick={() => setDiscoveryPath("chat")}
                className="p-8 rounded-3xl bg-slate-900/35 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 transition-all text-left flex flex-col justify-between h-[230px] group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shadow-inner">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-lg text-slate-200">ScopePilot AI Assistant</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Have an interactive chat session with our AI Business Analyst to automatically outline constraints and calculate scope details.
                  </p>
                </div>
              </button>
              
            </div>

            <div className="pt-4">
              <button 
                onClick={onBackToLanding}
                className="text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                &larr; Back to Landing Page
              </button>
            </div>
          </motion.div>
        )}

        {/* PATH A: Guided Form Wizard */}
        {discoveryPath === "wizard" && (
          <div className="max-w-3xl w-full bg-slate-900/40 border border-slate-900 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
            <AnimatePresence mode="wait">
              {validationError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-semibold">
                  ⚠️ &nbsp; {validationError}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="min-h-[380px] flex flex-col justify-between">
              
              {/* STEP 1: Basic Info */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-100">Project Scoping Overview</h2>
                    <p className="text-slate-400 text-xs mt-1">Provide core details so the estimation calculations can align.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { label: "Project Name", name: "project_name", placeholder: "e.g., Apex Health Booking Platform", type: "text", span: false },
                      { label: "Your Full Name", name: "name", placeholder: "Jane Doe", type: "text", span: false },
                      { label: "Email Address", name: "email", placeholder: "jane@example.com", type: "email", span: true },
                    ].map(({ label, name, placeholder, type, span }) => (
                      <div key={name} className={`space-y-2 ${span ? "md:col-span-2" : ""}`}>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
                        <input 
                          type={type} 
                          name={name} 
                          value={formData[name]} 
                          onChange={handleTextChange} 
                          placeholder={placeholder}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-xs transition-all shadow-inner" 
                        />
                      </div>
                    ))}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Brief Application Description</label>
                      <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleTextChange} 
                        rows={4}
                        placeholder="Explain what the app does, its primary objective, and its target audience..."
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-xs transition-all resize-none shadow-inner" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Industry */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-100">Select Business Industry</h2>
                    <p className="text-slate-400 text-xs mt-1">This sets custom compliance standards and risk factors.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[310px] overflow-y-auto pr-1 select-none">
                    {INDUSTRIES.map((ind) => {
                      const isSelected = formData.industry === ind.id;
                      return (
                        <button 
                          key={ind.id} 
                          onClick={() => handleSelectIndustry(ind.id)}
                          className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] cursor-pointer ${isSelected ? "bg-indigo-500/10 border-indigo-500 shadow-md shadow-indigo-500/10" : "bg-slate-950/40 border-slate-850 hover:border-slate-800"}`}
                        >
                          <h4 className="font-extrabold text-xs flex items-center justify-between text-slate-200">
                            <span>{ind.name}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 leading-normal">{ind.desc}</p>
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
                    <h2 className="text-2xl font-extrabold text-slate-100">Target Platforms</h2>
                    <p className="text-slate-400 text-xs mt-1">Select where your app will run. Effort calculations adjust for cross-platform support.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3.5 select-none">
                    {PLATFORMS.map((plat) => {
                      const isSelected = formData.platforms.includes(plat.id);
                      return (
                        <button 
                          key={plat.id} 
                          onClick={() => handleTogglePlatform(plat.id)}
                          className={`p-4.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${isSelected ? "bg-indigo-500/10 border-indigo-500" : "bg-slate-950/40 border-slate-850 hover:border-slate-850"}`}
                        >
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-200">{plat.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{plat.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isSelected ? "bg-indigo-500 border-indigo-500" : "border-slate-700"}`}>
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
                    <h2 className="text-2xl font-extrabold text-slate-100">Select System Features</h2>
                    <p className="text-slate-400 text-xs mt-1">Select core specifications. The rule engine calculates effort based on selections.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 select-none">
                    {FEATURES.map((feat) => {
                      const isSelected = formData.features.includes(feat.id);
                      return (
                        <button 
                          key={feat.id} 
                          onClick={() => handleToggleFeature(feat.id)}
                          className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${isSelected ? "bg-indigo-500/10 border-indigo-500" : "bg-slate-950/40 border-slate-850 hover:border-slate-800"}`}
                        >
                          <div className="pr-3">
                            <h4 className="font-extrabold text-[11px] text-slate-200 flex items-center space-x-1.5">
                              <span>{feat.name}</span>
                              <span className="text-[9px] bg-slate-800 border border-slate-750 text-indigo-300 font-bold px-1.5 py-0.5 rounded">+{feat.hours}h</span>
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 leading-normal">{feat.desc}</p>
                          </div>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${isSelected ? "bg-indigo-500 border-indigo-500" : "border-slate-750"}`}>
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
                    <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-5.5 h-5.5 text-indigo-400 animate-pulse" />
                      AI Feature Recommendations
                    </h2>
                    <p className="text-slate-400 text-xs mt-1">
                      ScopePilot AI suggests these custom features based on your industry segment. Review the benefit metrics below.
                    </p>
                  </div>

                  {loadingRecs && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-950/40 border border-indigo-500/35 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                      </div>
                      <p className="text-slate-400 text-xs">Analyzing requirements for value additions...</p>
                    </div>
                  )}

                  {recsError && !loadingRecs && (
                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-400 text-xs">
                      {recsError}
                    </div>
                  )}

                  {!loadingRecs && recommendations.length > 0 && (
                    <div className="space-y-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">AI Suggestions — Click to Add</p>
                        <div className="grid grid-cols-1 gap-3 max-h-[220px] overflow-y-auto pr-1">
                          {recommendations.map((rec) => {
                            const isAdded = addedRecommendations.find(r => r.id === rec.id);
                            return (
                              <div key={rec.id} 
                                className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all group ${isAdded ? "bg-indigo-500/5 border-indigo-500" : "bg-slate-950/40 border-slate-850"}`}
                              >
                                <div className="pr-4 space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-extrabold text-xs text-slate-200">{rec.name}</h4>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${EFFORT_COLORS[rec.effort] || EFFORT_COLORS.Medium}`}>
                                      {rec.effort} Effort
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-relaxed">{rec.desc}</p>
                                  {/* Explanation WHY */}
                                  <p className="text-[9.5px] text-indigo-300/80 font-medium leading-relaxed pt-0.5">
                                    💡 <strong>Why:</strong> {RECS_EXPLANATIONS[rec.id.toLowerCase()] || "Accelerates launch velocity and meets standard regulatory integration paths."}
                                  </p>
                                </div>
                                <button 
                                  onClick={() => isAdded ? handleRemoveRec(rec.id) : handleAddRec(rec)}
                                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${isAdded ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"}`}
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
                              <span key={r.id} className="flex items-center gap-1.5 text-[10px] bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full">
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
                    <div className="text-center py-8 text-slate-500 text-xs">No additional suggestions. Proceed to proposal review.</div>
                  )}
                </motion.div>
              )}

              {/* STEP 6: Review */}
              {step === 6 && (
                <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-100">Review Project Profile</h2>
                    <p className="text-slate-400 text-xs mt-1">Verify scope details before invoking the estimate calculations.</p>
                  </div>
                  
                  <div className="bg-slate-950/50 border border-slate-900 rounded-2xl p-5 space-y-4 text-xs max-h-[300px] overflow-y-auto">
                    {[
                      { label: "Project Name", value: formData.project_name },
                      { label: "Client Partner", value: `${formData.name} (${formData.email})` },
                      { label: "Industry Domain", value: INDUSTRIES.find(i => i.id === formData.industry)?.name || formData.industry },
                      { label: "Target Platforms", value: formData.platforms.map(p => PLATFORMS.find(pl => pl.id === p)?.name || p).join(", ") },
                      { label: "Core Scope Features", value: formData.features.map(f => FEATURES.find(fe => fe.id === f)?.name || f).join(", ") },
                    ].map(({ label, value }) => (
                      <div key={label} className="grid grid-cols-3 gap-2 py-2 border-b border-slate-900/60 last:border-b-0">
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{label}</span>
                        <span className="col-span-2 text-slate-350 font-semibold">{value}</span>
                      </div>
                    ))}
                    {addedRecommendations.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 py-2">
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">AI Features Added</span>
                        <span className="col-span-2 text-indigo-300 font-semibold">{addedRecommendations.map(r => r.name).join(", ")}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4 text-[11px] text-indigo-300">
                    <ShieldCheck className="w-5.5 h-5.5 text-indigo-400 flex-shrink-0" />
                    <span className="leading-relaxed">All metrics are evaluated in compliance with scoping parameters. Project costs are calculated strictly on calculation rules.</span>
                  </div>
                </motion.div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t border-slate-900/80 pt-6 mt-8">
                <button 
                  onClick={handlePrev} 
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-450 hover:text-slate-200 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{step === 1 ? "Exit Scoper" : "Back"}</span>
                </button>
                {step < 6 ? (
                  <button 
                    onClick={handleNext} 
                    disabled={loadingRecs}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-850 disabled:opacity-50 text-slate-200 text-xs font-bold px-5 py-3 rounded-xl flex items-center space-x-1 transition-all cursor-pointer shadow-inner"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmitForm}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-xs font-bold px-6 py-3.5 rounded-xl flex items-center space-x-1.5 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
                  >
                    <span>Compile Proposal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* PATH B: Conversational ScopePilot AI Chat */}
        {discoveryPath === "chat" && (
          <div className="max-w-2xl w-full bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-md shadow-2xl flex flex-col h-[520px]">
            
            {/* Chat Panel Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <Sparkles className="w-5.5 h-5.5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-200">ScopePilot AI</h3>
                  <p className="text-[10px] text-slate-500">AI Business Analyst & Scoping Specialist</p>
                </div>
              </div>
              <button 
                onClick={() => setDiscoveryPath(null)}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-350 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Exit Chat
              </button>
            </div>

            {/* Chat History Panel */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
              {chatMessages.map((msg, idx) => {
                const isAssistant = msg.role === "assistant";
                return (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}
                  >
                    {isAssistant && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mt-1 flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div 
                      className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${isAssistant ? "bg-slate-950/60 border border-slate-900 text-slate-300" : "bg-gradient-to-tr from-indigo-650 to-purple-650 text-white font-medium shadow-md shadow-indigo-500/5"}`}
                    >
                      {msg.content}
                    </div>
                    {!isAssistant && (
                      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 mt-1 flex-shrink-0 border border-slate-750">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
              {chatLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mt-1 flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="bg-slate-950/60 border border-slate-900 p-3.5 rounded-2xl flex items-center space-x-2">
                    <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ScopePilot is analyzing...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChatMessage} className="flex gap-2">
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your response here..."
                disabled={chatLoading}
                className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 text-slate-200 transition-colors shadow-inner" 
              />
              <button 
                type="submit" 
                disabled={chatLoading || !chatInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow shadow-indigo-500/15 cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            
          </div>
        )}
      </main>

      <footer className="py-4 text-center text-[10px] text-slate-650">
        All requirements calculations are evaluated strictly in the local backend Rule Engine instance.
      </footer>
    </div>
  );
}
