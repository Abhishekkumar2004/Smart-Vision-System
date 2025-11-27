import React, { useRef, useState } from "react";
import WebcamCapture from "../components/WebcamCapture";
import { api } from "../api";

export default function OCR() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const triggerCapture = () => {
    document.getElementById("webcam-snap-btn")?.click();
  };

  const handleBlob = async (blob) => {
    setLoading(true);
    setOutput("Processing...");
    const res = await api.ocr(blob);
    setOutput(res.text || "");
    setLoading(false);

    const msg = res.text?.trim() || "I could not read the text.";
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));

    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 260);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    window.speechSynthesis.speak(new SpeechSynthesisUtterance("Copied to clipboard"));
  };

  return (
    <div>
      <h1 style={{ fontSize: 34, fontWeight: 700, marginBottom: 6 }}>
        Text Recognition (OCR)
      </h1>
      <p style={{ fontSize: 17, opacity: 0.75, marginBottom: 20 }}>
        Capture a frame from the webcam to extract printed or handwritten text instantly.
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
          📖
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p
          style={{
            fontSize: 20,
            marginTop: 26,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span className="loader"></span> Reading text...
        </p>
      )}

      {/* Result */}
      {!loading && (
        <div
          ref={resultRef}
          style={{
            marginTop: 30,
            padding: "20px 24px",
            borderRadius: 12,
            background: "rgba(255, 255, 255, 0.07)",
            minHeight: 130,
            fontSize: 18,
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
            animation: "fadeIn 0.35s ease",
            border: "1px solid rgba(255,255,255,0.08)",
            maxWidth: 650,
          }}
        >
          {output || (
            <span style={{ opacity: 0.6 }}>
              No text detected yet — capture a frame to read text.
            </span>
          )}
        </div>
      )}

      {/* Copy button */}
      {!loading && output?.trim().length > 0 && (
        <button
          onClick={copyToClipboard}
          style={{
            marginTop: 18,
            padding: "12px 22px",
            borderRadius: 40,
            background: "#00d2ff",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 17,
            color: "#000",
            transition: "0.25s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          📋 Copy Extracted Text
        </button>
      )}
    </div>
  );
}
