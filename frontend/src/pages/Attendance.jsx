import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Attendance() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.getAttendanceByDate(date);
    setRecords(res.rows || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [date]);

  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 6 }}>Attendance Timeline</h1>
      <p style={{ fontSize: 16, opacity: 0.75, marginBottom: 18 }}>
        Full IN/OUT timeline is logged automatically based on face recognition.
      </p>

      {/* Date Selector */}
      <div style={{ marginBottom: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#e5e7eb",
          }}
        />
        <button
          onClick={load}
          style={{
            background: "#00d2ff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ fontSize: 18, marginTop: 20 }}>⏳ Loading...</p>
      ) : records.length === 0 ? (
        <p
          style={{
            fontSize: 18,
            marginTop: 20,
            padding: 12,
            borderRadius: 8,
            background: "rgba(255,255,255,0.08)",
            width: "fit-content",
          }}
        >
          ⚠ No attendance found for {date}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {records.map((r, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255,255,255,0.06)",
                padding: "18px 20px",
                borderRadius: 12,
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                {r.id}
              </div>

              {/* Timeline */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {r.timeline.map((t, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 20,
                      background: t.type === "IN" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                      color: t.type === "IN" ? "#4ade80" : "#fca5a5",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {t.type} — {t.time}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
