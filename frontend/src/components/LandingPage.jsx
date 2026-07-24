import React, { useState } from "react";
import { ArrowRight, Sparkles, Shield, DollarSign, Clock, Layers, MessageSquare, Star, HelpCircle, ChevronDown, CheckCircle, ArrowUpRight, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTwitter, FaLinkedin, FaGithub, FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { UserPlus, Search, SlidersHorizontal } from "lucide-react";

export default function LandingPage({ onStart, onAdminClick }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const FAQS = [
    {
      q: "How does the AI engine calculate project development costs?",
      a: "Our estimation engine combines a structured rule-based calculation system with AI-generated insights to determine realistic development costs. It analyzes project modules, required features, technical complexity, platform requirements, industry-specific compliance needs, and estimated developer hours. Each calculation follows predefined effort standards and pricing factors to generate a transparent cost breakdown, while AI helps create detailed explanations and professional proposal summaries."
    },
    {
      q: "Can I download a complete project proposal as a PDF?",
      a: "Yes. After completing the project questionnaire, the system automatically compiles your requirements into a complete proposal document. The generated PDF includes project objectives, feature scope, recommended technology stack, development timeline, estimated milestones, sprint planning, technical considerations, risks, and a detailed cost estimation breakdown that can be shared directly with clients or stakeholders."
    },
    {
      q: "How quickly can I generate a project estimate and proposal?",
      a: "The guided estimation process is designed to be completed within a few minutes. After submitting your project details, the estimation engine processes your requirements, calculates development effort, applies relevant industry factors, and generates a complete proposal dashboard instantly. You can review, customize, and download the final report without waiting for manual preparation."
    },
    {
      q: "How accurate are the generated estimates and recommendations?",
      a: "The recommendations are created using structured estimation rules combined with AI analysis of your project requirements. The system considers your industry, requested features, platforms, complexity level, security requirements, and technical dependencies to provide realistic guidance. These estimates help with planning and decision-making while allowing you complete control to adjust requirements or modify recommendations."
    },
    {
      q: "Can I customize the generated proposal?",
      a: "Yes. The generated proposal acts as a strong foundation that you can review and customize based on your project's needs. You can modify requirements, adjust features, update project details, and refine the final presentation before sharing it with clients, investors, or internal teams."
    },
    {
      q: "Does it support different industries and applications?",
      a: "Yes. The platform supports multiple industries and project categories by applying relevant complexity factors and requirements. Whether you are building a healthcare platform, financial application, e-commerce system, SaaS product, mobile application, or enterprise solution, the estimation engine adapts the calculation process accordingly."
    }
  ];

  const TestimonialCard = ({ text, author, role }) => (
    <div className="w-85 shrink-0 bg-zinc-900/60 border border-white/10 rounded-3xl p-6 shadow-xl hover:border-[#FF6201]/30 transition-all duration-300">
      <p className="text-sm leading-relaxed text-zinc-300">"{text}"</p>

      <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
        <div className="w-10 h-10 rounded-full bg-[#FF6201]/15 border border-[#FF6201]/30 flex items-center justify-center text-[#FF6201] font-bold text-sm">
          {author[0]}
        </div>

        <div>
          <h5 className="text-sm font-semibold text-white">{author}</h5>
          <p className="text-xs text-zinc-400">{role}</p>
        </div>
      </div>
    </div>
  );
  const steps = [
    {
      step: 1,
      title: "Discovery Interaction",
      desc: "Use our guided form to quickly select target platforms, business industry, and custom project features.",
      icon: UserPlus,
      badgeBg: "bg-[#FF6201]",
      badgeText: "text-black",
      iconColor: "text-[#FF6201]"
    },
    {
      step: 2,
      title: "Compile Parameters",
      desc: "Our engine applies industry complexity factors and feature rules to calculate hours, costs, and timeline estimates.",
      icon: Search,
      badgeBg: "bg-[#FF6201]",
      badgeText: "text-black",
      iconColor: "text-[#FF6201]"
    },
    {
      step: 3,
      title: "Review & Proposal",
      desc: "Review the generated proposal, explore technology recommendations, inspect roadmaps, and download the client-ready PDF.",
      icon: SlidersHorizontal,
      badgeBg: "bg-[#FF6201]",
      badgeText: "text-black",
      iconColor: "text-[#FF6201]"
    }
  ];

  return (
    <div className="relative min-h-screen bg-black/95 text-zinc-100 font-sans overflow-x-hidden flex flex-col justify-between selection:bg-[#FF6201]/30 selection:text-white antialiased">

      {/* Background Subtle Mesh Grid & Radial Glows */}
      <div className="absolute top-0 left-0 w-full h-200 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" /> {/* Primary Brand Glows (#FF6201) */}

      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(255,98,1,0.15),transparent_70%)] pointer-events-none blur-2xl" />
      <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,98,1,0.06),transparent_70%)] pointer-events-none blur-3xl" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,98,1,0.05),transparent_70%)] pointer-events-none blur-3xl" />

      {/* Header */}
      <header className="fixed w-full top-0 z-50 border-b border-white/8 bg-white/15 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6201] to-[#d64f00] flex items-center justify-center shadow-lg shadow-[#FF6201]/25 border border-white/20">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                ProjectPilot <span className="text-[#FF6201] font-semibold text-xs px-1.5 py-0.5 rounded-md bg-[#FF6201]/10 border border-[#FF6201]/20">AI</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase hidden sm:block">Enterprise Discovery</span>
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-white/20 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span>Admin Panel</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-20 w-full z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-left space-y-6 w-full"
          >
            {/* Tagline Pill */}
            <div className="inline-flex items-center space-x-2 bg-[#FF6201]/10 border border-[#FF6201]/25 rounded-full px-3.5 py-1 text-xs font-medium text-[#FF6201] shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6201] animate-pulse" />
              <span className="tracking-wide">AI-Driven Estimation & Discovery Engine</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
              Automate your client <br />
              <span className="bg-linear-to-r from-white via-zinc-200 to-[#FF6201] bg-clip-text text-transparent">
                discovery phase.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
              Replace manual requirements gathering. Intelligently structure application scopes, calculate costs through a robust rule engine, outline roadmaps, and generate professional PDF proposals instantly.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                className="group relative inline-flex items-center justify-center space-x-2 bg-[#FF6201] hover:bg-[#e55800] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-[#FF6201]/25 transition-all cursor-pointer border border-white/20"
              >
                <span>Launch Discovery Engine</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white/90" />
              </motion.button>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center bg-zinc-900/80 hover:bg-zinc-800/90 border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white font-semibold text-sm px-5 py-3.5 rounded-xl transition-all shadow-sm"
              >
                See How It Works
              </a>
            </div>
          </motion.div>

          {/* Hero Right Visual Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 1, 1] }}
            className="flex items-center justify-center lg:justify-end w-full"
          >
            <div className="relative w-full max-w-120 min-h-80 sm:min-h-92.5 bg-zinc-900/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/80 flex flex-col justify-between overflow-hidden text-zinc-100 backdrop-blur-md">
              {/* Ambient inner card glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6201]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Embedded illustration grid lines */}
              <div className="absolute inset-0 pointer-events-none opacity-15">
                <svg width="100%" height="100%">
                  <line x1="20%" y1="20%" x2="80%" y2="20%" stroke="#FF6201" strokeWidth="1.5" strokeDasharray="4,4" />
                  <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="#ffffff" strokeWidth="1" />
                  <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="#FF6201" strokeWidth="1.5" />
                  <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#ffffff" strokeWidth="1" />
                </svg>
              </div>

              {/* Top Node */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-2 bg-zinc-950/90 border border-white/10 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-[#FF6201] animate-ping" />
                  <span className="text-[11px] text-zinc-400 font-mono">Input: Web + Healthcare</span>
                </div>
                <div className="p-1.5 rounded-lg bg-zinc-800/60 border border-white/5">
                  <Layers className="w-4 h-4 text-[#FF6201]" />
                </div>
              </div>

              {/* Floating visual block */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="bg-zinc-950/90 border border-[#FF6201]/30 p-4 rounded-xl z-10 shadow-xl text-left backdrop-blur-md"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF6201]" />
                  <span className="text-xs font-semibold text-zinc-100">Engine Rule Calculation</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
                  "HIPAA Compliance multiplier applied (1.25x). Feature hours totaled & validated."
                </p>
              </motion.div>

              {/* Inferred Node list */}
              <div className="flex justify-between items-center z-10 text-[10px] text-zinc-300 font-mono gap-1.5">
                <div className="bg-zinc-950/90 border border-white/10 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#FF6201]" />
                  <span>Web + Mobile</span>
                </div>
                <div className="bg-zinc-950/90 border border-white/10 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#FF6201]" />
                  <span>Stripe Billing</span>
                </div>
                <div className="bg-[#FF6201]/10 border border-[#FF6201]/30 text-[#FF6201] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6201] animate-pulse" />
                  <span>Est: 240 Hours</span>
                </div>
              </div>

            </div>
          </motion.div>

          <div className="lg:col-span-2 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-1 border-b border-white/20">

            <p className="text-[11px] sm:text-xs uppercase font-semibold text-zinc-500 tracking-[0.2em] text-center md:text-left whitespace-nowrap">
              Trusted by agencies and teams at
            </p>


            <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-6 sm:gap-x-10 gap-y-4 opacity-60 hover:opacity-90 transition-opacity duration-300">

              {[
                "Vercel",
                "Notion",
                "Stripe",
                "Linear",
                "Retool",
                "Supabase"
              ].map((brand) => (
                <span
                  key={brand}
                  className="text-xs sm:text-sm md:text-base font-semibold text-zinc-300 tracking-tight"
                >
                  {brand.toUpperCase()}
                </span>
              ))}

            </div>

          </div>

        </div>

      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full z-10">

        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-[#FF6201] tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#FF6201]/10 border border-[#FF6201]/20">
            Features Suite
          </span>

          <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Intelligent Scoping, Built in Real-Time
          </h2>

          <p className="mt-3 text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Everything you need to estimate software projects, calculate costs, and generate professional proposals instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Discovery */}
          <div className="lg:col-span-2 bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 text-left hover:border-[#FF6201]/30 transition-all duration-300">

            <div className="flex items-start justify-between gap-4">

              {/* Top Left Icon */}
              <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#FF6201]/10 border border-[#FF6201]/20 flex items-center justify-center text-[#FF6201]">
                <MessageSquare className="w-5 h-5" />
              </div>


              {/* Top Right Tags */}
              <div className="flex flex-wrap justify-end gap-2">
                {["Web", "Mobile", "SaaS", "Enterprise"].map(item => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-xl text-xs bg-white/5 border border-white/10 text-zinc-300"
                  >
                    {item}
                  </span>
                ))}
              </div>

            </div>

            <h3 className="mt-6 text-xl font-bold text-white">
              Guided Scoping Engine
            </h3>

            <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-2xl">
              Collect project requirements through an intelligent guided workflow. Select platforms, industries, features, and technical requirements with a structured discovery process.
            </p>
          </div>

          {/* Calculation */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 text-left hover:border-[#FF6201]/30 transition-all">

            <div className="w-11 h-11 rounded-2xl bg-[#FF6201]/10 border border-[#FF6201]/20 flex items-center justify-center text-[#FF6201]">
              <DollarSign className="w-5 h-5" />
            </div>


            <h3 className="mt-6 font-bold text-white text-lg">
              Rule-Based Cost Engine
            </h3>


            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Calculate development hours, pricing, and timelines using structured rules instead of unreliable guesses.
            </p>

          </div>

          {/* AI Recommendation */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 text-left hover:border-[#FF6201]/30 transition-all">

            <div className="w-11 h-11 rounded-2xl bg-[#FF6201]/10 border border-[#FF6201]/20 flex items-center justify-center text-[#FF6201]">
              <Sparkles className="w-5 h-5" />
            </div>


            <h3 className="mt-6 font-bold text-white text-lg">
              AI Project Insights
            </h3>


            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Get intelligent recommendations based on industry, features, complexity, and technical requirements.
            </p>

          </div>

          {/* Proposal */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#151515] to-[#0d0d0d] border border-white/10 rounded-3xl p-6 sm:p-8 text-left hover:border-[#FF6201]/30 transition-all">


            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div>
                <h3 className="text-xl font-bold text-white">
                  Professional Proposal Generator
                </h3>

                <p className="mt-2 text-sm text-zinc-400 max-w-md">
                  Convert estimates into client-ready PDF proposals with scope, roadmap, architecture, milestones, and risks.
                </p>
              </div>


              <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#FF6201] flex items-center justify-center">
                <FileText className="w-6 h-6 text-black" />
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">

              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs text-zinc-500">
                  Timeline
                </p>
                <p className="mt-1 font-bold text-white">
                  Auto Generated
                </p>
              </div>


              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs text-zinc-500">
                  Document
                </p>
                <p className="mt-1 font-bold text-white">
                  PDF Export
                </p>
              </div>


              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs text-zinc-500">
                  Planning
                </p>
                <p className="mt-1 font-bold text-[#FF6201]">
                  Sprint Ready
                </p>
              </div>

            </div>


          </div>

        </div>

      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-b border-white/8 py-24 w-full z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Section Header */}
          <div className="space-y-3 mb-20">
            <span className="text-xs font-semibold text-[#FF6201] tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#FF6201]/10 border border-[#FF6201]/20">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight pt-2">
              Three Steps to Scope Finalization
            </h2>
          </div>

          {/* Steps Container with Connecting Line */}
          <div className="relative max-w-7xl mx-auto">
            {/* Horizontal Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px] bg-white/10 -z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {steps.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center group">
                    {/* Icon Box Container */}
                    <div className="relative mb-8">
                      {/* Rounded Icon Card */}
                      <div className="w-20 h-20 rounded-4xl bg-zinc-900/80 border border-white/10 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:border-white/20">
                        <IconComponent className={`w-8 h-8 ${item.iconColor}`} />
                      </div>

                      {/* Step Badge */}
                      <div
                        className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full ${item.badgeBg} ${item.badgeText} text-xs font-bold flex items-center justify-center shadow-md`}
                      >
                        {item.step}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h4 className="font-bold text-white text-lg mb-3">{item.title}</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-zinc-950/40 w-full py-2 text-center z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto p-8">
          {[
            { n: "5 Min", label: "Average Scope Time" },
            { n: "100%", label: "Consistent Pricing" },
            { n: "98%", label: "Report Accuracy" },
            { n: "12k+", label: "Generated Proposals" }
          ].map((stat, i) => (
            <div key={i} className="space-y-1.5">
              <h2 className="text-3xl sm:text-4xl font-black text-[#FF6201] tracking-tight">
                {stat.n}
              </h2>
              <p className="text-[11px] uppercase font-semibold text-zinc-400 tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-b border-white/8 bg-zinc-950/30 py-24 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-[#FF6201] tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#FF6201]/10 border border-[#FF6201]/20">
              Social Proof
            </span>

            <h2 className="mt-5 text-4xl sm:text-5xl font-bold text-white tracking-tight">
              What Product Teams Say
            </h2>
          </div>


          {[
            {
              text: "ProjectPilot AI transformed our discovery process. What used to take days now takes minutes with accurate estimates and professional proposals.",
              author: "Sarah Jenkins",
              role: "VP of Product, DevLab"
            },
            {
              text: "The estimation workflow is simple and powerful. Our team understands scope, timeline, and budget before development starts.",
              author: "Alex Rivera",
              role: "Founder, Zenith SaaS"
            },
            {
              text: "The generated proposals look enterprise-ready with architecture, risks, milestones, and technical planning.",
              author: "David Vance",
              role: "Delivery Director, CloudEngine"
            },
            {
              text: "We reduced proposal preparation time by more than 80%. The AI recommendations improve every discovery call.",
              author: "Emily Carter",
              role: "Product Manager, NovaLabs"
            },
            {
              text: "Our developers spend less time estimating and more time building. Planning is now much more consistent.",
              author: "Daniel Brooks",
              role: "Engineering Manager"
            },
            {
              text: "The platform gives our enterprise clients confidence with clear roadmaps and realistic expectations.",
              author: "Olivia Parker",
              role: "Project Director"
            }
          ].map((_, i) => null)}


          {/* Top Row */}
          <div className="relative flex overflow-hidden mb-6">
            <div className="flex gap-6 animate-marquee">

              {[...Array(2)].flatMap(() => [
                {
                  text: "ProjectPilot AI transformed our discovery process. What used to take days now takes minutes with accurate estimates.",
                  author: "Sarah Jenkins",
                  role: "VP of Product, DevLab"
                },
                {
                  text: "The estimation workflow is simple and powerful. Our team understands scope and budget faster.",
                  author: "Alex Rivera",
                  role: "Founder, Zenith SaaS"
                },
                {
                  text: "The generated proposals look enterprise-ready with architecture, risks, and milestones.",
                  author: "David Vance",
                  role: "Delivery Director, CloudEngine"
                }
              ]).map((t, i) => (
                <TestimonialCard key={i} {...t} />
              ))}

            </div>
          </div>


          {/* Bottom Row */}
          <div className="relative flex overflow-hidden">
            <div className="flex gap-6 animate-marquee-reverse">

              {[...Array(2)].flatMap(() => [
                {
                  text: "We reduced proposal preparation time by more than 80% with AI-assisted planning.",
                  author: "Emily Carter",
                  role: "Product Manager, NovaLabs"
                },
                {
                  text: "Our developers spend less time estimating and more time building.",
                  author: "Daniel Brooks",
                  role: "Engineering Manager"
                },
                {
                  text: "The platform gives enterprise clients confidence with clear roadmaps.",
                  author: "Olivia Parker",
                  role: "Project Director"
                }
              ]).map((t, i) => (
                <TestimonialCard key={i} {...t} />
              ))}

            </div>
          </div>

        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-16 items-start">

          {/* Left Heading */}
          <div className="h-full flex flex-col justify-center">
            <span className="text-xs font-semibold text-[#FF6201] tracking-wider uppercase">
              Support
            </span>

            <h2 className="mt-6 text-5xl md:text-6xl font-bold text-white tracking-tight leading-[0.95] max-w-md">
              Frequently
              <br />
              asked
              <br />
              questions
            </h2>
          </div>


          {/* FAQ List */}
          <div className="w-full divide-y divide-white/10">

            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;

              return (
                <div key={i} className="group">

                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full py-6 flex items-center gap-5 text-left cursor-pointer"
                  >

                    {/* Plus Icon */}
                    <span
                      className={`text-2xl font-light transition-colors duration-300 ${isOpen ? "text-[#FF6201]" : "text-blue-500"
                        }`}
                    >
                      +
                    </span>

                    <span
                      className={`text-lg font-medium transition-colors duration-300 ${isOpen ? "text-white" : "text-zinc-200"
                        }`}
                    >
                      {faq.q}
                    </span>

                  </button>


                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pl-10 text-sm text-zinc-400 leading-relaxed max-w-3xl">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 bg-[#050505] py-16 w-full z-10 text-xs text-zinc-400">

        <div className="max-w-7xl mx-auto px-6">

          {/* Logo */}
          <div className="flex justify-center items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Layers className="w-4 h-4 text-black" />
            </div>

            <span className="font-semibold text-sm text-white">
              ProjectPilot AI
            </span>
          </div>


          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-7 gap-y-3 mb-10 text-sm text-zinc-300">
            <a href="#" className="hover:text-white transition-colors">
              Products
            </a>

            <a href="#" className="hover:text-white transition-colors">
              Studio
            </a>

            <a href="#" className="hover:text-white transition-colors">
              Clients
            </a>

            <a href="#" className="hover:text-white transition-colors">
              Pricing
            </a>

            <a href="#" className="hover:text-white transition-colors">
              Blog
            </a>

            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>

            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </nav>


          {/* Divider */}
          <div className="border-t border-white/8" />


          {/* Bottom Row */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8">

            <span className="text-zinc-400">
              © {new Date().getFullYear()} ProjectPilot AI Platform
            </span>


            {/* Social Icons */}
            <div className="flex items-center gap-6 text-zinc-400">

              <a href="#" className="hover:text-white transition-colors">
                <FaXTwitter className="w-5 h-5" />
              </a>

              <a href="#" className="hover:text-white transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>

              <a href="#" className="hover:text-white transition-colors">
                <FaGithub className="w-5 h-5" />
              </a>

              <a href="#" className="hover:text-white transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>

              <a href="#" className="hover:text-white transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}