import { useEffect, useState } from "react";
import API from "../api";
import {
  IcoPlay, IcoClock, IcoLayers, IcoTrendUp,
  IcoTarget, IcoAward, IcoShield, IcoCheck
} from "../components/Icons";

const StatCard = ({ Icon, label, value, sub, color }) => (
  <div style={{ ...S.stat, borderTop: `3px solid ${color}` }}>
    <div style={{ ...S.statIcon, background: color + "18", color }}>
      <Icon size={20} />
    </div>
    <div style={S.statBody}>
      <div style={S.statValue}>{value}</div>
      <div style={S.statLabel}>{label}</div>
      {sub && <div style={S.statSub}>{sub}</div>}
    </div>
  </div>
);

export default function Dashboard() {
  const [progress, setProgress] = useState({ total: 0, watched: 0, progress: 0 });
  const username = localStorage.getItem("username") || "Foydalanuvchi";

  useEffect(() => {
    API.get("/progress/1")
      .then(res => setProgress(res.data))
      .catch(() => {});
  }, []);

  const pct = progress.progress || 0;
  const remaining = progress.total - progress.watched;

  return (
    <div style={S.page}>
      {/* Welcome */}
      <div style={S.welcome}>
        <div>
          <h1 style={S.welcomeTitle}>
            Xush kelibsiz, {username}
          </h1>
          <p style={S.welcomeSub}>Bugun kiberhavfsizlik bo'yicha bilimlaringizni oshiring</p>
        </div>
        <div style={S.welcomeBadge}>
          <span style={S.badgeDot} />
          Faol
        </div>
      </div>

      {/* Stats */}
      <div style={S.statsGrid}>
        <StatCard Icon={IcoPlay}     label="Ko'rilgan" value={progress.watched} sub="material"  color="#aa3bff" />
        <StatCard Icon={IcoClock}    label="Qolgan"    value={remaining}         sub="material"  color="#f59e0b" />
        <StatCard Icon={IcoLayers}   label="Jami"      value={progress.total}    sub="material"  color="#3b82f6" />
        <StatCard Icon={IcoTrendUp}  label="Progress"  value={`${pct}%`}         sub="bajarildi" color="#10b981" />
      </div>

      {/* Progress card */}
      <div style={S.card}>
        <div style={S.cardHead}>
          <div>
            <h2 style={S.cardTitle}>O'quv progressi</h2>
            <p style={S.cardSub}>Siz jami materiallarning {pct}% ini tugatdingiz</p>
          </div>
          <span style={{
            ...S.pill,
            background: pct === 100 ? "#10b98120" : "#aa3bff18",
            color: pct === 100 ? "#10b981" : "#aa3bff"
          }}>
            {pct === 100
              ? <><IcoCheck size={12} /> Tugallandi</>
              : `${pct}%`
            }
          </span>
        </div>

        <div style={S.barTrack}>
          <div style={{ ...S.barFill, width: `${pct}%` }} />
        </div>

        <div style={S.barMeta}>
          <span>{progress.watched} material ko'rilgan</span>
          <span>{remaining} material qolgan</span>
        </div>

        <div style={S.milestones}>
          {[25, 50, 75, 100].map(m => (
            <div key={m} style={S.milestone}>
              <div style={{
                ...S.msDot,
                background: pct >= m ? "#aa3bff" : "var(--border)",
                boxShadow: pct >= m ? "0 0 0 3px rgba(170,59,255,0.2)" : "none",
              }} />
              <span style={{ ...S.msLabel, color: pct >= m ? "#aa3bff" : "var(--text-muted)" }}>{m}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div style={S.tipsGrid}>
        <div style={S.tipCard}>
          <div style={S.tipIconWrap}>
            <IcoTarget size={22} style={{ color: "#aa3bff" }} />
          </div>
          <h3 style={S.tipTitle}>Bugungi maqsad</h3>
          <p style={S.tipText}>Kamida 2 ta yangi material ko'ring va bilimingizni mustahkamlang</p>
        </div>
        <div style={S.tipCard}>
          <div style={S.tipIconWrap}>
            <IcoAward size={22} style={{ color: "#f59e0b" }} />
          </div>
          <h3 style={S.tipTitle}>Natijalar</h3>
          <p style={S.tipText}>Quiz testini ishlang va o'z darajangizni aniqlang</p>
        </div>
        <div style={S.tipCard}>
          <div style={S.tipIconWrap}>
            <IcoShield size={22} style={{ color: "#10b981" }} />
          </div>
          <h3 style={S.tipTitle}>Xavfsizlik</h3>
          <p style={S.tipText}>Parol xavfsizligi bo'limini tekshiring va parolingizni yangilang</p>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: "flex", flexDirection: "column", gap: "24px" },

  welcome: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: "12px",
  },
  welcomeTitle: { fontSize: "26px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 4px" },
  welcomeSub: { color: "var(--text)", fontSize: "14px" },
  welcomeBadge: {
    display: "flex", alignItems: "center", gap: "7px",
    background: "rgba(16,185,129,0.1)", color: "#10b981",
    borderRadius: "99px", padding: "6px 14px",
    fontSize: "13px", fontWeight: 600,
  },
  badgeDot: {
    width: "7px", height: "7px",
    background: "#10b981", borderRadius: "50%",
    display: "inline-block",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "16px",
  },
  stat: {
    background: "var(--card-bg)",
    borderRadius: "var(--radius-md)",
    padding: "20px",
    display: "flex", alignItems: "flex-start", gap: "14px",
    boxShadow: "var(--shadow-sm)",
  },
  statIcon: {
    width: "44px", height: "44px",
    borderRadius: "var(--radius-sm)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  statBody: {},
  statValue: { fontSize: "24px", fontWeight: 700, color: "var(--text-h)", lineHeight: 1 },
  statLabel: { fontSize: "13px", fontWeight: 600, color: "var(--text)", marginTop: "4px" },
  statSub:   { fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" },

  card: {
    background: "var(--card-bg)",
    borderRadius: "var(--radius-lg)",
    padding: "28px",
    boxShadow: "var(--shadow-md)",
  },
  cardHead: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: "20px", gap: "12px",
  },
  cardTitle: { fontSize: "17px", fontWeight: 700, margin: "0 0 4px" },
  cardSub: { fontSize: "13px", color: "var(--text)" },
  pill: {
    borderRadius: "99px", padding: "5px 12px",
    fontSize: "13px", fontWeight: 600, flexShrink: 0,
    display: "flex", alignItems: "center", gap: "5px",
  },

  barTrack: { height: "10px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" },
  barFill: {
    height: "100%",
    background: "linear-gradient(90deg, #aa3bff, #7c3aed)",
    borderRadius: "99px",
    transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
  },
  barMeta: {
    display: "flex", justifyContent: "space-between",
    fontSize: "12px", color: "var(--text-muted)", marginTop: "10px",
  },

  milestones: {
    display: "flex", justifyContent: "space-between",
    marginTop: "20px", paddingTop: "20px",
    borderTop: "1px solid var(--border)",
  },
  milestone: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" },
  msDot: { width: "10px", height: "10px", borderRadius: "50%", transition: "all 0.3s" },
  msLabel: { fontSize: "11px", fontWeight: 600, transition: "color 0.3s" },

  tipsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
  },
  tipCard: {
    background: "var(--card-bg)",
    borderRadius: "var(--radius-md)",
    padding: "20px",
    boxShadow: "var(--shadow-sm)",
  },
  tipIconWrap: {
    width: "40px", height: "40px",
    background: "var(--accent-light)",
    borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: "12px",
  },
  tipTitle: { fontSize: "14px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 6px" },
  tipText:  { fontSize: "13px", color: "var(--text)", lineHeight: 1.5 },
};
