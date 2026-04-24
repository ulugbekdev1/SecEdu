export default function Profile() {
  return (
    <div>
      <h1>👤 Profile</h1>

      <div style={styles.card}>
        <p>Ism: Ali Valiyev</p>
        <p>Role: Employee</p>
        <p>Progress: 45%</p>
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