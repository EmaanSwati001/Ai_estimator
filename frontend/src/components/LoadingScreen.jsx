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
        const diff = Math.random() * 6 + 2;
        return Math.min(old + diff, 100);
      });
    }, 180);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (progress === 100 && triggerFinished) {
      onFinished();
    }
  }, [progress, triggerFinished, onFinished]);

  return (
    <div className="min-h-screen bg-black/90 text-white flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#FF6201]/30">

      {/* Background Glow */}
      <div className="absolute top-[15%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#FF6201]/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[20%] w-[40%] h-[40%] rounded-full bg-[#FF6201]/5 blur-[140px] pointer-events-none" />


      <div className="max-w-md w-full px-6 space-y-8 z-10 text-center">


        {/* Title */}
        <div className="space-y-2">

          <h3 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-[#FF6201] bg-clip-text text-transparent">
            Scoping Application
          </h3>

          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em]">
            ProjectPilot Proposal Compiler
          </p>

        </div>



        {/* Checklist */}
        <div className="bg-[#111111]/90 border border-white/10 rounded-3xl p-6 text-left space-y-3.5 shadow-2xl shadow-black/50 backdrop-blur-xl">

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
                className="flex items-center gap-3 text-xs"
              >

                {isCompleted ? (

                  <CheckCircle2 className="w-4 h-4 text-[#FF6201] flex-shrink-0" />

                ) : isInProgress ? (

                  <Loader2 className="w-4 h-4 text-[#FF6201] animate-spin flex-shrink-0" />

                ) : (

                  <Circle className="w-4 h-4 text-zinc-700 flex-shrink-0" />

                )}


                <span
                  className={`font-semibold transition-all ${
                    isCompleted
                      ? "text-zinc-500 line-through decoration-zinc-700"
                      : isInProgress
                      ? "text-[#FF6201] font-bold"
                      : "text-zinc-600"
                  }`}
                >
                  {step.text}
                </span>


              </motion.div>

            );
          })}

        </div>



        {/* Progress Bar */}
        <div className="space-y-3 pt-2">

          <div className="w-full bg-white/10 border border-white/10 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">

            <div
              className="h-full bg-gradient-to-r from-[#FF6201] via-[#ff8a3d] to-[#FF6201] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />

          </div>


          <div className="flex justify-between text-[10px] text-zinc-500 font-black uppercase tracking-wider px-1">

            <span>Compiling Data</span>

            <span className="text-[#FF6201]">
              {Math.round(progress)}% Complete
            </span>

          </div>

        </div>


      </div>

    </div>
  );
}