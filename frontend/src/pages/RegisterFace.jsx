import React, { useState, useRef, useEffect } from "react";
import WebcamCapture from "../components/WebcamCapture";
import { api } from "../api";

export default function RegisterFace() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const triggerSnapshot = () => {
    document.getElementById("webcam-snap-btn")?.click();
  };

  const handleBlob = async (blob) => {
    if (!name.trim()) {
      setStatus({ type: "error", msg: "Please enter a name before capturing." });
      return;
    }

    setStatus({ type: "loading", msg: "Saving face..." });
    const res = await api.registerFace(blob, name.trim());

    if (res.success) {
      setStatus({ type: "success", msg: res.message || "Face registered successfully!" });
      setName("");
    } else {
      setStatus({ type: "error", msg: res.message || "Registration failed." });
    }

    if (res.message) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(res.message));
    }
  };

  const renderStatus = () => {
    if (!status) return null;
    const base = {
      marginTop: 18,
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
      width: "fit-content",
    };
    if (status.type === "loading") return <p style={base}>⏳ {status.msg}</p>;
    if (status.type === "error")
      return (
        <p style={{ ...base, background: "rgba(255,0,0,0.18)", color: "#ffb3b3" }}>
          ❌ {status.msg}
        </p>
      );
    if (status.type === "success")
      return (
        <p style={{ ...base, background: "rgba(0,255,200,0.18)", color: "#a0ffe6" }}>
          ✔ {status.msg}
        </p>
      );
  };

  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 6 }}>Register Face</h1>
      <p style={{ fontSize: 16, opacity: 0.75, marginBottom: 24 }}>
        Enter a user name and capture the face from the webcam to store it in the system.
      </p>

      <div
        style={{
          padding: 24,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 12,
          maxWidth: 560,
        }}
      >
        <label style={{ display: "block", fontSize: 16, marginBottom: 8 }}>
          User Name
        </label>
        <input
          ref={inputRef}
          placeholder="Type person name here..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 16,
            borderRadius: 6,
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#e5e7eb",
            marginBottom: 18,
            boxSizing: "border-box",
          }}
        />

        {/* Webcam + floating button */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <WebcamCapture onCapture={handleBlob} buttonText={null} />

          <button
            onClick={triggerSnapshot}
            style={{
              position: "absolute",
              bottom: 16,
              right: 16,
              background: "#00d2ff",
              border: "none",
              borderRadius: "50%",
              width: 64,
              height: 64,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              color: "#000",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
            }}
          >
            📌
          </button>
        </div>
      </div>

      {renderStatus()}
    </div>
  );
}
