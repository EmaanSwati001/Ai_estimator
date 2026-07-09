# AI Project Estimator - Frontend Client

This directory contains the React frontend client for the **AI Project Estimator & Proposal Generator** application.

---

## 🛠️ Frontend Tech Stack & Justifications

*   **Vite + React**: Chosen for lightweight scaffolding, fast build times, and high developer efficiency.
*   **Tailwind CSS v4**: Utility-first styles for maximum visual polish (gradients, dark themes, and glassmorphism) with zero runtime bundle overhead.
*   **Framer Motion**: Implements smooth transition animations between form steps, loading screen messages, and dynamic dashboard card effects.
*   **Lucide React**: Vector icons that align with clean SaaS design interfaces.

---

## 📂 Frontend Directory Structure

```text
frontend/
├── src/
│   ├── main.jsx             # React DOM entrypoint
│   ├── index.css            # Tailwind v4 import directives
│   ├── App.jsx              # View controller state manager (landing, form, dashboard)
│   ├── services/
│   │   └── api.js           # API fetches to backend uvicorn endpoints
│   └── components/
│       ├── LandingPage.jsx  # Hero landing page
│       ├── Questionnaire.jsx# Guided 5-step questionnaire
│       ├── LoadingScreen.jsx# Analyst progress feedback
│       └── Dashboard.jsx    # Calculations tables, SVG charts, and PDF download triggers
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Setup & Launch

1.  Navigate into this folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite local development server:
    ```bash
    npm run dev -- --port 5173
    ```
4.  Open your browser to [http://localhost:5173](http://localhost:5173).

*Note: Ensure the backend FastAPI server is also running on port `8000` to allow the questionnaire submission to complete.*
