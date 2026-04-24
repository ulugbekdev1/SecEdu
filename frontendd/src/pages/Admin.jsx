import { useEffect, useState } from "react";
import API from "../api";
import {
  IcoUsers, IcoBook, IcoCheckCircle, IcoBarChart,
  IcoPlus, IcoShield, IcoInbox, IcoX
} from "../components/Icons";

const DEPT_COLORS = {
  "IT bo'limi":      "#aa3bff",
  "Moliya bo'limi":  "#3b82f6",
  "HR bo'limi":      "#10b981",
  "Marketing":       "#f59e0b",
  "Boshqaruv":       "#ef4444",
  "IT":              "#aa3bff",
};

function deptColor(dept) {
  return DEPT_COLORS[dept] || "#6b7280";
}

export default function Admin() {
  const [users,     setUsers]     = useState([]);
  const [materials, setMaterials] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [stats,     setStats]     = useState({ total_users: 0, total_materials: 0, completed_users: 0 });
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("users");

  // Add user form
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState({ username: "", password: "", full_name: "", department: "", role: "employee" });
  const [formErr,   setFormErr]   = useState("");
  const [saving,    setSaving]    = useState(false);

  // Add question form
  const [showQForm, setShowQForm] = useState(false);
  const [qForm,     setQForm]     = useState({ question: "", option_a: "", option_b: "", option_c: "", answer: "0", explanation: "", category: "Xavfsizlik Siyosati" });
  const [qErr,      setQErr]      = useState("");
  const [qSaving,   setQSaving]   = useState(false);

  // Add material form
  const [showMatForm, setShowMatForm] = useState(false);
  const [matForm,     setMatForm]     = useState({ title: "", video_url: "", description: "", category: "Xavfsizlik Siyosati" });
  const [matErr,      setMatErr]      = useState("");
  const [matSaving,   setMatSaving]   = useState(false);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      API.get("/users").catch(() => ({ data: [] })),
      API.get("/materials").catch(() => ({ data: [] })),
      API.get("/questions").catch(() => ({ data: [] })),
      API.get("/stats").catch(() => ({ data: { total_users: 0, total_materials: 0, completed_users: 0 } })),
    ]).then(([u, m, q, s]) => {
      setUsers(u.data);
      setMaterials(m.data);
      setQuestions(q.data);
      setStats(s.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAddUser = async () => {
    if (!form.username || !form.password) { setFormErr("Username va parol majburiy"); return; }
    setSaving(true); setFormErr("");
    try {
      await API.post("/users", form);
      setForm({ username: "", password: "", full_name: "", department: "", role: "employee" });
      setShowForm(false);
      fetchAll();
    } catch (e) {
      setFormErr(e.response?.data?.detail || "Xatolik yuz berdi");
    } finally { setSaving(false); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Foydalanuvchini o'chirasizmi?")) return;
    await API.delete(`/users/${id}`).catch(() => {});
    fetchAll();
  };

  const handleAddMaterial = async () => {
    if (!matForm.title || !matForm.video_url) { setMatErr("Sarlavha va video URL majburiy"); return; }
    setMatSaving(true); setMatErr("");
    try {
      await API.post("/materials", matForm);
      setMatForm({ title: "", video_url: "", description: "", category: "Xavfsizlik Siyosati" });
      setShowMatForm(false);
      fetchAll();
    } catch (e) {
      setMatErr(e.response?.data?.detail || "Xatolik yuz berdi");
    } finally { setMatSaving(false); }
  };

  const handleAddQuestion = async () => {
    if (!qForm.question || !qForm.option_a || !qForm.option_b || !qForm.option_c) {
      setQErr("Savol va kamida 3 ta variant majburiy"); return;
    }
    setQSaving(true); setQErr("");
    try {
      await API.post("/questions", {
        question:    qForm.question,
        options:     [qForm.option_a, qForm.option_b, qForm.option_c],
        answer:      parseInt(qForm.answer),
        explanation: qForm.explanation || null,
        category:    qForm.category,
      });
      setQForm({ question: "", option_a: "", option_b: "", option_c: "", answer: "0", explanation: "", category: "Xavfsizlik Siyosati" });
      setShowQForm(false);
      fetchAll();
    } catch (e) {
      setQErr(e.response?.data?.detail || "Xatolik");
    } finally { setQSaving(false); }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Savolni o'chirasizmi?")) return;
    await API.delete(`/questions/${id}`).catch(() => {});
    fetchAll();
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm("Materialni o'chirasizmi?")) return;
    await API.delete(`/materials/${id}`).catch(() => {});
    fetchAll();
  };

  const STAT_CARDS = [
    { label: "Xodimlar",          value: loading ? "..." : stats.total_users,     color: "#aa3bff", Icon: IcoUsers },
    { label: "Materiallar",       value: loading ? "..." : stats.total_materials, color: "#3b82f6", Icon: IcoBook },
    { label: "Tugatgan xodimlar", value: loading ? "..." : stats.completed_users, color: "#10b981", Icon: IcoCheckCircle },
    { label: "Quiz savollar",     value: loading ? "..." : questions.length,       color: "#f59e0b", Icon: IcoBarChart },
  ];

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Admin Panel</h1>
          <p style={S.sub}>Korporativ xavfsizlik platformasini boshqarish</p>
        </div>
        <div style={S.adminBadge}><IcoShield size={14} /> Administrator</div>
      </div>

      {/* Stats */}
      <div style={S.statsGrid}>
        {STAT_CARDS.map(s => (
          <div key={s.label} style={{ ...S.stat, borderLeft: `4px solid ${s.color}` }}>
            <div style={{ ...S.statIcon, color: s.color, background: s.color + "15" }}><s.Icon size={20} /></div>
            <div>
              <div style={S.statVal}>{s.value}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {[
          { key: "users",     label: `Xodimlar (${users.filter(u => u.role !== "admin").length})` },
          { key: "materials", label: `Materiallar (${materials.length})` },
          { key: "questions", label: `Quiz Savollar (${questions.length})` },
        ].map(t => (
          <button key={t.key} style={{ ...S.tab, ...(tab === t.key ? S.tabActive : {}) }} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* USERS TAB */}
      {tab === "users" && (
        <div style={S.card}>
          <div style={S.cardHead}>
            <h3 style={{ ...S.cardTitle, margin: 0 }}>Xodimlar ro'yxati</h3>
            <button style={S.addBtn} onClick={() => setShowForm(v => !v)}>
              <IcoPlus size={14} /> Xodim qo'shish
            </button>
          </div>

          {showForm && (
            <div style={S.form}>
              {formErr && <div style={S.formErr}>{formErr}</div>}
              <div style={S.formRow}>
                <input style={S.inp} placeholder="Username *" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
                <input style={S.inp} placeholder="Parol *" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div style={S.formRow}>
                <input style={S.inp} placeholder="To'liq ism" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                <input style={S.inp} placeholder="Bo'lim (IT, HR...)" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
              </div>
              <div style={S.formRow}>
                <select style={S.inp} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="employee">Xodim</option>
                  <option value="admin">Administrator</option>
                </select>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={S.saveBtn} onClick={handleAddUser} disabled={saving}>{saving ? "..." : "Saqlash"}</button>
                  <button style={S.cancelBtn} onClick={() => setShowForm(false)}>Bekor</button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div style={S.loadingBox}>Yuklanmoqda...</div>
          ) : users.filter(u => u.role !== "admin").length === 0 ? (
            <div style={S.emptyBox}><div style={S.emptyIcon}><IcoUsers size={28} /></div><p>Xodimlar yo'q</p></div>
          ) : (
            <div style={S.list}>
              {users.filter(u => u.role !== "admin").map((u, i) => (
                <div key={u.id || i} style={S.userRow}>
                  <div style={S.userAvatar}>{(u.full_name || u.username || "U")[0].toUpperCase()}</div>
                  <div style={S.userInfo}>
                    <div style={S.userName}>{u.full_name || u.username}</div>
                    <div style={S.userMeta}>
                      <span style={S.userUsername}>@{u.username}</span>
                      {u.department && (
                        <span style={{ ...S.deptTag, background: deptColor(u.department) + "18", color: deptColor(u.department) }}>
                          {u.department}
                        </span>
                      )}
                    </div>
                  </div>
                  <button style={S.delBtn} onClick={() => handleDeleteUser(u.id)} title="O'chirish">
                    <IcoX size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MATERIALS TAB */}
      {tab === "materials" && (
        <div style={S.card}>
          <div style={S.cardHead}>
            <h3 style={{ ...S.cardTitle, margin: 0 }}>Materiallar ro'yxati</h3>
            <button style={S.addBtn} onClick={() => setShowMatForm(v => !v)}>
              <IcoPlus size={14} /> Material qo'shish
            </button>
          </div>

          {showMatForm && (
            <div style={S.form}>
              {matErr && <div style={S.formErr}>{matErr}</div>}
              <div style={S.formRow}>
                <input style={S.inp} placeholder="Sarlavha *" value={matForm.title} onChange={e => setMatForm(f => ({ ...f, title: e.target.value }))} />
                <select style={S.inp} value={matForm.category} onChange={e => setMatForm(f => ({ ...f, category: e.target.value }))}>
                  <option>Xavfsizlik Siyosati</option>
                  <option>Fishing va Firibgarlik</option>
                  <option>Parol Xavfsizligi</option>
                  <option>Qurilma Xavfsizligi</option>
                  <option>Hodisa Boshqaruvi</option>
                  <option>Umumiy</option>
                </select>
              </div>
              <input style={{ ...S.inp, width: "100%", marginBottom: "10px" }} placeholder="YouTube URL *" value={matForm.video_url} onChange={e => setMatForm(f => ({ ...f, video_url: e.target.value }))} />
              <input style={{ ...S.inp, width: "100%", marginBottom: "10px" }} placeholder="Tavsif (ixtiyoriy)" value={matForm.description} onChange={e => setMatForm(f => ({ ...f, description: e.target.value }))} />
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={S.saveBtn} onClick={handleAddMaterial} disabled={matSaving}>{matSaving ? "..." : "Saqlash"}</button>
                <button style={S.cancelBtn} onClick={() => setShowMatForm(false)}>Bekor</button>
              </div>
            </div>
          )}

          {loading ? (
            <div style={S.loadingBox}>Yuklanmoqda...</div>
          ) : materials.length === 0 ? (
            <div style={S.emptyBox}><div style={S.emptyIcon}><IcoInbox size={28} /></div><p>Materiallar yo'q</p></div>
          ) : (
            <div style={S.list}>
              {materials.map((m, i) => (
                <div key={m.id || i} style={S.matRow}>
                  <div style={S.matNum}>{i + 1}</div>
                  <div style={S.matInfo}>
                    <div style={S.matTitle}>{m.title}</div>
                    <div style={S.matMeta}>
                      <span style={S.catTag}>{m.category || "Umumiy"}</span>
                      {m.description && <span style={S.matDesc}>{m.description.slice(0, 60)}...</span>}
                    </div>
                  </div>
                  <button style={S.delBtn} onClick={() => handleDeleteMaterial(m.id)} title="O'chirish">
                    <IcoX size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* QUESTIONS TAB */}
      {tab === "questions" && (
        <div style={S.card}>
          <div style={S.cardHead}>
            <h3 style={{ ...S.cardTitle, margin: 0 }}>Quiz Savollar</h3>
            <button style={S.addBtn} onClick={() => setShowQForm(v => !v)}>
              <IcoPlus size={14} /> Savol qo'shish
            </button>
          </div>

          {showQForm && (
            <div style={S.form}>
              {qErr && <div style={S.formErr}>{qErr}</div>}
              <textarea
                style={{ ...S.inp, width: "100%", minHeight: "72px", resize: "vertical", marginBottom: "10px" }}
                placeholder="Savol matni *"
                value={qForm.question}
                onChange={e => setQForm(f => ({ ...f, question: e.target.value }))}
              />
              <div style={S.formRow}>
                <div style={S.optWrap}>
                  <span style={S.optLabel}>A</span>
                  <input style={S.inp} placeholder="Variant A *" value={qForm.option_a} onChange={e => setQForm(f => ({ ...f, option_a: e.target.value }))} />
                </div>
                <div style={S.optWrap}>
                  <span style={S.optLabel}>B</span>
                  <input style={S.inp} placeholder="Variant B *" value={qForm.option_b} onChange={e => setQForm(f => ({ ...f, option_b: e.target.value }))} />
                </div>
              </div>
              <div style={S.formRow}>
                <div style={S.optWrap}>
                  <span style={S.optLabel}>C</span>
                  <input style={S.inp} placeholder="Variant C *" value={qForm.option_c} onChange={e => setQForm(f => ({ ...f, option_c: e.target.value }))} />
                </div>
                <div style={S.optWrap}>
                  <span style={{ ...S.optLabel, background: "#10b981" }}>✓</span>
                  <select style={S.inp} value={qForm.answer} onChange={e => setQForm(f => ({ ...f, answer: e.target.value }))}>
                    <option value="0">To'g'ri javob: A</option>
                    <option value="1">To'g'ri javob: B</option>
                    <option value="2">To'g'ri javob: C</option>
                  </select>
                </div>
              </div>
              <div style={S.formRow}>
                <input style={S.inp} placeholder="Izoh (ixtiyoriy)" value={qForm.explanation} onChange={e => setQForm(f => ({ ...f, explanation: e.target.value }))} />
                <select style={S.inp} value={qForm.category} onChange={e => setQForm(f => ({ ...f, category: e.target.value }))}>
                  <option>Xavfsizlik Siyosati</option>
                  <option>Fishing va Firibgarlik</option>
                  <option>Parol Xavfsizligi</option>
                  <option>Qurilma Xavfsizligi</option>
                  <option>Hodisa Boshqaruvi</option>
                  <option>Umumiy</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button style={S.saveBtn} onClick={handleAddQuestion} disabled={qSaving}>{qSaving ? "..." : "Saqlash"}</button>
                <button style={S.cancelBtn} onClick={() => setShowQForm(false)}>Bekor</button>
              </div>
            </div>
          )}

          {loading ? (
            <div style={S.loadingBox}>Yuklanmoqda...</div>
          ) : questions.length === 0 ? (
            <div style={S.emptyBox}><div style={S.emptyIcon}><IcoInbox size={28} /></div><p>Savollar yo'q</p></div>
          ) : (
            <div style={S.list}>
              {questions.map((q, i) => (
                <div key={q.id || i} style={S.qRow}>
                  <div style={S.matNum}>{i + 1}</div>
                  <div style={S.matInfo}>
                    <div style={S.matTitle}>{q.question}</div>
                    <div style={S.matMeta}>
                      <span style={S.catTag}>{q.category || "Umumiy"}</span>
                      {(q.options || []).map((opt, oi) => (
                        <span key={oi} style={{ ...S.optChip, background: oi === q.answer ? "#10b98118" : undefined, color: oi === q.answer ? "#10b981" : undefined, border: oi === q.answer ? "1px solid #10b98133" : undefined }}>
                          {["A","B","C"][oi]}: {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button style={S.delBtn} onClick={() => handleDeleteQuestion(q.id)}><IcoX size={13} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const S = {
  page: { display: "flex", flexDirection: "column", gap: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" },
  title: { fontSize: "24px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 4px" },
  sub:   { fontSize: "14px", color: "var(--text)" },
  adminBadge: { display: "flex", alignItems: "center", gap: "7px", background: "var(--accent-light)", color: "var(--accent)", borderRadius: "99px", padding: "7px 16px", fontSize: "13px", fontWeight: 700 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: "16px" },
  stat: { background: "var(--card-bg)", borderRadius: "var(--radius-md)", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "var(--shadow-sm)" },
  statIcon: { width: "42px", height: "42px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statVal:   { fontSize: "22px", fontWeight: 800, color: "var(--text-h)", lineHeight: 1 },
  statLabel: { fontSize: "12px", color: "var(--text-muted)", marginTop: "3px", fontWeight: 600 },
  tabs: { display: "flex", gap: "8px" },
  tab: { padding: "9px 20px", border: "1.5px solid var(--border)", borderRadius: "99px", background: "var(--card-bg)", fontSize: "13px", fontWeight: 600, color: "var(--text)", cursor: "pointer" },
  tabActive: { background: "var(--accent-light)", borderColor: "var(--accent)", color: "var(--accent)" },
  card: { background: "var(--card-bg)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-md)" },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  cardTitle: { fontSize: "15px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 16px" },
  addBtn: { display: "flex", alignItems: "center", gap: "7px", padding: "8px 16px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  form: { background: "#f8f9fb", borderRadius: "10px", padding: "16px", marginBottom: "20px", border: "1.5px solid var(--border)" },
  formRow: { display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" },
  formErr: { background: "#fef2f2", color: "#dc2626", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", marginBottom: "10px" },
  inp: { flex: 1, padding: "9px 12px", border: "1.5px solid var(--border)", borderRadius: "7px", fontSize: "13px", outline: "none", minWidth: "140px" },
  saveBtn: { padding: "9px 20px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 700, cursor: "pointer" },
  cancelBtn: { padding: "9px 16px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: "7px", fontSize: "13px", cursor: "pointer" },
  list: { display: "flex", flexDirection: "column" },
  userRow: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border)" },
  userAvatar: { width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg,#aa3bff,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "15px", fontWeight: 700, flexShrink: 0 },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { fontSize: "13px", fontWeight: 700, color: "var(--text-h)" },
  userMeta: { display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" },
  userUsername: { fontSize: "11px", color: "var(--text-muted)" },
  deptTag: { borderRadius: "99px", padding: "2px 8px", fontSize: "10px", fontWeight: 700 },
  delBtn: { background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer", display: "flex" },
  matRow: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border)" },
  matNum: { width: "28px", height: "28px", borderRadius: "7px", background: "var(--accent-light)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 },
  matInfo: { flex: 1, minWidth: 0 },
  matTitle: { fontSize: "13px", fontWeight: 700, color: "var(--text-h)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  matMeta: { display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" },
  catTag: { background: "var(--accent-light)", color: "var(--accent)", borderRadius: "99px", padding: "2px 8px", fontSize: "10px", fontWeight: 700, flexShrink: 0 },
  matDesc: { fontSize: "11px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  loadingBox: { textAlign: "center", color: "var(--text-muted)", padding: "20px", fontSize: "14px" },
  emptyBox:   { textAlign: "center", color: "var(--text-muted)", padding: "24px", fontSize: "14px" },
  emptyIcon:  { display: "flex", justifyContent: "center", marginBottom: "8px" },
  qRow: { display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border)" },
  optWrap: { display: "flex", alignItems: "center", gap: "8px", flex: 1 },
  optLabel: { width: "24px", height: "24px", borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, flexShrink: 0 },
  optChip: { borderRadius: "99px", padding: "2px 8px", fontSize: "10px", fontWeight: 600, background: "var(--border)", color: "var(--text-muted)", border: "1px solid transparent" },
};