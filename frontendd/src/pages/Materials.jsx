import { useEffect, useState } from "react";
import API from "../api";
import { IcoCheck, IcoInbox } from "../components/Icons";

const getVideoId = (url) => {
  if (!url) return "";
  if (url.includes("youtu.be")) return url.split("/").pop().split("?")[0];
  const m = url.match(/v=([^&]+)/);
  return m ? m[1] : "";
};

const SpinnerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ animation: "spin 0.7s linear infinite" }}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

export default function Materials() {
  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [watched, setWatched] = useState([]);
  const [filter, setFilter] = useState("all");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    API.get("/materials")
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  const markWatched = async (id) => {
    setLoadingId(id);
    try {
      await API.post(`/confirm/${id}`);
      setWatched(prev => [...prev, id]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = filter === "watched"
    ? data.filter(m => watched.includes(m.id))
    : filter === "unwatched"
    ? data.filter(m => !watched.includes(m.id))
    : data;

  const watchedCount = data.filter(m => watched.includes(m.id)).length;
  const pct = data.length > 0 ? Math.round((watchedCount / data.length) * 100) : 0;

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Xavfsizlik Materiallari</h1>
          <p style={S.sub}>Video darslar orqali kiberhavfsizlikni o'rganing</p>
        </div>
        <div style={S.progressMini}>
          <div style={S.progressLabel}>
            <span>{watchedCount}/{data.length} ko'rilgan</span>
            <span style={{ color: "#aa3bff", fontWeight: 700 }}>{pct}%</span>
          </div>
          <div style={S.miniBar}>
            <div style={{ ...S.miniBarFill, width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={S.tabs}>
        {[
          { key: "all",       label: "Barchasi",    count: data.length },
          { key: "unwatched", label: "Ko'rilmagan", count: data.filter(m => !watched.includes(m.id)).length },
          { key: "watched",   label: "Ko'rilgan",   count: watchedCount },
        ].map(t => (
          <button
            key={t.key}
            style={{ ...S.tab, ...(filter === t.key ? S.tabActive : {}) }}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
            <span style={{ ...S.tabCount, ...(filter === t.key ? S.tabCountActive : {}) }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {fetching ? (
        <div style={S.skeletonGrid}>
          {[1, 2, 3].map(i => <div key={i} style={S.skeleton} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={S.empty}>
          <div style={S.emptyIconWrap}>
            <IcoInbox size={32} style={{ color: "var(--text-muted)" }} />
          </div>
          <p style={S.emptyText}>Bu bo'limda material yo'q</p>
        </div>
      ) : (
        <div style={S.grid}>
          {filtered.map((m) => {
            const videoId = getVideoId(m.video_url);
            const isWatched = watched.includes(m.id);
            const isLoading = loadingId === m.id;

            return (
              <div key={m.id} className="mat-card" style={{
                ...S.card,
                ...(isWatched ? S.cardWatched : {})
              }}>
                <div style={S.videoWrap}>
                  <iframe
                    width="100%" height="185"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    allowFullScreen style={S.iframe}
                    title={m.title}
                  />
                  {isWatched && (
                    <div style={S.watchedBadge}>
                      <IcoCheck size={11} />
                      Ko'rilgan
                    </div>
                  )}
                </div>

                <div style={S.cardBody}>
                  <h3 style={S.cardTitle}>{m.title}</h3>
                  {m.description && <p style={S.cardDesc}>{m.description}</p>}

                  <button
                    disabled={isLoading || isWatched}
                    onClick={() => markWatched(m.id)}
                    style={{
                      ...S.btn,
                      ...(isWatched ? S.btnWatched : isLoading ? S.btnLoading : S.btnDefault),
                    }}
                  >
                    {isWatched ? (
                      <><IcoCheck size={13} /> Ko'rilgan</>
                    ) : isLoading ? (
                      <><SpinnerIcon /> Yuklanmoqda...</>
                    ) : (
                      <><IcoCheck size={13} /> Ko'rildi deb belgilash</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const S = {
  page: { display: "flex", flexDirection: "column", gap: "24px" },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", flexWrap: "wrap", gap: "16px",
  },
  title: { fontSize: "24px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 4px" },
  sub:   { fontSize: "14px", color: "var(--text)" },
  progressMini: {
    background: "var(--card-bg)", borderRadius: "var(--radius-md)",
    padding: "12px 16px", boxShadow: "var(--shadow-sm)", minWidth: "180px",
  },
  progressLabel: {
    display: "flex", justifyContent: "space-between",
    fontSize: "12px", color: "var(--text)", marginBottom: "8px",
  },
  miniBar: { height: "6px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" },
  miniBarFill: {
    height: "100%",
    background: "linear-gradient(90deg,#aa3bff,#7c3aed)",
    borderRadius: "99px", transition: "width 0.6s",
  },

  tabs: { display: "flex", gap: "8px", flexWrap: "wrap" },
  tab: {
    display: "flex", alignItems: "center", gap: "7px",
    padding: "8px 16px", border: "1.5px solid var(--border)",
    borderRadius: "99px", background: "var(--card-bg)",
    fontSize: "13px", fontWeight: 600, color: "var(--text)",
    cursor: "pointer", transition: "all 0.15s",
  },
  tabActive: {
    background: "var(--accent-light)", borderColor: "var(--accent)", color: "var(--accent)",
  },
  tabCount: {
    background: "var(--border)", color: "var(--text-muted)",
    borderRadius: "99px", padding: "1px 7px", fontSize: "11px", fontWeight: 700,
  },
  tabCountActive: { background: "var(--accent)", color: "#fff" },

  skeletonGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "16px" },
  skeleton: {
    height: "320px", background: "var(--card-bg)",
    borderRadius: "var(--radius-md)", animation: "pulse 1.5s ease-in-out infinite",
  },
  empty: { textAlign: "center", padding: "60px 20px" },
  emptyIconWrap: {
    width: "64px", height: "64px",
    background: "var(--border)", borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 12px",
  },
  emptyText: { color: "var(--text-muted)", fontSize: "15px" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  card: {
    background: "var(--card-bg)", borderRadius: "var(--radius-lg)",
    overflow: "hidden", boxShadow: "var(--shadow-md)",
    border: "1.5px solid transparent",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardWatched: {
    border: "1.5px solid rgba(16,185,129,0.3)",
    boxShadow: "0 4px 20px rgba(16,185,129,0.08)",
  },
  videoWrap: { position: "relative" },
  iframe: { display: "block" },
  watchedBadge: {
    position: "absolute", top: "10px", right: "10px",
    background: "#10b981", color: "#fff",
    borderRadius: "99px", padding: "4px 10px",
    fontSize: "11px", fontWeight: 700,
    display: "flex", alignItems: "center", gap: "5px",
    boxShadow: "0 2px 8px rgba(16,185,129,0.4)",
  },
  cardBody: { padding: "16px" },
  cardTitle: { fontSize: "15px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 6px" },
  cardDesc:  { fontSize: "13px", color: "var(--text)", lineHeight: 1.5, marginBottom: "4px" },

  btn: {
    width: "100%", marginTop: "12px",
    padding: "11px", border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: "13px", fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
    transition: "opacity 0.2s",
  },
  btnDefault: { background: "var(--accent)", color: "#fff", boxShadow: "0 4px 14px rgba(170,59,255,0.3)" },
  btnWatched: { background: "var(--success-light)", color: "var(--success)", cursor: "default" },
  btnLoading: { background: "var(--accent-light)", color: "var(--accent)", cursor: "wait" },
};
