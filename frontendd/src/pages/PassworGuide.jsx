import React, { useState } from "react";

const PasswordGuide = () => {
  const [password, setPassword] = useState("");

  const validatePassword = (pass) => {
    return {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
  };

  const rules = validatePassword(password);
  const isValid = Object.values(rules).every(Boolean);

  return (
    <div className="container">
      <div className="card">
        <h1>Parol xavfsizligi 🔐</h1>

        <input
          type="text"
          placeholder="Parol kiriting..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {password && (
          <div className={`result ${isValid ? "success" : "error"}`}>
            {isValid
              ? "Mukammal parol! ✅"
              : "Talablarga javob bermaydi ❌"}
          </div>
        )}

        <ul>
          <li className={rules.length ? "ok" : "bad"}>
            Kamida 8 ta belgi
          </li>
          <li className={rules.uppercase ? "ok" : "bad"}>
            Katta harf (A-Z)
          </li>
          <li className={rules.lowercase ? "ok" : "bad"}>
            Kichik harf (a-z)
          </li>
          <li className={rules.number ? "ok" : "bad"}>
            Raqam (0-9)
          </li>
          <li className={rules.special ? "ok" : "bad"}>
            Maxsus belgi (!@#$%)
          </li>
        </ul>

        <div className="example">
          Misol: <b>SecuR3@2026</b>
        </div>
      </div>

      {/* CSS ICHIDA */}
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }

        .container {
          min-height: 100vh;
          background: #f3f4f6;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .card {
          background: white;
          width: 100%;
          max-width: 500px;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }

        h1 {
          color: #2563eb;
          margin-bottom: 15px;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          outline: none;
          margin-bottom: 15px;
        }

        input:focus {
          border-color: #2563eb;
        }

        .result {
          padding: 12px;
          border-radius: 8px;
          color: white;
          margin-bottom: 15px;
          font-weight: bold;
        }

        .success {
          background: #22c55e;
        }

        .error {
          background: #ef4444;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        li {
          padding: 6px 0;
          font-size: 15px;
        }

        .ok {
          color: #16a34a;
        }

        .bad {
          color: #dc2626;
        }

        .example {
          margin-top: 15px;
          background: #fef9c3;
          padding: 10px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default PasswordGuide;