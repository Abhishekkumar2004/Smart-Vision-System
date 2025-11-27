import React, { useRef } from "react";
import Webcam from "react-webcam";

export default function WebcamCapture({ onCapture }) {
  const webcamRef = useRef(null);

  const handleCapture = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;
    const blob = await (await fetch(screenshot)).blob();
    onCapture(blob);
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 640 }}>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode: "user",
        }}
        style={{
          width: "100%",
          borderRadius: 12,
          background: "#000",
          objectFit: "cover",
        }}
      />

      {/* Hidden trigger — invoked by floating buttons */}
      <button
        id="webcam-snap-btn"
        onClick={handleCapture}
        style={{ display: "none" }}
      />
    </div>
  );
}
