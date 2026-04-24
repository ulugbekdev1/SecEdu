import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{
        flex: 1,
        padding: "20px",
        background: "#f4f6fb",
        minHeight: "100vh"
      }}>
        <Outlet />
      </div>
    </div>
  );
}