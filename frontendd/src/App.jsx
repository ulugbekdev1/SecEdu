import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./loyaut/Layout";

import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import Quiz from "./pages/Quiz";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN OUTSIDE LAYOUT */}
        <Route path="/login" element={<Login />} />

        {/* MAIN APP */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="materials" element={<Materials />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<Admin />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}