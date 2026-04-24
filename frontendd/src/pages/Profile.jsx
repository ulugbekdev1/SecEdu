import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { IcoTarget, IcoFlame, IcoStar, IcoAward, IcoLock, IcoLogOut } from "../components/Icons";

const ACHIEVEMENTS = [
  { Icon: IcoTarget, label: "Birinchi dars",  check: (w)    => w >= 1 },
  { Icon: IcoFlame,  label: "5 ta dars",      check: (w)    => w >= 5 },
  { Icon: IcoStar,   label: "50% progress",   check: (_, p) => p >= 50 },
  { Icon: IcoAward,  label: "Sertifikat",     check: (_, p) => p >= 100 },
];

export default function Profile() {
  const [progress, setProgress] = useState({ total: 0, watched: 0, progress: 0 });
  const navigate   = useNavigate();
  const username   = localStorage.getItem("username")   || "Foydalanuvchi";
  const fullName   = localStorage.getItem("full_name")  || username;
  const role       = localStorage.getItem("role")       || "employee";
  const department = localStorage.getItem("department") || "";

  useEffect(() => {
    API.get("/progress/me")
      .then(res => setProgress(res.data))
      .catch(() => {});
  }, []);

  const pct     = progress.progress || 0;
  const initial = fullName[0]?.toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const InfoRow = ({ label, value, accent }) => (
    <div style={S.infoRow}>
      <span style={S.infoLabel}>{label}</span>
      <span style={{ ...S.infoValue, ...(accent ? { color: "var(--accent)", fontWeight: 700 } : {}) }}>
        {value}
      </span>
    </div>
  );

  return (
    <div style={S.page}>
      <div>
        <h1 style={S.title}>Profil</h1>
        <p style={S.sub}>Shaxsiy ma'lumotlaringiz va o'quv jarayoni</p>
      </div>

      <div className="profile-grid" style={S.grid}>
        <div style={S.profileCard}>
          <div style={S.avatarWrap}>
            <div style={S.avatar}>{initial}</div>
            <div style={S.avatarBadge}>{role}</div>
          </div>
          <h2 style={S.name}>{fullName}</h2>
          <span style={S.rolePill}>{role === "admin" ? "Administrator" : "Xodim"}</span>

          <div style={S.divider} />

          <div style={S.infoList}>
            <InfoRow label="Foydalanuvchi" value={username} />
            <InfoRow label="To'liq ism"    value={fullName} />
            {department && <InfoRow label="Bo'lim" value={department} accent />}
            <InfoRow label="Rol"    value={role === "admin" ? "Administrator" : "Xodim"} />
            <InfoRow label="Status" value="Faol" accent />
          </div>

          <button style={S.logoutBtn} onClick={handleLogout}>
            <IcoLogOut size={15} />
            Chiqish
          </button>
        </div>

        <div style={S.statsCol}>
          <div style={S.card}>
            <h3 style={S.cardTitle}>O'quv progressi</h3>
            <div style={S.circleWrap}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10"/>
                <circle cx="60" cy="60" r="50" fill="none"
                  stroke="url(#pg)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                  transform="rotate(-90 60 60)"
                  style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
                />
                <defs>
                  <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#aa3bff"/>
                    <stop offset="100%" stopColor="#7c3aed"/>
                  </linearGradient>
                </defs>
                <text x="60" y="58" textAnchor="middle" fontSize="22" fontWeight="800" fill="#08060d">{pct}%</text>
                <text x="60" y="75" textAnchor="middle" fontSize="10" fill="#9ca3af">bajarildi</text>
              </svg>
            </div>
            <div style={S.progressStats}>
              <div style={S.pStat}>
                <div style={{ ...S.pStatNum, color: "var(--accent)" }}>{progress.watched}</div>
                <div style={S.pStatLabel}>O'tilgan</div>
              </div>
              <div style={S.pDivider} />
              <div style={S.pStat}>
                <div style={{ ...S.pStatNum, color: "var(--text-muted)" }}>{progress.total - progress.watched}</div>
                <div style={S.pStatLabel}>Qolgan</div>
              </div>
              <div style={S.pDivider} />
              <div style={S.pStat}>
                <div style={{ ...S.pStatNum, color: "var(--success)" }}>{progress.total}</div>
                <div style={S.pStatLabel}>Jami</div>
              </div>
            </div>
          </div>

          <div style={S.card}>
            <h3 style={S.cardTitle}>Yutuqlar</h3>
            <div style={S.achieveGrid}>
              {ACHIEVEMENTS.map((a) => {
                const done = a.check(progress.watched, pct);
                return (
                  <div key={a.label} style={{ ...S.achieve, ...(done ? S.achieveDone : S.achieveLocked) }}>
                    <div style={{ ...S.achieveIconBox, background: done ? "var(--accent-light)" : "var(--border)", color: done ? "var(--accent)" : "var(--text-muted)" }}>
                      {done ? <a.Icon size={20} /> : <IcoLock size={16} />}
                    </div>
                    <span style={{ ...S.achieveLabel, color: done ? "var(--text-h)" : "var(--text-muted)" }}>
                      {a.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: "flex", flexDirection: "column", gap: "24px" },
  title: { fontSize: "24px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 4px" },
  sub:   { fontSize: "14px", color: "var(--text)" },
  grid: { display: "grid", gridTemplateColumns: "280px 1fr", gap: "20px", alignItems: "start" },
  profileCard: { background: "var(--card-bg)", borderRadius: "var(--radius-lg)", padding: "28px 24px", boxShadow: "var(--shadow-md)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  avatarWrap: { position: "relative", marginBottom: "16px" },
  avatar: { width: "80px", height: "80px", background: "linear-gradient(135deg,#aa3bff,#7c3aed)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "32px", fontWeight: 800, boxShadow: "0 6px 20px rgba(170,59,255,0.35)" },
  avatarBadge: { position: "absolute", bottom: "-4px", right: "-4px", background: "#10b981", color: "#fff", borderRadius: "99px", padding: "2px 8px", fontSize: "10px", fontWeight: 700, border: "2px solid var(--card-bg)", textTransform: "capitalize" },
  name: { fontSize: "18px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 8px" },
  rolePill: { background: "var(--accent-light)", color: "var(--accent)", borderRadius: "99px", padding: "4px 12px", fontSize: "12px", fontWeight: 700, display: "inline-block" },
  divider: { width: "100%", height: "1px", background: "var(--border)", margin: "20px 0" },
  infoList: { width: "100%", display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" },
  infoRow:  { display: "flex", justifyContent: "space-between", alignItems: "center" },
  infoLabel: { fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 },
  infoValue: { fontSize: "13px", color: "var(--text-h)", fontWeight: 600 },
  logoutBtn: { marginTop: "20px", width: "100%", padding: "11px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--error-light)", color: "var(--error)", border: "1.5px solid rgba(220,38,38,0.2)", borderRadius: "var(--radius-sm)", fontSize: "13px", fontWeight: 700, cursor: "pointer" },
  statsCol: { display: "flex", flexDirection: "column", gap: "20px" },
  card: { background: "var(--card-bg)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-md)" },
  cardTitle: { fontSize: "15px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 20px" },
  circleWrap: { display: "flex", justifyContent: "center", marginBottom: "20px" },
  progressStats: { display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", borderTop: "1px solid var(--border)", paddingTop: "20px" },
  pStat: { textAlign: "center" },
  pStatNum: { fontSize: "22px", fontWeight: 800, lineHeight: 1 },
  pStatLabel: { fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", fontWeight: 600 },
  pDivider: { width: "1px", height: "36px", background: "var(--border)" },
  achieveGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  achieve: { borderRadius: "var(--radius-md)", padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", border: "1.5px solid" },
  achieveDone:   { borderColor: "var(--accent-border)", background: "rgba(170,59,255,0.04)" },
  achieveLocked: { borderColor: "var(--border)",        background: "#fafafa" },
  achieveIconBox: { width: "42px", height: "42px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" },
  achieveLabel: { fontSize: "11px", fontWeight: 700, textAlign: "center", lineHeight: 1.4 },
};