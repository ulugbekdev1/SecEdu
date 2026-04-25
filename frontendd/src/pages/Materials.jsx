import { useEffect, useState, useRef } from "react";
import API from "../api";
import { IcoCheck, IcoInbox, IcoDownload, IcoFile, IcoPlay } from "../components/Icons";

const API_BASE = "http://127.0.0.1:8000";

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
  const divRef    = useRef(null);
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
        height: "200",
        width: "100%",
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (e) => {
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
      <div ref={divRef} style={{ width: "100%", height: "200px" }} />
      {watched && (
        <div style={S.watchedBadge}><IcoCheck size={11} /> Ko'rilgan</div>
      )}
    </div>
  );
}

// File extension → icon color
function fileExt(name) {
  if (!name) return { label: "FILE", color: "#6b7280" };
  const ext = name.split(".").pop().toUpperCase();
  const colors = { PDF: "#dc2626", DOC: "#2563eb", DOCX: "#2563eb", PPTX: "#ea580c", XLSX: "#16a34a", ZIP: "#7c3aed", TXT: "#6b7280" };
  return { label: ext, color: colors[ext] || "#6b7280" };
}

export default function Materials() {
  const [data,      setData]      = useState([]);
  const [watched,   setWatched]   = useState(new Set());
  const [section,   setSection]   = useState("videos");
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

  const videos = data.filter(m => m.video_url);
  const files  = data.filter(m => m.file_path);

  const pool = section === "videos" ? videos : files;

  const filtered = filter === "watched"
    ? pool.filter(m => watched.has(m.id))
    : filter === "unwatched"
    ? pool.filter(m => !watched.has(m.id))
    : pool;

  const totalWatched = data.filter(m => watched.has(m.id)).length;
  const pct = data.length > 0 ? Math.round((totalWatched / data.length) * 100) : 0;

  const poolWatched = pool.filter(m => watched.has(m.id)).length;

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Xavfsizlik Materiallari</h1>
          <p style={S.sub}>Barcha materiallar bilan tanishing</p>
        </div>
        <div style={S.progressMini}>
          <div style={S.progressLabel}>
            <span>{totalWatched}/{data.length} bajarilgan</span>
            <span style={{ color: "#aa3bff", fontWeight: 700 }}>{pct}%</span>
          </div>
          <div style={S.miniBar}>
            <div style={{ ...S.miniBarFill, width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Section switcher */}
      <div style={S.sectionRow}>
        <button
          style={{ ...S.sectionBtn, ...(section === "videos" ? S.sectionBtnActive : {}) }}
          onClick={() => { setSection("videos"); setFilter("all"); }}
        >
          <IcoPlay size={14} />
          Video darsliklar
          <span style={{ ...S.sectionCount, ...(section === "videos" ? S.sectionCountActive : {}) }}>
            {videos.length}
          </span>
        </button>
        <button
          style={{ ...S.sectionBtn, ...(section === "files" ? S.sectionBtnActive : {}) }}
          onClick={() => { setSection("files"); setFilter("all"); }}
        >
          <IcoFile size={14} />
          Fayllar
          <span style={{ ...S.sectionCount, ...(section === "files" ? S.sectionCountActive : {}) }}>
            {files.length}
          </span>
        </button>
      </div>

      {/* Filter tabs */}
      <div style={S.tabs}>
        {[
          { key: "all",       label: "Barchasi",    count: pool.length },
          { key: "unwatched", label: section === "videos" ? "Ko'rilmagan" : "O'qilmagan", count: pool.filter(m => !watched.has(m.id)).length },
          { key: "watched",   label: section === "videos" ? "Ko'rilgan"   : "O'qilgan",   count: poolWatched },
        ].map(t => (
          <button
            key={t.key}
            style={{ ...S.tab, ...(filter === t.key ? S.tabActive : {}) }}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
            <span style={{ ...S.tabCount, ...(filter === t.key ? S.tabCountActive : {}) }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {fetching ? (
        <div style={S.skeletonGrid}>
          {[1, 2, 3].map(i => <div key={i} style={S.skeleton} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={S.empty}>
          <div style={S.emptyIconWrap}>
            {section === "videos" ? <IcoPlay size={28} /> : <IcoFile size={28} />}
          </div>
          <p style={S.emptyText}>
            {section === "videos" ? "Video darslik yo'q" : "Fayl yo'q"}
          </p>
        </div>
      ) : section === "videos" ? (
        /* ── VIDEO GRID ── */
        <div style={S.videoGrid}>
          {filtered.map(m => {
            const videoId  = getVideoId(m.video_url);
            const isWatched = watched.has(m.id);
            return (
              <div key={m.id} style={{ ...S.videoCard, ...(isWatched ? S.cardWatched : {}) }}>
                <VideoEmbed
                  videoId={videoId}
                  materialId={m.id}
                  watched={isWatched}
                  onEnded={markWatched}
                />
                <div style={S.cardBody}>
                  <div style={S.cardTopRow}>
                    <span style={S.catTag}>{m.category || "Umumiy"}</span>
                    {isWatched
                      ? <span style={S.donePill}><IcoCheck size={10} /> Ko'rilgan</span>
                      : <span style={S.hintPill}>To'liq ko'ring → belgilanadi</span>
                    }
                  </div>
                  <h3 style={S.cardTitle}>{m.title}</h3>
                  {m.description && <p style={S.cardDesc}>{m.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── FILE LIST ── */
        <div style={S.fileList}>
          {filtered.map(m => {
            const isWatched = watched.has(m.id);
            const { label: extLabel, color: extColor } = fileExt(m.file_path);
            return (
              <div key={m.id} style={{ ...S.fileCard, ...(isWatched ? S.fileCardDone : {}) }}>
                {/* File type badge */}
                <div style={{ ...S.extBadge, background: extColor + "18", color: extColor }}>
                  {extLabel}
                </div>

                {/* Info */}
                <div style={S.fileInfo}>
                  <div style={S.fileTitle}>{m.title}</div>
                  <div style={S.fileMeta}>
                    <span style={S.catTag}>{m.category || "Umumiy"}</span>
                    {m.description && <span style={S.fileDesc}>{m.description}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div style={S.fileActions}>
                  <a
                    href={`${API_BASE}/files/${m.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    style={S.dlBtn}
                  >
                    <IcoDownload size={13} /> Yuklab olish
                  </a>
                  {isWatched ? (
                    <span style={S.donePill}><IcoCheck size={10} /> O'qilgan</span>
                  ) : (
                    <button
                      disabled={markingId === m.id}
                      onClick={() => markWatched(m.id)}
                      style={S.markBtn}
                    >
                      {markingId === m.id ? "..." : "O'qidim"}
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
  page: { display: "flex", flexDirection: "column", gap: "20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" },
  title: { fontSize: "24px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 4px" },
  sub:   { fontSize: "14px", color: "var(--text)" },
  progressMini: { background: "var(--card-bg)", borderRadius: "var(--radius-md)", padding: "12px 16px", boxShadow: "var(--shadow-sm)", minWidth: "180px" },
  progressLabel: { display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text)", marginBottom: "8px" },
  miniBar: { height: "6px", background: "var(--border)", borderRadius: "99px", overflow: "hidden" },
  miniBarFill: { height: "100%", background: "linear-gradient(90deg,#aa3bff,#7c3aed)", borderRadius: "99px", transition: "width 0.6s" },

  sectionRow: { display: "flex", gap: "10px" },
  sectionBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "11px 22px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--card-bg)", fontSize: "14px", fontWeight: 700, color: "var(--text)", cursor: "pointer", transition: "all 0.15s" },
  sectionBtnActive: { background: "var(--accent)", borderColor: "var(--accent)", color: "#fff", boxShadow: "0 4px 14px rgba(170,59,255,0.3)" },
  sectionCount: { background: "rgba(0,0,0,0.08)", borderRadius: "99px", padding: "1px 8px", fontSize: "11px", fontWeight: 800 },
  sectionCountActive: { background: "rgba(255,255,255,0.25)" },

  tabs: { display: "flex", gap: "8px", flexWrap: "wrap" },
  tab: { display: "flex", alignItems: "center", gap: "7px", padding: "7px 14px", border: "1.5px solid var(--border)", borderRadius: "99px", background: "var(--card-bg)", fontSize: "12px", fontWeight: 600, color: "var(--text)", cursor: "pointer" },
  tabActive: { background: "var(--accent-light)", borderColor: "var(--accent)", color: "var(--accent)" },
  tabCount: { background: "var(--border)", color: "var(--text-muted)", borderRadius: "99px", padding: "1px 6px", fontSize: "10px", fontWeight: 700 },
  tabCountActive: { background: "var(--accent)", color: "#fff" },

  skeletonGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: "16px" },
  skeleton: { height: "300px", background: "var(--card-bg)", borderRadius: "var(--radius-md)", animation: "pulse 1.5s ease-in-out infinite" },
  empty: { textAlign: "center", padding: "60px 20px" },
  emptyIconWrap: { width: "64px", height: "64px", background: "var(--border)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "var(--text-muted)" },
  emptyText: { color: "var(--text-muted)", fontSize: "15px" },

  /* Video grid */
  videoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  videoCard: { background: "var(--card-bg)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)", border: "1.5px solid transparent" },
  cardWatched: { border: "1.5px solid rgba(16,185,129,0.3)", boxShadow: "0 4px 20px rgba(16,185,129,0.08)" },
  watchedBadge: { position: "absolute", top: "10px", right: "10px", background: "#10b981", color: "#fff", borderRadius: "99px", padding: "4px 10px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "5px", boxShadow: "0 2px 8px rgba(16,185,129,0.4)" },
  cardBody: { padding: "14px 16px" },
  cardTopRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", flexWrap: "wrap" },
  cardTitle: { fontSize: "15px", fontWeight: 700, color: "var(--text-h)", margin: "0 0 4px" },
  cardDesc:  { fontSize: "12px", color: "var(--text)", lineHeight: 1.5 },

  /* File list */
  fileList: { display: "flex", flexDirection: "column", gap: "10px" },
  fileCard: { background: "var(--card-bg)", borderRadius: "var(--radius-md)", padding: "16px 20px", boxShadow: "var(--shadow-sm)", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", transition: "border-color 0.2s" },
  fileCardDone: { borderColor: "rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.03)" },
  extBadge: { width: "52px", height: "52px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 900, flexShrink: 0, letterSpacing: "0.03em" },
  fileInfo: { flex: 1, minWidth: "120px" },
  fileTitle: { fontSize: "14px", fontWeight: 700, color: "var(--text-h)", marginBottom: "6px" },
  fileMeta:  { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  fileDesc:  { fontSize: "11px", color: "var(--text-muted)" },
  fileActions: { display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 },
  dlBtn: { display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", background: "var(--accent)", color: "#fff", borderRadius: "7px", fontSize: "12px", fontWeight: 700, textDecoration: "none", flexShrink: 0 },
  markBtn: { padding: "8px 14px", background: "var(--card-bg)", border: "1.5px solid var(--border)", borderRadius: "7px", fontSize: "12px", fontWeight: 700, color: "var(--text)", cursor: "pointer" },

  /* Shared */
  catTag:   { background: "var(--accent-light)", color: "var(--accent)", borderRadius: "99px", padding: "2px 8px", fontSize: "10px", fontWeight: 700 },
  donePill: { background: "#10b98115", color: "#10b981", borderRadius: "99px", padding: "2px 9px", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 },
  hintPill: { background: "#f59e0b15", color: "#f59e0b", borderRadius: "99px", padding: "2px 9px", fontSize: "10px", fontWeight: 700 },
};