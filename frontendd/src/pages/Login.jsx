import { useState } from "react";
import API from "../api";
import { IcoPlay, IcoShield, IcoLock, IcoTrendUp, IcoAlertTriangle } from "../components/Icons";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!username.trim() || !password) {
      setError("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", username);
      window.location.href = "/";
    } catch {
      setError("Login yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      {/* Left decorative panel (hidden on mobile via CSS) */}
      <div className="login-left" style={S.left}>
        <div style={S.leftInner}>
          <div style={S.brand}>
            <div style={S.brandIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
              </svg>
            </div>
            <div>
              <div style={S.brandName}>SecureEdu</div>
              <div style={S.brandSub}>Kiberhavfsizlik platformasi</div>
            </div>
          </div>

          <div style={S.heroText}>
            <h1 style={S.heroH}>Raqamli xavfsizlikni o'rgan.</h1>
            <p style={S.heroP}>
              Zamonaviy kibertahdidlardan himoyalanish uchun interaktiv kurslar, testlar va amaliy ko'nikmalar.
            </p>
          </div>

          <div style={S.features}>
            {[
              { Icon: IcoPlay,     text: "Interaktiv video darslar"   },
              { Icon: IcoShield,   text: "Bilim tekshirish testlari"  },
              { Icon: IcoLock,     text: "Parol xavfsizligi tahlili"  },
              { Icon: IcoTrendUp,  text: "Shaxsiy progress kuzatish"  },
            ].map(f => (
              <div key={f.text} style={S.feat}>
                <span style={S.featIcon}><f.Icon size={15} /></span>
                <span style={S.featText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="login-right" style={S.right}>
        <div style={S.card}>
          {/* Mobile logo */}
          <div style={S.mobileLogo}>
            <div style={S.brandIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
              </svg>
            </div>
            <span style={S.brandName}>SecureEdu</span>
          </div>

          <h2 style={S.formTitle}>Xush kelibsiz</h2>
          <p style={S.formSub}>Hisobingizga kiring</p>

          {error && (
            <div style={S.errBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div style={S.field}>
            <label style={S.label}>Foydalanuvchi nomi</label>
            <div style={S.wrap}>
              <span style={S.ico}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                style={S.input}
                placeholder="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === "Enter" && login()}
                autoComplete="username"
              />
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Parol</label>
            <div style={S.wrap}>
              <span style={S.ico}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                style={S.input}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && login()}
                autoComplete="current-password"
              />
              <button style={S.eyeBtn} onClick={() => setShowPass(v => !v)} type="button">
                {showPass
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <button
            style={{ ...S.btn, opacity: loading ? 0.75 : 1 }}
            onClick={login}
            disabled={loading}
          >
            {loading
              ? <span style={S.spinner} />
              : <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
                  </svg>
                  Kirish
                </>
            }
          </button>

          <p style={S.hint}>Muammo bo'lsa, administrator bilan bog'laning</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-right { padding: 24px 16px !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const S = {
  page: { display: "flex", minHeight: "100vh" },

  left: {
    flex: "0 0 460px",
    background: "linear-gradient(160deg,#0f172a 0%,#1e1b4b 55%,#2d1b69 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "48px 48px",
    position: "relative", overflow: "hidden",
  },
  leftInner: { display: "flex", flexDirection: "column", gap: "40px", width: "100%" },
  brand: { display: "flex", alignItems: "center", gap: "12px" },
  brandIcon: {
    width: "52px", height: "52px",
    background: "linear-gradient(135deg,#aa3bff,#7c3aed)",
    borderRadius: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", flexShrink: 0,
    boxShadow: "0 8px 24px rgba(170,59,255,0.4)",
  },
  brandName: { color: "#fff", fontWeight: 800, fontSize: "18px" },
  brandSub:  { color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "2px" },

  heroText: {},
  heroH: { color: "#fff", fontSize: "30px", fontWeight: 700, lineHeight: 1.25, margin: "0 0 12px" },
  heroP: { color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.7 },

  features: { display: "flex", flexDirection: "column", gap: "10px" },
  feat: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "var(--radius-md)", padding: "11px 14px",
  },
  featIcon: { fontSize: "15px", color: "#aa3bff", width: "20px", textAlign: "center" },
  featText: { color: "rgba(255,255,255,0.65)", fontSize: "13px", fontWeight: 500 },

  right: {
    flex: 1, display: "flex",
    alignItems: "center", justifyContent: "center",
    padding: "40px 24px",
    background: "#f4f6fb",
  },
  card: {
    width: "100%", maxWidth: "400px",
    background: "#fff", borderRadius: "20px",
    padding: "36px 32px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.09)",
  },
  mobileLogo: {
    display: "none",
    alignItems: "center", gap: "10px",
    marginBottom: "24px",
    justifyContent: "center",
  },
  formTitle: { fontSize: "22px", fontWeight: 800, color: "var(--text-h)", margin: "0 0 4px" },
  formSub:   { color: "var(--text-muted)", fontSize: "13px", marginBottom: "24px" },

  errBox: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "var(--error-light)",
    border: "1.5px solid rgba(220,38,38,0.2)",
    color: "var(--error)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 14px", fontSize: "13px",
    fontWeight: 600, marginBottom: "20px",
  },

  field:  { marginBottom: "16px" },
  label:  { display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "7px", letterSpacing: "0.01em" },
  wrap:   { position: "relative", display: "flex", alignItems: "center" },
  ico:    { position: "absolute", left: "12px", color: "#9ca3af", display: "flex", pointerEvents: "none" },
  input:  {
    width: "100%",
    padding: "11px 40px 11px 38px",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontSize: "14px", color: "var(--text-h)",
    background: "#fafafa", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  eyeBtn: {
    position: "absolute", right: "10px",
    background: "none", border: "none",
    cursor: "pointer", color: "#9ca3af",
    display: "flex", padding: "4px",
  },

  btn: {
    width: "100%", marginTop: "6px",
    padding: "13px",
    background: "linear-gradient(135deg,#aa3bff,#7c3aed)",
    color: "#fff", border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: "14px", fontWeight: 700,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    boxShadow: "0 4px 18px rgba(170,59,255,0.35)",
    transition: "opacity 0.2s, transform 0.15s",
  },
  spinner: {
    width: "18px", height: "18px",
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  hint: { textAlign: "center", color: "var(--text-muted)", fontSize: "12px", marginTop: "18px" },
};
