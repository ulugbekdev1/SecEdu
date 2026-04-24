import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [progress, setProgress] = useState({
    total: 0,
    watched: 0,
    progress: 0
  });

  useEffect(() => {
    API.get("/progress/1")
      .then(res => setProgress(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={styles.page}>
      <h1>📊 Dashboard</h1>

      <div style={styles.card}>
        <h3>Progress</h3>

        <div style={styles.bar}>
          <div
            style={{
              ...styles.fill,
              width: `${progress.progress}%`
            }}
          />
        </div>

        <p>{progress.progress}%</p>
        <p>
          {progress.watched} / {progress.total} materiallar ko‘rilgan
        </p>
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

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
  },

  bar: {
    width: "100%",
    height: "12px",
    background: "#ddd",
    borderRadius: "10px",
    overflow: "hidden"
  },

  fill: {
    height: "100%",
    background: "#16a34a",
    transition: "0.3s"
  }
};