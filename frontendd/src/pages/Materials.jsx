import { useEffect, useState } from "react";
import API from "../api";

export default function Materials() {
  const [data, setData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await API.get("/materials");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markWatched = async (id) => {
    try {
      setLoadingId(id);

      await API.post(`/confirm/${id}`);

      setWatched(prev => [...prev, id]); // UI update
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const getVideoId = (url) => {
    if (!url) return "";

    if (url.includes("youtu.be")) {
      return url.split("/").pop();
    }

    const match = url.match(/v=([^&]+)/);
    return match ? match[1] : "";
  };

  return (
    <div style={styles.page}>
      <h1>📚 Xavfsizlik Materiallari</h1>

      <div style={styles.grid}>
        {data.map((m) => {
          const videoId = getVideoId(m.video_url);
          const isWatched = watched.includes(m.id);

          return (
            <div key={m.id} style={styles.card}>
              <h3>{m.title}</h3>

              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${videoId}`}
                allowFullScreen
              />

              <button
                disabled={loadingId === m.id || isWatched}
                onClick={() => markWatched(m.id)}
                style={{
                  ...styles.btn,
                  background: isWatched ? "#555" : "#16a34a"
                }}
              >
                {isWatched
                  ? "✔ Ko‘rilgan"
                  : loadingId === m.id
                  ? "⏳ Yuklanmoqda..."
                  : "✔ Ko‘rildi"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    background: "#f5f7fb",
    minHeight: "100vh"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "15px",
    marginTop: "20px"
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
  },

  btn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};