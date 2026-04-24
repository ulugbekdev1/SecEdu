import { useState } from "react";
import {
  IcoLock, IcoCheck, IcoX, IcoAlertTriangle,
  IcoHash, IcoType, IcoZap, IcoGrid, IcoShield
} from "../components/Icons";

const validate = (pass) => ({
  length:    pass.length >= 8,
  uppercase: /[A-Z]/.test(pass),
  lowercase: /[a-z]/.test(pass),
  number:    /[0-9]/.test(pass),
  special:   /[!@#$%^&*(),.?":{}|<>]/.test(pass),
});

const getStrength = (rules) => {
  const count = Object.values(rules).filter(Boolean).length;
  if (count <= 1) return { label: "Juda zaif",  color: "#ef4444", width: "20%" };
  if (count === 2) return { label: "Zaif",       color: "#f97316", width: "40%" };
  if (count === 3) return { label: "O'rtacha",   color: "#eab308", width: "60%" };
  if (count === 4) return { label: "Yaxshi",     color: "#22c55e", width: "80%" };
  return               { label: "Kuchli",       color: "#10b981", width: "100%" };
};

const RULES = [
  { key: "length",    label: "Kamida 8 ta belgi",   Icon: IcoGrid  },
  { key: "uppercase", label: "Katta harf (A-Z)",     Icon: IcoType  },
  { key: "lowercase", label: "Kichik harf (a-z)",    Icon: IcoType  },
  { key: "number",    label: "Raqam (0-9)",           Icon: IcoHash  },
  { key: "special",   label: "Maxsus belgi (!@#$%)", Icon: IcoZap   },
];

const TIPS = [
  "Har bir hisob uchun alohida parol ishlating",
  "Parol menejeri (LastPass, 1Password) ishlating",
  "Parolni hech kimga bermang",
  "Har 3-6 oyda parolni yangilang",
];

const BAD_PASSWORDS = ["123456", "password", "qwerty", "12345678", "abc123"];

export default function PasswordGuide() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const rules    = validate(password);
  const strength = password ? getStrength(rules) : null;
  const allValid = Object.values(rules).every(Boolean);

  return (
    <div style={S.page}>
      <div>
        <h1 style={S.title}>Parol Xavfsizligi</h1>
        <p style={S.sub}>Parolingizning kuchini tekshiring va yaxshilang</p>
      </div>

      <div className="guide-grid" style={S.grid}>
        {/* Checker card */}
        <div style={S.card}>
          <h2 style={S.cardTitle}>Parol tekshiruvi</h2>

          <div style={S.inputWrap}>
            <span style={S.inputIco}>
              <IcoLock size={15} />
            </span>
            <input
              type={show ? "text" : "password"}
              style={S.input}
              placeholder="Parol kiriting..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="off"
            />
            <button style={S.eyeBtn} onClick={() => setShow(v => !v)}>
              {show
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          </div>

          {/* Strength meter */}
          {password && (
            <div style={S.strengthWrap}>
              <div style={S.strengthHeader}>
                <span style={S.strengthText}>Kuch darajasi</span>
                <span style={{ ...S.strengthLabel, color: strength.color }}>{strength.label}</span>
              </div>
              <div style={S.strengthTrack}>
                <div style={{ ...S.strengthFill, width: strength.width, background: strength.color }} />
              </div>
            </div>
          )}

          {/* Status */}
          {password && (
            <div style={{
              ...S.statusBox,
              background: allValid ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
              border: `1.5px solid ${allValid ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
              color: allValid ? "#10b981" : "#d97706",
            }}>
              <span style={{ display: "flex", flexShrink: 0 }}>
                {allValid
                  ? <IcoCheck size={14} />
                  : <IcoAlertTriangle size={14} />
                }
              </span>
              {allValid ? "Mukammal parol! Xavfsiz va kuchli." : "Quyidagi talablarni bajaring"}
            </div>
          )}

          {/* Rules list */}
          <div style={S.rulesList}>
            {RULES.map(r => {
              const ok = password ? rules[r.key] : null;
              return (
                <div key={r.key} style={{
                  ...S.rule,
                  ...(ok === true ? S.ruleOk : ok === false ? S.ruleBad : {})
                }}>
                  <div style={{
                    ...S.ruleDot,
                    background: ok === true ? "#10b981" : ok === false ? "#ef4444" : "var(--border)",
                    color: ok !== null ? "#fff" : "var(--text-muted)",
                  }}>
                    {ok === true
                      ? <IcoCheck size={11} />
                      : ok === false
                      ? <IcoX size={11} />
                      : <r.Icon size={11} />
                    }
                  </div>
                  <span style={{ ...S.ruleText, color: ok === true ? "var(--success)" : ok === false ? "var(--error)" : "var(--text)" }}>
                    {r.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Example */}
          <div style={S.exampleBox}>
            <span style={S.exampleLabel}>Namuna:</span>
            <code style={S.exampleCode}>SecuR3@2026</code>
          </div>
        </div>

        {/* Tips column */}
        <div style={S.tipsCol}>
          <div style={S.card}>
            <h3 style={S.cardTitle}>
              <span style={S.cardTitleIcon}><IcoShield size={16} /></span>
              Xavfsizlik maslahatlari
            </h3>
            <div style={S.tipsList}>
              {TIPS.map((tip, i) => (
                <div key={i} style={S.tip}>
                  <div style={S.tipNum}>{i + 1}</div>
                  <p style={S.tipText}>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={S.card}>
            <h3 style={S.cardTitle}>
              <span style={S.cardTitleIcon} ><IcoX size={14} style={{ color: "var(--error)" }} /></span>
              Yomon parollar
            </h3>
            <div style={S.badList}>
              {BAD_PASSWORDS.map(p => (
                <div key={p} style={S.badRow}>
                  <span style={S.badIcon}><IcoX size={12} /></span>
                  <code style={S.badCode}>{p}</code>
                </div>
              ))}
            </div>
            <p style={S.badNote}>Bu parollar eng ko'p buzilganlar ro'yxatida!</p>
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

  grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" },

  card: { background: "var(--card-bg)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-md)" },
  cardTitle: { fontSize: "15px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 18px", display: "flex", alignItems: "center", gap: "8px" },
  cardTitleIcon: { display: "flex" },

  inputWrap: { position: "relative", display: "flex", alignItems: "center", marginBottom: "16px" },
  inputIco: { position: "absolute", left: "12px", color: "#9ca3af", display: "flex", pointerEvents: "none" },
  input: {
    width: "100%", padding: "12px 42px 12px 40px",
    border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)",
    fontSize: "15px", color: "var(--text-h)", outline: "none",
    background: "#fafafa", fontFamily: "monospace", letterSpacing: "0.05em",
  },
  eyeBtn: {
    position: "absolute", right: "10px",
    background: "none", border: "none",
    cursor: "pointer", color: "#9ca3af", display: "flex", padding: "4px",
  },

  strengthWrap: { marginBottom: "14px" },
  strengthHeader: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  strengthText:  { fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 },
  strengthLabel: { fontSize: "13px", fontWeight: 700 },
  strengthTrack: { height: "8px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" },
  strengthFill:  { height: "100%", borderRadius: "99px", transition: "width 0.4s, background 0.4s" },

  statusBox: {
    padding: "12px 16px", borderRadius: "var(--radius-sm)",
    fontSize: "13px", fontWeight: 600, marginBottom: "20px",
    display: "flex", alignItems: "center", gap: "8px",
  },

  rulesList: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" },
  rule: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "10px 12px", borderRadius: "var(--radius-sm)",
    background: "#fafafa", border: "1.5px solid transparent",
    transition: "all 0.2s",
  },
  ruleOk:  { background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.25)" },
  ruleBad: { background: "rgba(239,68,68,0.05)",  borderColor: "rgba(239,68,68,0.2)"  },
  ruleDot: {
    width: "26px", height: "26px", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all 0.2s",
  },
  ruleText: { fontSize: "13px", fontWeight: 500, transition: "color 0.2s" },

  exampleBox: {
    background: "var(--accent-light)", border: "1.5px solid var(--accent-border)",
    borderRadius: "var(--radius-sm)", padding: "12px 16px",
    display: "flex", alignItems: "center", gap: "10px",
  },
  exampleLabel: { fontSize: "12px", fontWeight: 700, color: "var(--accent)" },
  exampleCode: {
    background: "rgba(170,59,255,0.15)", color: "var(--accent)",
    padding: "3px 8px", borderRadius: "5px",
    fontFamily: "monospace", fontSize: "14px", fontWeight: 700,
  },

  tipsCol: { display: "flex", flexDirection: "column", gap: "20px" },
  tipsList: { display: "flex", flexDirection: "column", gap: "12px" },
  tip: { display: "flex", gap: "12px", alignItems: "flex-start" },
  tipNum: {
    width: "26px", height: "26px", borderRadius: "50%",
    background: "var(--accent)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: 700, flexShrink: 0,
  },
  tipText: { fontSize: "13px", color: "var(--text)", lineHeight: 1.6, paddingTop: "3px" },

  badList: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" },
  badRow:  { display: "flex", alignItems: "center", gap: "10px" },
  badIcon: { color: "var(--error)", display: "flex" },
  badCode: {
    background: "var(--error-light)", color: "var(--error)",
    padding: "3px 8px", borderRadius: "5px",
    fontFamily: "monospace", fontSize: "13px",
  },
  badNote: { fontSize: "11px", color: "var(--text-muted)" },
};
