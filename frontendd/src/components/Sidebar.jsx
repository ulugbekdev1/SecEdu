import { NavLink, useNavigate } from "react-router-dom";

const NAV = [
  { to: "/",              icon: DashIcon,  label: "Dashboard"           },
  { to: "/materials",     icon: PlayIcon,  label: "Materiallar"         },
  { to: "/quiz",          icon: QuizIcon,  label: "Quiz"                },
  { to: "/passwor-guide", icon: LockIcon,  label: "Parol Xavfsizligi"  },
  { to: "/profile",       icon: UserIcon,  label: "Profil"              },
];

export default function Sidebar({ open, isMobile, onClose }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "Foydalanuvchi";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sidebarStyle = {
    ...S.sidebar,
    ...(isMobile ? S.sidebarMobile : {}),
    ...(isMobile && open ? S.sidebarMobileOpen : {}),
  };

  return (
    <>
      {isMobile && open && (
        <div style={S.overlay} onClick={onClose} />
      )}

      <aside style={sidebarStyle}>
        {/* Logo */}
        <div style={S.logo}>
          <div style={S.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
            </svg>
          </div>
          <div style={S.logoText}>
            <div style={S.logoTitle}>SecureEdu</div>
            <div style={S.logoSub}>Kiberhavfsizlik</div>
          </div>
          {isMobile && (
            <button style={S.closeBtn} onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        <div style={S.divider} />
        <div style={S.navLabel}>ASOSIY MENYU</div>

        {/* Nav */}
        <nav style={S.nav}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={isMobile ? onClose : undefined}
              style={({ isActive }) => ({
                ...S.link,
                ...(isActive ? S.linkActive : {}),
              })}
            >
              <span style={S.linkIcon}><Icon /></span>
              {label}
            </NavLink>
          ))}

          {role === "admin" && (
            <NavLink
              to="/admin"
              onClick={isMobile ? onClose : undefined}
              style={({ isActive }) => ({ ...S.link, ...(isActive ? S.linkActive : {}) })}
            >
              <span style={S.linkIcon}><AdminIcon /></span>
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* User bottom */}
        <div style={S.bottom}>
          <div style={S.divider} />
          <div style={S.userRow}>
            <div style={S.avatar}>{username[0]?.toUpperCase() || "U"}</div>
            <div style={S.userInfo}>
              <div style={S.userName}>{username}</div>
              <div style={S.userRole}>{role || "employee"}</div>
            </div>
            <button style={S.logoutBtn} onClick={handleLogout} title="Chiqish">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ── Icons ── */
function DashIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>;
}
function PlayIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>;
}
function QuizIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>;
}
function LockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>;
}
function UserIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>;
}
function AdminIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
  </svg>;
}

const S = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 99,
    backdropFilter: "blur(3px)",
  },
  sidebar: {
    width: "var(--sidebar-w)",
    background: "var(--sidebar-bg)",
    display: "flex", flexDirection: "column",
    position: "sticky", top: 0,
    height: "100vh",
    flexShrink: 0,
    zIndex: 100,
    overflowY: "auto",
  },
  sidebarMobile: {
    position: "fixed",
    left: 0, top: 0,
    height: "100vh",
    transform: "translateX(-100%)",
    transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
  },
  sidebarMobileOpen: {
    transform: "translateX(0)",
  },

  logo: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "20px 18px 16px",
  },
  logoIcon: {
    width: "38px", height: "38px",
    background: "linear-gradient(135deg, #aa3bff, #7c3aed)",
    borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", flexShrink: 0,
    boxShadow: "0 4px 14px rgba(170,59,255,0.45)",
  },
  logoText: { flex: 1 },
  logoTitle: { color: "#fff", fontWeight: 700, fontSize: "14px", lineHeight: 1.2 },
  logoSub:   { color: "rgba(255,255,255,0.38)", fontSize: "10px", marginTop: "2px" },
  closeBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "none", color: "rgba(255,255,255,0.6)",
    borderRadius: "7px", padding: "6px",
    cursor: "pointer", display: "flex",
    marginLeft: "auto",
  },

  divider: { height: "1px", background: "rgba(255,255,255,0.07)", margin: "0 18px" },
  navLabel: {
    padding: "14px 18px 8px",
    fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em",
    color: "rgba(255,255,255,0.28)", textTransform: "uppercase",
  },
  nav: { display: "flex", flexDirection: "column", gap: "2px", padding: "0 10px" },
  link: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 12px",
    color: "rgba(255,255,255,0.55)",
    textDecoration: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: "13.5px", fontWeight: 500,
    transition: "background 0.15s, color 0.15s",
  },
  linkActive: {
    background: "rgba(170,59,255,0.22)",
    color: "#fff",
    boxShadow: "inset 3px 0 0 #aa3bff",
  },
  linkIcon: { display: "flex", flexShrink: 0, opacity: 0.9 },

  bottom: { marginTop: "auto" },
  userRow: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "14px 18px 20px",
  },
  avatar: {
    width: "34px", height: "34px",
    background: "linear-gradient(135deg,#aa3bff,#7c3aed)",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: "13px", fontWeight: 800,
    flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0, overflow: "hidden" },
  userName: { color: "#fff", fontSize: "12.5px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userRole: { color: "rgba(255,255,255,0.4)", fontSize: "10.5px", textTransform: "capitalize", marginTop: "2px" },
  logoutBtn: {
    background: "rgba(255,255,255,0.07)", border: "none",
    color: "rgba(255,255,255,0.5)", borderRadius: "8px",
    padding: "7px", cursor: "pointer",
    display: "flex", alignItems: "center",
    transition: "background 0.15s, color 0.15s",
    flexShrink: 0,
  },
};
