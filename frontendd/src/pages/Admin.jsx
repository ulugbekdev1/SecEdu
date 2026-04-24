import { useEffect, useState } from "react";
import API from "../api";
import {
  IcoUsers, IcoBook, IcoCheckCircle, IcoBarChart,
  IcoPlus, IcoUser, IcoSettings, IcoShield,
  IcoInbox, IcoChevronRight
} from "../components/Icons";

const STATS = [
  { key: "users",    label: "Foydalanuvchilar", Icon: IcoUsers,       color: "#aa3bff" },
  { key: "mats",     label: "Materiallar",      Icon: IcoBook,        color: "#3b82f6" },
  { key: "sessions", label: "Faol sessiyalar",  Icon: IcoCheckCircle, color: "#10b981" },
  { key: "tests",    label: "Umumiy testlar",   Icon: IcoBarChart,    color: "#f59e0b" },
];

const ACTIONS = [
  { Icon: IcoPlus,     label: "Material qo'shish",        color: "#aa3bff" },
  { Icon: IcoUser,     label: "Foydalanuvchi qo'shish",   color: "#3b82f6" },
  { Icon: IcoBarChart, label: "Hisobot ko'rish",          color: "#10b981" },
  { Icon: IcoSettings, label: "Sozlamalar",               color: "#f59e0b" },
];

