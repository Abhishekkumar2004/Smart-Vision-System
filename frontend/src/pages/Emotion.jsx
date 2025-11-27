import React, { useState } from "react";
import WebcamCapture from "../components/WebcamCapture";
import { api } from "../api";

export default function Emotion() {
  const [result, setResult] = useState(null);

  const triggerCapture = () => {
    document.getElementById("webcam-snap-btn")?.click();
  };

  const handleBlob = async (blob) => {
    setResult({ loading: true });
    const res = await api.emotion(blob);
    setResult(res);

    if (res.success && res.emotion) {
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(`You look ${res.emotion}`)
      );
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 34, fontWeight: 700, marginBottom: 6 }}>
        Emotion Detection
      </h1>
      <p style={{ fontSize: 17, opacity: 0.75, marginBottom: 22 }}>
        Capture a frame from your webcam to analyze emotional expression in real time.
      </p>

      {/* Webcam + floating capture button */}
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
            bottom: 26,
            right: 26,
            background: "#00d2ff",
            border: "none",
            borderRadius: "50%",
            width: 70,
            height: 70,
            fontSize: 26,
            cursor: "pointer",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#000",
            boxShadow: "0px 4px 14px rgba(0,0,0,0.45)",
            transition: "0.25s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🎯
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
            gap: 12,
          }}
        >
          <span className="loader"></span> Analyzing emotion...
        </p>
      )}

      {/* Main emotion */}
      {result?.emotion && !result.loading && (
        <div
          style={{
            marginTop: 30,
            padding: "20px 24px",
            borderRadius: 12,
            animation: "fadeIn 0.35s ease",
            background: "rgba(0,210,255,0.09)",
            border: "1px solid rgba(0,210,255,0.3)",
            maxWidth: 420,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 700,
              color: "#00d2ff",
              textTransform: "uppercase",
            }}
          >
            {result.emotion}
          </h2>
          <p style={{ marginTop: 6, opacity: 0.8 }}>
            Dominant emotional state detected.
          </p>
        </div>
      )}

      {/* No face */}
      {result && !result.emotion && !result.loading && (
        <p
          style={{
            marginTop: 26,
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

      {/* Emotion Breakdown */}
      {result?.scores &&
        !result.loading &&
        Object.keys(result.scores).length > 0 && (
          <div style={{ marginTop: 30 }}>
            <h3 style={{ fontSize: 20, marginBottom: 12 }}>Emotion Breakdown</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Object.entries(result.scores).map(([emo, val], i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 16,
                  }}
                >
                  <span style={{ textTransform: "capitalize" }}>{emo}</span>
                  <span>{(val * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
