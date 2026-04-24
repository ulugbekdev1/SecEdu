export default function Admin() {
  return (
    <div>
      <h1>⚙️ Admin Panel</h1>

      <div style={styles.card}>
        <p>📌 Material qo‘shish</p>
        <p>👥 User management</p>
        <p>📊 Analytics</p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px"
  }
};