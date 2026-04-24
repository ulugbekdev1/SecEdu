import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const PAGE_TITLES = {
  "/":              "Dashboard",
  "/materials":     "Materiallar",
  "/quiz":          "Quiz",
  "/passwor-guide": "Parol Xavfsizligi",
  "/profile":       "Profil",
  "/admin":         "Admin Panel",
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const title = PAGE_TITLES[location.pathname] || "SecureEdu";

  return (
    <div style={S.root}>
      <Sidebar open={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />

      <div style={S.main}>
        {isMobile && (
          <header style={S.header}>
            <button style={S.burger} onClick={() => setSidebarOpen(true)} aria-label="Menu">
              <span style={S.line} />
              <span style={S.line} />
              <span style={S.line} />
            </button>
            <div style={S.headerBrand}>
              <div style={S.headerIcon}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
                </svg>
              </div>
              <span style={S.headerTitle}>{title}</span>
            </div>
          </header>
        )}

        <main className="layout-content" style={S.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const S = {
  root: { display: "flex", minHeight: "100vh", background: "var(--bg)" },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" },
  header: {
    height: "var(--header-h)",
    background: "var(--sidebar-bg)",
    display: "flex", alignItems: "center", gap: "12px",
    padding: "0 16px",
    position: "sticky", top: 0, zIndex: 50,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    flexShrink: 0,
  },
  burger: {
    background: "none", border: "none",
    display: "flex", flexDirection: "column", gap: "5px",
    cursor: "pointer", padding: "6px",
  },
  line: {
    display: "block", width: "20px", height: "2px",
    background: "rgba(255,255,255,0.75)", borderRadius: "2px",
  },
  headerBrand: { display: "flex", alignItems: "center", gap: "8px" },
  headerIcon: {
    width: "28px", height: "28px",
    background: "linear-gradient(135deg,#aa3bff,#7c3aed)",
    borderRadius: "7px",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff",
  },
  headerTitle: { color: "#fff", fontWeight: 700, fontSize: "15px" },
  content: { flex: 1, padding: "28px", overflowY: "auto" },
};
