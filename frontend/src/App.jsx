import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import Questionnaire from "./components/Questionnaire";
import LoadingScreen from "./components/LoadingScreen";
import Dashboard from "./components/Dashboard";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import { createEstimate } from "./services/api";

export default function App() {
  const [view, setView] = useState("landing");
  const [proposal, setProposal] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [adminAuthed, setAdminAuthed] = useState(false);

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
    <div className="bg-slate-50 min-h-screen text-slate-900 selection:bg-emerald-500/30">
      {/* Backend Error Toast */}
      {errorMsg && view === "questionnaire" && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 shadow-xl text-center text-sm backdrop-blur">
            <p className="font-semibold">Backend Connection Issue</p>
            <p className="text-xs text-red-600 mt-1">{errorMsg}</p>
            <button onClick={() => setErrorMsg("")}
              className="mt-2 text-xs text-red-700 hover:text-red-900 underline cursor-pointer font-medium">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Landing Page */}
      {view === "landing" && (
        <LandingPage
          onStart={() => setView("questionnaire")}
          onAdminClick={() => setView("admin_login")}
        />
      )}

      {/* Questionnaire */}
      {view === "questionnaire" && (
        <Questionnaire
          onSubmit={handleSubmitQuestionnaire}
          onBackToLanding={() => setView("landing")}
        />
      )}

      {/* Loading/Processing Screen */}
      {view === "loading" && (
        <LoadingScreen
          onFinished={() => setView("dashboard")}
          triggerFinished={proposal !== null}
        />
      )}

      {/* Proposal Dashboard */}
      {view === "dashboard" && proposal && (
        <Dashboard
          proposal={proposal}
          onReset={handleReset}
        />
      )}

      {/* Admin Login */}
      {view === "admin_login" && (
        <AdminLogin
          onLogin={() => {
            setAdminAuthed(true);
            setView("admin_dashboard");
          }}
        />
      )}

      {/* Admin Dashboard */}
      {view === "admin_dashboard" && adminAuthed && (
        <AdminDashboard
          onLogout={() => {
            setAdminAuthed(false);
            setView("landing");
          }}
        />
      )}
    </div>
  );
}
