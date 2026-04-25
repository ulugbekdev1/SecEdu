import { useEffect, useState, useRef } from "react";
import API from "../api";
import { IcoCheck, IcoInbox, IcoDownload, IcoFile } from "../components/Icons";

const API_BASE = "http://127.0.0.1:8000";

// Module-level YouTube IFrame API loader (singleton)
let _ytPromise = null;
function ensureYT() {
  if (_ytPromise) return _ytPromise;
  _ytPromise = new Promise(resolve => {
    if (window.YT?.Player) { resolve(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(); };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(s);
  });
  return _ytPromise;
}

function getVideoId(url) {
  if (!url) return "";
  if (url.includes("youtu.be")) return url.split("/").pop().split("?")[0];
  const m = url.match(/v=([^&]+)/);
  return m ? m[1] : "";
}

function VideoEmbed({ videoId, materialId, watched, onEnded }) {
  const divRef = useRef(null);
  const playerRef = useRef(null);
  const watchedRef = useRef(watched);
  useEffect(() => { watchedRef.current = watched; }, [watched]);

  useEffect(() => {
    if (!videoId) return;
    let dead = false;
    ensureYT().then(() => {
      if (dead || !divRef.current || playerRef.current) return;
      playerRef.current = new window.YT.Player(divRef.current, {
        videoId,
        height: "185",
        width: "100%",
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (e) => {
            // state 0 = video ended
            if (e.data === 0 && !watchedRef.current) onEnded(materialId);
          },
        },
      });
    });
    return () => {
      dead = true;
      try { playerRef.current?.destroy(); } catch {}
      playerRef.current = null;
    };
  }, [videoId]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={divRef} style={{ width: "100%", height: "185px" }} />
      {watched && (
        <div style={S.watchedBadge}>
          <IcoCheck size={11} /> Ko'rilgan
        </div>
      )}
    </div>
  );
}

