import { useState } from "react";
import API from "../api";
import { setAuth } from "../auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 const login = async () => {
  try {
    const res = await API.post("/login", {
      username,
      password
    });

    console.log("LOGIN RESPONSE:", res.data);

    // 🔥 MUHIM QISM
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role); // <-- SHU YER MUAMMO BO‘LSA undefined chiqadi

    window.location.href = "/";
  } catch (err) {
    console.log(err);
    alert("Login error");
  }
};

  return (
    <div style={styles.box}>
      <h2>Login</h2>

      <input
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}

const styles = {
  box: {
    width: "300px",
    margin: "100px auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  }
};