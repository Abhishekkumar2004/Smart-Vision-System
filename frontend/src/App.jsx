import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  FaUserPlus,
  FaUserCheck,
  FaSmile,
  FaFileAlt,
  FaClipboardList,
  FaHome,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";

import RegisterFace from "./pages/RegisterFace";
import Recognize from "./pages/Recognize";
import Emotion from "./pages/Emotion";
import OCR from "./pages/OCR";
import Attendance from "./pages/Attendance";
import UserERP from "./pages/UserERP";
import ERPAnalytics from "./pages/ERPAnalytics";

/* Inject global styles */
const globalStyles = `
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 6px; }
  ::-webkit-scrollbar-thumb:hover { background: #334155; }

  .loader {
    width: 18px; height: 18px;
    border: 3px solid #00d2ff;
    border-top: 3px solid transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
if (!document.getElementById("global-style-tag")) {
  const tag = document.createElement("style");
  tag.id = "global-style-tag";
  tag.innerHTML = globalStyles;
  document.head.appendChild(tag);
}

/* Greeting box */
function DashboardClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hours = now.getHours();
  const greeting =
    hours < 12 ? "Good Morning ☀️" :
    hours < 18 ? "Good Afternoon 🌤️" :
    "Good Evening 🌙";

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        padding: "14px 26px",
        borderRadius: 14,
        fontSize: 18,
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {greeting} • {now.toLocaleDateString()} • {now.toLocaleTimeString()}
    </div>
  );
}

/* Sidebar menu */
function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 950) setCollapsed(true);
  }, []);

  const menu = [
    { label: "Dashboard", to: "/", icon: <FaHome /> },
    { label: "Register Face", to: "/register", icon: <FaUserPlus /> },
    { label: "Recognize Face", to: "/recognize", icon: <FaUserCheck /> },
    { label: "Emotion Detection", to: "/emotion", icon: <FaSmile /> },
    { label: "Text OCR", to: "/ocr", icon: <FaFileAlt /> },
    { label: "Attendance Timeline", to: "/attendance", icon: <FaClipboardList /> },
    { label: "ERP Users", to: "/erp-users", icon: <FaUsers /> },
    { label: "Analytics Dashboard", to: "/erp-analytics", icon: <FaChartBar /> },
  ];

  return (
    <nav
      style={{
        width: collapsed ? 78 : 250,
        transition: "0.28s",
        padding: "26px 18px",
        background: "rgba(16,24,32,0.82)",
        backdropFilter: "blur(12px)",
        color: "#fff",
        borderRight: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          cursor: "pointer",
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 34,
          userSelect: "none",
        }}
      >
        {collapsed ? "👉" : "Smart Vision"}
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {menu.map((item) => {
          const active = location.pathname === item.to;
          return (
            <li key={item.to} style={{ marginBottom: 8 }}>
              <Link
                to={item.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 14px",
                  borderRadius: 10,
                  textDecoration: "none",
                  color: active ? "#00d2ff" : "#e5e7eb",
                  background: active ? "rgba(0,210,255,0.12)" : "transparent",
                  transition: "0.22s",
                }}
              >
                <span style={{ fontSize: 19 }}>{item.icon}</span>
                {!collapsed && <span style={{ fontSize: 16 }}>{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* Dashboard quick action card */
function QuickAction({ to, icon, label }) {
  return (
    <Link
      to={to}
      style={{
        padding: 22,
        borderRadius: 12,
        background: "rgba(255,255,255,0.06)",
        textAlign: "center",
        textDecoration: "none",
        color: "#e5e7eb",
        fontSize: 18,
        transition: "0.25s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>
      {label}
    </Link>
  );
}

/* MAIN APPLICATION */
function App() {
  const location = useLocation();

  useEffect(() => {
    const titleMap = {
      "/": "Dashboard • Smart Vision",
      "/register": "Register Face",
      "/recognize": "Face Recognition",
      "/emotion": "Emotion Detection",
      "/ocr": "OCR Scanner",
      "/attendance": "Attendance Timeline",
      "/erp-users": "ERP Users",
      "/erp-analytics": "Analytics Dashboard",
    };
    document.title = titleMap[location.pathname] || "Smart Vision Suite";
  }, [location.pathname]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(145deg,#0b1120,#050912 60%)",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: "32px 42px",
          color: "#e5e7eb",
          animation: "fadeIn 0.35s ease",
        }}
      >
        <Routes>
          {/* DASHBOARD */}
          <Route
            path="/"
            element={
              <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 6 }}>
                  Welcome to Smart Vision Suite 👁️‍🧠
                </h1>
                <p style={{ fontSize: 18, opacity: 0.78, marginBottom: 30 }}>
                  AI-powered platform for attendance, recognition, emotion & OCR automation.
                </p>

                <DashboardClock />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                    gap: 20,
                    marginTop: 40,
                  }}
                >
                  <QuickAction to="/register" icon="📌" label="Register Face" />
                  <QuickAction to="/recognize" icon="🔍" label="Recognize Face" />
                  <QuickAction to="/emotion" icon="😊" label="Emotion Detection" />
                  <QuickAction to="/ocr" icon="📄" label="Text OCR" />
                  <QuickAction to="/attendance" icon="🕒" label="Attendance Log" />
                  <QuickAction to="/erp-users" icon="👥" label="ERP Users" />
                  <QuickAction to="/erp-analytics" icon="📊" label="Analytics Dashboard" />
                </div>
              </div>
            }
          />

          {/* PAGES */}
          <Route path="/register" element={<RegisterFace />} />
          <Route path="/recognize" element={<Recognize />} />
          <Route path="/emotion" element={<Emotion />} />
          <Route path="/ocr" element={<OCR />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/erp-users" element={<UserERP />} />
          <Route path="/erp-analytics" element={<ERPAnalytics />} />
        </Routes>
      </main>
    </div>
  );
}

/* Export wrapped in BrowserRouter */
export function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
