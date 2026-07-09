import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_MESSAGES = [
  "Parsing project scope parameters...",
  "Applying industry and platform complexity multipliers...",
  "Running rule-engine hours calculator...",
  "Invoking AI model for executive summary generation...",
  "Assembling customized architecture recommendations...",
  "Compiling professional proposal PDF document...",
  "Finalizing proposal database records..."
];

export default function LoadingScreen({ onFinished, triggerFinished }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Increment progress simulated bar
    const progressInterval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Increment slowly toward 100
        const diff = Math.random() * 8 + 3;
        return Math.min(old + diff, 100);
      });
    }, 200);

    // Rotate status messages every 900ms
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 900);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  // Check if BOTH the progress reached 100% AND the parent database creation response returned
  useEffect(() => {
    if (progress === 100 && triggerFinished) {
      onFinished();
    }
  }, [progress, triggerFinished, onFinished]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[20%] left-[20%] w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[35%] h-[35%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full px-6 text-center space-y-8 z-10">
        {/* Loading Spinner */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full border border-indigo-500/20 animate-ping" />
          <div className="w-16 h-16 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        </div>

        {/* Status Message */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
            Generating Your Proposal
          </h3>
          <p className="text-slate-400 text-xs tracking-wider uppercase font-semibold h-8 flex items-center justify-center">
            {STATUS_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Progress bar container */}
        <div className="space-y-2">
          <div className="w-full bg-slate-900 border border-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1 uppercase tracking-wider">
            <span>Analyzing Scope</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
