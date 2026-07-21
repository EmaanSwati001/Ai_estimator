import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";

const LOADING_STEPS = [
  { id: 0, text: "Understanding Requirements", minPct: 0 },
  { id: 1, text: "Analyzing Scope Constraints", minPct: 10 },
  { id: 2, text: "Running Local Rule Engine", minPct: 20 },
  { id: 3, text: "Calculating Development Budget", minPct: 30 },
  { id: 4, text: "Estimating Timeline & Roadmap", minPct: 40 },
  { id: 5, text: "Building Decoupled Architecture", minPct: 50 },
  { id: 6, text: "Preparing Agile Sprint Plan", minPct: 60 },
  { id: 7, text: "Writing Executive Summary", minPct: 70 },
  { id: 8, text: "Generating Proposal PDF Report", minPct: 80 },
  { id: 9, text: "Finalizing Client Dashboard", minPct: 90 },
];

export default function LoadingScreen({ onFinished, triggerFinished }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Increment progress dynamically
        const diff = Math.random() * 6 + 2;
        return Math.min(old + diff, 100);
      });
    }, 180);

    return () => clearInterval(progressInterval);
  }, []);

  // Finish immediately once progress hits 100% AND the proposal api has successfully returned
  useEffect(() => {
    if (progress === 100 && triggerFinished) {
      onFinished();
    }
  }, [progress, triggerFinished, onFinished]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none" />

      <div className="max-w-md w-full px-6 space-y-8 z-10 text-center">
        
        {/* Title */}
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-200 via-purple-250 to-pink-200 bg-clip-text text-transparent">
            Scoping Application
          </h3>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            ProjectPilot Proposal Compiler
          </p>
        </div>

        {/* Real-time Checklist */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 text-left space-y-3.5 shadow-2xl backdrop-blur-sm">
          {LOADING_STEPS.map((step) => {
            const isCompleted = progress >= (step.minPct + 10);
            const isInProgress = progress >= step.minPct && progress < (step.minPct + 10);
            
            return (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: isCompleted ? 1 : isInProgress ? 1 : 0.35,
                  x: isInProgress ? 4 : 0
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-3 text-xs"
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isInProgress ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-800 flex-shrink-0" />
                )}
                
                <span className={`font-semibold transition-all ${isCompleted ? "text-slate-350 line-through decoration-slate-800" : isInProgress ? "text-indigo-300 font-bold" : "text-slate-500"}`}>
                  {step.text}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Progressive Loading Bar */}
        <div className="space-y-3 pt-2">
          <div className="w-full bg-slate-900 border border-slate-850 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase tracking-wider px-1">
            <span>Compiling Data</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

      </div>
    </div>
  );
}
