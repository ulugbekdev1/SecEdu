import { useState, useEffect } from "react";
import API from "../api";
import { IcoAward, IcoStar, IcoBook, IcoCheck, IcoX, IcoInfo, IcoRefresh } from "../components/Icons";

const getResult = (score, total) => {
  const pct = total > 0 ? (score / total) * 100 : 0;
  if (pct === 100) return { label: "Mukammal!",         color: "#10b981", Icon: IcoAward, sub: "Siz xavfsizlik siyosatini a'lo bilasiz!" };
  if (pct >= 70)  return { label: "Yaxshi!",            color: "#aa3bff", Icon: IcoStar,  sub: "Bilimingizni yanada mustahkamlang!" };
  return               { label: "Yana urinib ko'ring", color: "#f59e0b", Icon: IcoBook,  sub: "Materiallarni o'qib, qaytadan ishlang!" };
};

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [current,   setCurrent]   = useState(0);
  const [score,     setScore]     = useState(0);
  const [selected,  setSelected]  = useState(null);
  const [answered,  setAnswered]  = useState(false);
  const [finished,  setFinished]  = useState(false);

  useEffect(() => {
    API.get("/questions")
      .then(res => setQuestions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAnswer = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === questions[current].answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      API.post(`/quiz-result?score=${score}&total=${questions.length}`).catch(() => {});
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0); setScore(0);
    setSelected(null); setAnswered(false); setFinished(false);
  };

  if (loading) return (
    <div style={S.page}>
      <div style={S.loadingWrap}>
        <div style={S.spinner} />
        <p style={{ color: "var(--text-muted)", marginTop: 12 }}>Savollar yuklanmoqda...</p>
      </div>
    </div>
  );

  if (questions.length === 0) return (
    <div style={S.page}>
      <div style={S.emptyWrap}>
        <p style={S.emptyText}>Hozircha savollar yo'q. Admin panel orqali qo'shing.</p>
      </div>
    </div>
  );

  const q = questions[current];
  const pct = Math.round((current / questions.length) * 100);
  const result = getResult(score, questions.length);

  if (finished) {
    const { Icon: ResultIcon } = result;
    return (
      <div style={S.page}>
        <div style={S.resultWrap}>
          <div style={{ ...S.resultIconBox, background: result.color + "15", color: result.color }}>
            <ResultIcon size={36} />
          </div>
          <h2 style={{ ...S.resultTitle, color: result.color }}>{result.label}</h2>
          <p style={S.resultSub}>{result.sub}</p>
          <div style={{ ...S.scoreBox, borderColor: result.color + "40", background: result.color + "10" }}>
            <span style={{ ...S.scoreNum, color: result.color }}>{score}</span>
            <span style={S.scoreDivider}>/</span>
            <span style={S.scoreTotal}>{questions.length}</span>
          </div>
          <p style={S.scoreHint}>to'g'ri javob</p>
          <div style={S.breakdown}>
            {questions.map((_, i) => (
              <div key={i} style={{ ...S.dot, background: i < score ? "#10b981" : "var(--border)" }} />
            ))}
          </div>
          <button style={S.restartBtn} onClick={handleRestart}>
            <IcoRefresh size={15} /> Qayta boshlash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Xavfsizlik Siyosati Quiz</h1>
          <p style={S.sub}>Korporativ xavfsizlik bilimingizni sinab ko'ring</p>
        </div>
        <div style={S.counter}>
          <span style={S.counterNum}>{current + 1}</span>
          <span style={S.counterSep}>/</span>
          <span style={S.counterTotal}>{questions.length}</span>
        </div>
      </div>

      <div style={S.barTrack}>
        <div style={{ ...S.barFill, width: `${pct}%` }} />
      </div>

      <div style={S.card}>
        <div style={S.qMeta}>
          <span style={S.qNum}>Savol {current + 1}</span>
          {q.category && <span style={S.qCat}>{q.category}</span>}
        </div>
        <h2 style={S.question}>{q.question}</h2>

        <div style={S.options}>
          {(q.options || []).map((opt, i) => {
            let st = { ...S.option };
            if (answered) {
              if (i === q.answer)                     st = { ...st, ...S.optionCorrect };
              else if (i === selected)                st = { ...st, ...S.optionWrong };
              else                                    st = { ...st, ...S.optionDim };
            }
            return (
              <button key={i} className={!answered ? "quiz-option" : ""} style={st} onClick={() => handleAnswer(i)}>
                <span style={{
                  ...S.optLetter,
                  ...(answered && i === q.answer ? S.optLetterCorrect : {}),
                  ...(answered && i === selected && i !== q.answer ? S.optLetterWrong : {}),
                }}>
                  {["A","B","C","D"][i]}
                </span>
                <span style={S.optText}>{opt}</span>
                {answered && i === q.answer && <span style={S.mark}><IcoCheck size={13} /></span>}
                {answered && i === selected && i !== q.answer && <span style={{ ...S.mark, color: "#dc2626" }}><IcoX size={13} /></span>}
              </button>
            );
          })}
        </div>

        {answered && q.explanation && (
          <div style={{
            ...S.explanation,
            background: selected === q.answer ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
            borderColor: selected === q.answer ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)",
          }}>
            <span style={{ color: selected === q.answer ? "#10b981" : "#f59e0b", display: "flex", flexShrink: 0, marginTop: "1px" }}>
              {selected === q.answer ? <IcoCheck size={14} /> : <IcoInfo size={14} />}
            </span>
            {q.explanation}
          </div>
        )}

        {answered && (
          <button style={S.nextBtn} onClick={handleNext}>
            {current + 1 < questions.length ? "Keyingi savol" : "Natijani ko'rish"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        )}
      </div>

      <div style={S.scoreSoFar}>
        <span>Hozircha: </span>
        <strong style={{ color: "#aa3bff" }}>{score} to'g'ri</strong>
        <span> / {current} savol</span>
      </div>
    </div>
  );
}

const S = {
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  loadingWrap: { textAlign: "center", padding: "60px 0" },
  spinner: { width: "36px", height: "36px", border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto" },
  emptyWrap: { textAlign: "center", padding: "60px 0" },
  emptyText: { color: "var(--text-muted)", fontSize: "15px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" },
  title: { fontSize: "24px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 4px" },
  sub:   { fontSize: "14px", color: "var(--text)" },
  counter: { background: "var(--card-bg)", borderRadius: "var(--radius-md)", padding: "10px 18px", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "baseline", gap: "4px" },
  counterNum:   { fontSize: "22px", fontWeight: 800, color: "var(--accent)" },
  counterSep:   { fontSize: "16px", color: "var(--text-muted)" },
  counterTotal: { fontSize: "16px", color: "var(--text-muted)", fontWeight: 600 },
  barTrack: { height: "6px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" },
  barFill: { height: "100%", background: "linear-gradient(90deg,#aa3bff,#7c3aed)", borderRadius: "99px", transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" },
  card: { background: "var(--card-bg)", borderRadius: "var(--radius-lg)", padding: "28px 28px 24px", boxShadow: "var(--shadow-md)" },
  qMeta: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" },
  qNum: { fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--accent)", textTransform: "uppercase" },
  qCat: { background: "var(--accent-light)", color: "var(--accent)", borderRadius: "99px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 },
  question: { fontSize: "20px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 24px", lineHeight: 1.4 },
  options: { display: "flex", flexDirection: "column", gap: "10px" },
  option: { display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", background: "#fafafa", cursor: "pointer", textAlign: "left", transition: "all 0.18s", width: "100%" },
  optionCorrect: { background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.5)", cursor: "default" },
  optionWrong:   { background: "rgba(220,38,38,0.06)",  borderColor: "rgba(220,38,38,0.4)",  cursor: "default" },
  optionDim:     { opacity: 0.4, cursor: "default" },
  optLetter: { width: "28px", height: "28px", flexShrink: 0, background: "var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "var(--text)", transition: "all 0.2s" },
  optLetterCorrect: { background: "#10b981", color: "#fff" },
  optLetterWrong:   { background: "#dc2626", color: "#fff" },
  optText: { flex: 1, fontSize: "14px", fontWeight: 500, color: "var(--text-h)" },
  mark: { color: "#10b981", display: "flex" },
  explanation: { marginTop: "20px", padding: "14px 16px", borderRadius: "var(--radius-sm)", border: "1.5px solid", fontSize: "13px", color: "var(--text)", lineHeight: 1.6, display: "flex", gap: "10px", alignItems: "flex-start" },
  nextBtn: { marginTop: "20px", width: "100%", padding: "13px", background: "linear-gradient(135deg,#aa3bff,#7c3aed)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 16px rgba(170,59,255,0.3)" },
  scoreSoFar: { textAlign: "center", fontSize: "13px", color: "var(--text-muted)" },
  resultWrap: { background: "var(--card-bg)", borderRadius: "var(--radius-xl)", padding: "48px 32px", textAlign: "center", boxShadow: "var(--shadow-lg)", maxWidth: "440px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  resultIconBox: { width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  resultTitle: { fontSize: "28px", fontWeight: 800, margin: 0 },
  resultSub:   { color: "var(--text)", fontSize: "15px" },
  scoreBox: { display: "flex", alignItems: "baseline", gap: "6px", border: "2px solid", borderRadius: "var(--radius-lg)", padding: "16px 36px", marginTop: "8px" },
  scoreNum:    { fontSize: "52px", fontWeight: 900, lineHeight: 1 },
  scoreDivider:{ fontSize: "28px", color: "var(--text-muted)" },
  scoreTotal:  { fontSize: "28px", fontWeight: 700, color: "var(--text-muted)" },
  scoreHint:   { color: "var(--text-muted)", fontSize: "14px", margin: 0 },
  breakdown:   { display: "flex", gap: "8px", marginTop: "4px", flexWrap: "wrap", justifyContent: "center" },
  dot: { width: "12px", height: "12px", borderRadius: "50%", transition: "background 0.3s" },
  restartBtn: { marginTop: "12px", padding: "13px 28px", background: "linear-gradient(135deg,#aa3bff,#7c3aed)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" },
};