export default function Materials() {
  const [data,      setData]      = useState([]);
  const [watched,   setWatched]   = useState(new Set());
  const [filter,    setFilter]    = useState("all");
  const [fetching,  setFetching]  = useState(true);
  const [markingId, setMarkingId] = useState(null);

  useEffect(() => {
    Promise.all([
      API.get("/materials"),
      API.get("/progress/me").catch(() => ({ data: { watched_ids: [] } })),
    ]).then(([mRes, pRes]) => {
      setData(mRes.data);
      setWatched(new Set(pRes.data.watched_ids || []));
    }).catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  const markWatched = async (id) => {
    if (watched.has(id) || markingId === id) return;
    setMarkingId(id);
    try {
      await API.post(`/confirm/${id}`);
      setWatched(prev => new Set([...prev, id]));
    } catch {}
    finally { setMarkingId(null); }
  };

  const filtered = filter === "watched"
    ? data.filter(m => watched.has(m.id))
    : filter === "unwatched"
    ? data.filter(m => !watched.has(m.id))
    : data;

  const watchedCount = data.filter(m => watched.has(m.id)).length;
  const pct = data.length > 0 ? Math.round((watchedCount / data.length) * 100) : 0;

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Xavfsizlik Materiallari</h1>
          <p style={S.sub}>Video darsni to'liq ko'ring — avtomatik belgilanadi</p>
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

      <div style={S.tabs}>
        {[
          { key: "all",       label: "Barchasi",    count: data.length },
          { key: "unwatched", label: "Ko'rilmagan", count: data.filter(m => !watched.has(m.id)).length },
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
          <div style={S.emptyIconWrap}><IcoInbox size={32} /></div>
          <p style={S.emptyText}>Bu bo'limda material yo'q</p>
        </div>
      ) : (
        <div style={S.grid}>
          {filtered.map((m) => {
            const videoId = getVideoId(m.video_url);
            const isWatched = watched.has(m.id);
            return (
              <div key={m.id} className="mat-card" style={{ ...S.card, ...(isWatched ? S.cardWatched : {}) }}>
                {videoId ? (
                  <VideoEmbed
                    videoId={videoId}
                    materialId={m.id}
                    watched={isWatched}
                    onEnded={markWatched}
                  />
                ) : (
                  <div style={S.noVideoBox}>
                    <IcoFile size={32} style={{ color: "var(--text-muted)" }} />
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>Video yo'q</span>
                  </div>
                )}

                <div style={S.cardBody}>
                  <div style={S.cardTopRow}>
                    <span style={S.catTag}>{m.category || "Umumiy"}</span>
                    {isWatched ? (
                      <span style={S.donePill}><IcoCheck size={10} /> Ko'rilgan</span>
                    ) : videoId ? (
                      <span style={S.hintPill}>Videoni to'liq ko'ring</span>
                    ) : null}
                  </div>
                  <h3 style={S.cardTitle}>{m.title}</h3>
                  {m.description && <p style={S.cardDesc}>{m.description}</p>}

                  {/* Download button */}
                  {m.file_path && (
                    <a
                      href={`${API_BASE}/files/${m.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      style={S.downloadBtn}
                    >
                      <IcoDownload size={13} /> Faylni yuklab olish
                    </a>
                  )}

                  {/* Manual mark button only for file-only materials (no video) */}
                  {!videoId && !isWatched && (
                    <button
                      disabled={markingId === m.id}
                      onClick={() => markWatched(m.id)}
                      style={{ ...S.btn, ...(markingId === m.id ? S.btnLoading : S.btnDefault) }}
                    >
                      <IcoCheck size={13} />
                      {markingId === m.id ? "Yuklanmoqda..." : "Ko'rildi deb belgilash"}
                    </button>
                  )}
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" },
  title: { fontSize: "24px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 4px" },
  sub:   { fontSize: "14px", color: "var(--text)" },
  progressMini: { background: "var(--card-bg)", borderRadius: "var(--radius-md)", padding: "12px 16px", boxShadow: "var(--shadow-sm)", minWidth: "180px" },
  progressLabel: { display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text)", marginBottom: "8px" },
  miniBar: { height: "6px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" },
  miniBarFill: { height: "100%", background: "linear-gradient(90deg,#aa3bff,#7c3aed)", borderRadius: "99px", transition: "width 0.6s" },
  tabs: { display: "flex", gap: "8px", flexWrap: "wrap" },
  tab: { display: "flex", alignItems: "center", gap: "7px", padding: "8px 16px", border: "1.5px solid var(--border)", borderRadius: "99px", background: "var(--card-bg)", fontSize: "13px", fontWeight: 600, color: "var(--text)", cursor: "pointer" },
  tabActive: { background: "var(--accent-light)", borderColor: "var(--accent)", color: "var(--accent)" },
  tabCount: { background: "var(--border)", color: "var(--text-muted)", borderRadius: "99px", padding: "1px 7px", fontSize: "11px", fontWeight: 700 },
  tabCountActive: { background: "var(--accent)", color: "#fff" },
  skeletonGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "16px" },
  skeleton: { height: "320px", background: "var(--card-bg)", borderRadius: "var(--radius-md)", animation: "pulse 1.5s ease-in-out infinite" },
  empty: { textAlign: "center", padding: "60px 20px" },
  emptyIconWrap: { width: "64px", height: "64px", background: "var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" },
  emptyText: { color: "var(--text-muted)", fontSize: "15px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  card: { background: "var(--card-bg)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)", border: "1.5px solid transparent", transition: "transform 0.2s, box-shadow 0.2s" },
  cardWatched: { border: "1.5px solid rgba(16,185,129,0.3)", boxShadow: "0 4px 20px rgba(16,185,129,0.08)" },
  noVideoBox: { height: "185px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f3f4f6" },
  watchedBadge: { position: "absolute", top: "10px", right: "10px", background: "#10b981", color: "#fff", borderRadius: "99px", padding: "4px 10px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "5px", boxShadow: "0 2px 8px rgba(16,185,129,0.4)" },
  cardBody: { padding: "16px" },
  cardTopRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" },
  catTag: { background: "var(--accent-light)", color: "var(--accent)", borderRadius: "99px", padding: "2px 9px", fontSize: "10px", fontWeight: 700 },
  donePill: { background: "#10b98115", color: "#10b981", borderRadius: "99px", padding: "2px 9px", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" },
  hintPill: { background: "#f59e0b15", color: "#f59e0b", borderRadius: "99px", padding: "2px 9px", fontSize: "10px", fontWeight: 700 },
  cardTitle: { fontSize: "15px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 6px" },
  cardDesc:  { fontSize: "13px", color: "var(--text)", lineHeight: 1.5, marginBottom: "4px" },
  downloadBtn: { marginTop: "12px", width: "100%", padding: "10px", border: "1.5px solid var(--accent)", borderRadius: "var(--radius-sm)", background: "var(--accent-light)", color: "var(--accent)", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", textDecoration: "none" },
  btn: { width: "100%", marginTop: "10px", padding: "11px", border: "none", borderRadius: "var(--radius-sm)", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" },
  btnDefault: { background: "var(--accent)", color: "#fff", boxShadow: "0 4px 14px rgba(170,59,255,0.3)" },
  btnLoading: { background: "var(--accent-light)", color: "var(--accent)", cursor: "wait" },
};