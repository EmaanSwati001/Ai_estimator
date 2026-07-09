import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import Questionnaire from "./components/Questionnaire";
import LoadingScreen from "./components/LoadingScreen";
import Dashboard from "./components/Dashboard";
import { createEstimate } from "./services/api";

export default function App() {
  const [view, setView] = useState("landing");
  const [proposal, setProposal] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmitQuestionnaire = async (formData) => {
    setView("loading");
    setProposal(null);
    setErrorMsg("");

    try {
      const result = await createEstimate(formData);
      setProposal(result);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to contact estimation server. Please verify backend is running on port 8000.");
      setView("questionnaire");
    }
  };

  const handleReset = () => {
    setProposal(null);
    setErrorMsg("");
    setView("landing");
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-indigo-500/30">
      {errorMsg && view === "questionnaire" && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <div className="bg-red-950/90 border border-red-500/40 text-red-300 rounded-xl p-4 shadow-xl text-center text-sm backdrop-blur">
            <p className="font-semibold">Backend Connection Issue</p>
            <p className="text-xs text-red-400 mt-1">{errorMsg}</p>
            <button
              onClick={() => setErrorMsg("")}
              className="mt-2 text-xs text-slate-300 hover:text-white underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {view === "landing" && (
        <LandingPage onStart={() => setView("questionnaire")} />
      )}

      {view === "questionnaire" && (
        <Questionnaire
          onSubmit={handleSubmitQuestionnaire}
          onBackToLanding={() => setView("landing")}
        />
      )}

      {view === "loading" && (
        <LoadingScreen
          onFinished={() => setView("dashboard")}
          triggerFinished={proposal !== null}
        />
      )}

      {view === "dashboard" && proposal && (
        <Dashboard
          proposal={proposal}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