const StatCard = ({ Icon, label, value, color }) => (
  <div style={{ ...S.stat, borderLeft: `4px solid ${color}` }}>
    <div style={{ ...S.statIcon, color, background: color + "15" }}>
      <Icon size={20} />
    </div>
    <div>
      <div style={S.statVal}>{value}</div>
      <div style={S.statLabel}>{label}</div>
    </div>
  </div>
);

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/users").catch(() => ({ data: [] })),
      API.get("/materials").catch(() => ({ data: [] })),
    ]).then(([u, m]) => {
      setUsers(u.data);
      setMaterials(m.data);
    }).finally(() => setLoading(false));
  }, []);

  const statValues = {
    users:    loading ? "..." : users.length,
    mats:     loading ? "..." : materials.length,
    sessions: "1",
    tests:    "5",
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Admin Panel</h1>
          <p style={S.sub}>Platformani boshqarish markazi</p>
        </div>
        <div style={S.adminBadge}>
          <IcoShield size={14} />
          Administrator
        </div>
      </div>

      <div className="stats-grid" style={S.statsGrid}>
        {STATS.map(s => (
          <StatCard key={s.key} Icon={s.Icon} label={s.label} value={statValues[s.key]} color={s.color} />
        ))}
      </div>

      <div className="admin-cols" style={S.cols}>
        {/* Quick actions */}
        <div style={S.card}>
          <h3 style={S.cardTitle}>Tezkor amallar</h3>
          <div style={S.actions}>
            {ACTIONS.map(a => (
              <button key={a.label} style={S.actionBtn}>
                <div style={{ ...S.actionIcon, background: a.color + "15", color: a.color }}>
                  <a.Icon size={16} />
                </div>
                <span style={S.actionLabel}>{a.label}</span>
                <IcoChevronRight size={14} style={{ color: "var(--text-muted)", marginLeft: "auto" }} />
              </button>
            ))}
          </div>
        </div>

        {/* Users */}
        <div style={S.card}>
          <h3 style={S.cardTitle}>Foydalanuvchilar</h3>
          {loading ? (
            <div style={S.loadingBox}>Yuklanmoqda...</div>
          ) : users.length === 0 ? (
            <div style={S.emptyBox}>
              <div style={S.emptyIcon}><IcoUsers size={28} style={{ color: "var(--text-muted)" }} /></div>
              <p>Foydalanuvchilar yo'q</p>
            </div>
          ) : (
            <div style={S.list}>
              {users.map((u, i) => (
                <div key={u.id || i} style={S.userRow}>
                  <div style={S.userAvatar}>{(u.username || "U")[0].toUpperCase()}</div>
                  <div style={S.userInfo}>
                    <div style={S.userName}>{u.username}</div>
                    <div style={S.userRole}>{u.role || "employee"}</div>
                  </div>
                  <span style={{
                    ...S.badge,
                    background: u.role === "admin" ? "var(--accent-light)" : "var(--success-light)",
                    color:      u.role === "admin" ? "var(--accent)"       : "var(--success)",
                  }}>
                    {u.role || "employee"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Materials table */}
      <div style={S.card}>
        <div style={S.cardHead}>
          <h3 style={{ ...S.cardTitle, margin: 0 }}>Materiallar ro'yxati</h3>
          <span style={S.countPill}>{materials.length} ta</span>
        </div>
        {loading ? (
          <div style={S.loadingBox}>Yuklanmoqda...</div>
        ) : materials.length === 0 ? (
          <div style={S.emptyBox}>
            <div style={S.emptyIcon}><IcoInbox size={28} style={{ color: "var(--text-muted)" }} /></div>
            <p>Materiallar yo'q</p>
          </div>
        ) : (
          <div style={S.list}>
            {materials.map((m, i) => (
              <div key={m.id || i} style={S.matRow}>
                <div style={S.matNum}>{i + 1}</div>
                <div style={S.matInfo}>
                  <div style={S.matTitle}>{m.title}</div>
                  {m.video_url && <div style={S.matUrl}>{m.video_url}</div>}
                </div>
                <span style={S.matBadge}>Video</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page: { display: "flex", flexDirection: "column", gap: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" },
  title: { fontSize: "24px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 4px" },
  sub:   { fontSize: "14px", color: "var(--text)" },
  adminBadge: {
    display: "flex", alignItems: "center", gap: "7px",
    background: "var(--accent-light)", color: "var(--accent)",
    borderRadius: "99px", padding: "7px 16px",
    fontSize: "13px", fontWeight: 700,
  },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "16px" },
  stat: {
    background: "var(--card-bg)", borderRadius: "var(--radius-md)",
    padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px",
    boxShadow: "var(--shadow-sm)",
  },
  statIcon: { width: "42px", height: "42px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statVal:   { fontSize: "22px", fontWeight: 800, color: "var(--text-h)", lineHeight: 1 },
  statLabel: { fontSize: "12px", color: "var(--text-muted)", marginTop: "3px", fontWeight: 600 },

  cols: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  card: { background: "var(--card-bg)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-md)" },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  cardTitle: { fontSize: "15px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 16px" },
  countPill: {
    background: "var(--accent-light)", color: "var(--accent)",
    borderRadius: "99px", padding: "3px 10px", fontSize: "12px", fontWeight: 700,
  },

  actions: { display: "flex", flexDirection: "column", gap: "10px" },
  actionBtn: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "12px 14px",
    background: "#fafafa", border: "1.5px solid var(--border)",
    borderRadius: "var(--radius-md)",
    cursor: "pointer", transition: "background 0.15s", width: "100%",
  },
  actionIcon: { width: "34px", height: "34px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  actionLabel: { fontSize: "13px", fontWeight: 600, color: "var(--text-h)" },

  list: { display: "flex", flexDirection: "column", gap: "0" },
  userRow: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--border)" },
  userAvatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "linear-gradient(135deg,#aa3bff,#7c3aed)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: "14px", fontWeight: 700, flexShrink: 0,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: "13px", fontWeight: 700, color: "var(--text-h)" },
  userRole: { fontSize: "11px", color: "var(--text-muted)", textTransform: "capitalize" },
  badge: { borderRadius: "99px", padding: "3px 10px", fontSize: "11px", fontWeight: 700 },

  matRow: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid var(--border)" },
  matNum: {
    width: "28px", height: "28px", borderRadius: "7px",
    background: "var(--accent-light)", color: "var(--accent)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: 700, flexShrink: 0,
  },
  matInfo: { flex: 1, minWidth: 0 },
  matTitle: { fontSize: "13px", fontWeight: 700, color: "var(--text-h)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  matUrl:   { fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  matBadge: {
    background: "var(--accent-light)", color: "var(--accent)",
    borderRadius: "99px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, flexShrink: 0,
  },

  loadingBox: { textAlign: "center", color: "var(--text-muted)", padding: "20px", fontSize: "14px" },
  emptyBox:   { textAlign: "center", color: "var(--text-muted)", padding: "24px", fontSize: "14px" },
  emptyIcon:  { display: "flex", justifyContent: "center", marginBottom: "8px" },
};
