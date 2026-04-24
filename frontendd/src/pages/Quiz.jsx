import { useState } from "react";

export default function Quiz() {
  const questions = [
    {
      question: "Phishing nima?",
      options: [
        "Virus turi",
        "Firibgarlik email hujumi",
        "Antivirus"
      ],
      answer: 1
    },
    {
      question: "Strong password qanday bo‘ladi?",
      options: [
        "123456",
        "Ism + tug‘ilgan yil",
        "Katta-kichik harf + raqam + belgi"
      ],
      answer: 2
    },
    {
      question: "USB qurilmalari xavfsizmi?",
      options: [
        "Har doim xavfsiz",
        "Noma’lum USB xavfli bo‘lishi mumkin",
        "Hech qanday ta’siri yo‘q"
      ],
      answer: 1
    }
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (index) => {
    if (index === questions[current].answer) {
      setScore(score + 1);
    }

    const next = current + 1;

    if (next < questions.length) {
      setCurrent(next);
    } else {
      setFinished(true);
    }
  };

  return (
    <div style={styles.page}>
      <h1>🧠 Axborot Xavfsizlik Quiz</h1>

      {!finished ? (
        <div style={styles.card}>
          <h2>
            {current + 1}. {questions[current].question}
          </h2>

          <div style={styles.options}>
            {questions[current].options.map((opt, i) => (
              <button
                key={i}
                style={styles.btn}
                onClick={() => handleAnswer(i)}
              >
                {opt}
              </button>
            ))}
          </div>

          <p style={{ marginTop: "10px", color: "#64748b" }}>
            Savol {current + 1} / {questions.length}
          </p>
        </div>
      ) : (
        <div style={styles.result}>
          <h2>🎉 Test tugadi!</h2>
          <p>Sizning natijangiz:</p>
          <h1>{score} / {questions.length}</h1>

          {score === questions.length ? (
            <p>🔥 Ajoyib! Siz xavfsizlikni yaxshi bilasiz</p>
          ) : (
            <p>⚠️ Yana o‘rganish kerak</p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Arial"
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },

  options: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "15px"
  },

  btn: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#f8fafc"
  },

  result: {
    textAlign: "center",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    marginTop: "20px"
  }
};