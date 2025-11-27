import React, { useState } from "react";
import WebcamCapture from "../components/WebcamCapture";
import { api } from "../api";

export default function Recognize() {
  const [result, setResult] = useState(null);

  const triggerCapture = () => {
    document.getElementById("webcam-snap-btn")?.click();
  };

  const handleBlob = async (blob) => {
    setResult({ loading: true });

    const res = await api.recognize(blob);
    setResult(res);

    // 🎤 Voice feedback
    if (res.success && res.faces?.length) {
      const knownNames = [...new Set(res.faces.filter(f => f.name !== "UNKNOWN").map(f => f.name))];
      const msg =
        knownNames.length > 0
          ? `Detected ${knownNames.join(", ")}`
          : `Face detected but identity unknown`;

      window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 34, fontWeight: 700, marginBottom: 6 }}>
        Face Recognition & Attendance
      </h1>

      <p style={{ fontSize: 17, opacity: 0.75, marginBottom: 24 }}>
        Capture a frame from the webcam to recognize registered users and log timeline attendance automatically.
      </p>

      {/* Webcam + Floating button */}
      <div
        style={{
          position: "relative",
          display: "inline-block",
          padding: 16,
          borderRadius: 14,
          background: "rgba(255,255,255,0.07)",
        }}
      >
        <WebcamCapture onCapture={handleBlob} buttonText={null} />

        <button
          onClick={triggerCapture}
          style={{
            position: "absolute",
            bottom: 28,
            right: 28,
            background: "#00d2ff",
            border: "none",
            borderRadius: "50%",
            width: 70,
            height: 70,
            fontSize: 28,
            fontWeight: 700,
            cursor: "pointer",
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0px 4px 14px rgba(0,0,0,0.45)",
            transition: "0.25s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🔍
        </button>
      </div>

      {/* Loading */}
      {result?.loading && (
        <p
          style={{
            marginTop: 26,
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span className="loader"></span> Detecting face...
        </p>
      )}

      {/* Success — faces detected */}
      {result?.success && !result.loading && result.faces?.length > 0 && (
        <div
          style={{
            marginTop: 30,
            padding: 22,
            borderRadius: 12,
            background: "rgba(0,255,200,0.08)",
            border: "1px solid rgba(0,255,200,0.2)",
            animation: "fadeIn 0.35s ease",
            maxWidth: 620,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 24, marginBottom: 12 }}>
            {result.faces.length} Face{result.faces.length > 1 ? "s" : ""} Detected
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 12,
            }}
          >
            {result.faces.map((f, i) => (
              <span
                key={i}
                style={{
                  padding: "10px 16px",
                  borderRadius: 22,
                  fontWeight: 700,
                  fontSize: 16,
                  background: f.name === "UNKNOWN" ? "#b91c1c" : "#00d2ff",
                  color: f.name === "UNKNOWN" ? "#fff" : "#000",
                }}
              >
                {f.name}
              </span>
            ))}
          </div>

          <div style={{ fontSize: 15, opacity: 0.75 }}>
            Attendance timeline updated automatically.
          </div>
        </div>
      )}

      {/* Success — but no face */}
      {result?.success && !result.loading && result.faces?.length === 0 && (
        <p
          style={{
            marginTop: 30,
            fontSize: 18,
            padding: 14,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 8,
            width: "fit-content",
          }}
        >
          ⚠ No face detected. Try again.
        </p>
      )}

      {/* Error */}
      {result && !result.success && !result.loading && (
        <p
          style={{
            marginTop: 30,
            fontSize: 18,
            padding: 14,
            background: "rgba(255,0,0,0.15)",
            borderRadius: 8,
            width: "fit-content",
          }}
        >
          ❌ {result.message}
        </p>
      )}
    </div>
  );
}
