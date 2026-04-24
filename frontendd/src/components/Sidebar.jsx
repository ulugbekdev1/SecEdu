import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const role = localStorage.getItem("role");

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#fff" : "#cbd5e1",
    background: isActive ? "#1e293b" : "transparent",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "8px"
  });

  return (
    <div style={styles.sidebar}>
      <h2>🔐 SecureEdu</h2>

      <NavLink to="/" style={linkStyle}>
        📊 Dashboard
      </NavLink>

      <NavLink to="/materials" style={linkStyle}>
        📚 Materials
      </NavLink>

      <NavLink to="/quiz" style={linkStyle}>
        🧠 Quiz
      </NavLink>

      <NavLink to="/profile" style={linkStyle}>
        👤 Profile
      </NavLink>

      {/* 🔥 ADMIN ONLY */}
      {role === "admin" && (
        <NavLink to="/admin" style={linkStyle}>
          ⚙️ Admin Panel
        </NavLink>
      )}
    </div>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    background: "#0f172a",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minHeight: "100vh"
  }
};