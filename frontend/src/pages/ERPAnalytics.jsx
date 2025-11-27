import React, { useEffect, useState } from "react";
import { erp } from "../api";

export default function ERPAnalytics() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [ov, us] = await Promise.all([
        erp.getOverview(),
        erp.getUserStats()
      ]);

      setOverview(ov);
      setUsers(us);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 34, fontWeight: 700, marginBottom: 6 }}>
        ERP Analytics Dashboard
      </h1>
      <p style={{ fontSize: 16, opacity: 0.75, marginBottom: 22 }}>
        Analytics based on timeline attendance from face recognition scans.
      </p>

      {/* Loading */}
      {loading && (
        <p
          style={{
            fontSize: 18,
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span className="loader" /> Loading analytics...
        </p>
      )}

      {/* Summary Cards */}
      {!loading && overview && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 16,
            marginBottom: 26,
          }}
        >
          <SummaryCard label="Total Users" value={overview.total_users} accent="#38bdf8" />
          <SummaryCard label={`Scanned Today (${overview.today})`} value={overview.present_today} accent="#22c55e" />
          <SummaryCard label="Not Scanned Today" value={overview.absent_today} accent="#ef4444" />
          <SummaryCard label="Overall Attendance Rate" value={overview.overall_attendance_rate + "%"} accent="#a855f7" />
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div
          style={{
            borderRadius: 10,
            border: "1px solid rgba(148,163,184,0.4)",
            overflowX: "auto",
            marginTop: 6,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
            }}
          >
            <thead>
              <tr style={{ background: "#0f172a" }}>
                <Th>Rank</Th>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Department</Th>
                <Th>Present Days</Th>
                <Th>Total Days</Th>
                <Th>Attendance %</Th>
                <Th>Streak 🔥</Th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 16, textAlign: "center" }}>
                    No attendance data available yet.
                  </td>
                </tr>
              )}
              {users.map((u, index) => (
                <tr key={u.id} style={{ background: "#020617" }}>
                  <Td>{index + 1}</Td>
                  <Td>{u.id}</Td>
                  <Td>{u.name}</Td>
                  <Td>{u.department}</Td>
                  <Td>{u.present_days}</Td>
                  <Td>{u.total_days}</Td>
                  <Td>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        background:
                          u.attendance_rate >= 75
                            ? "rgba(34,197,94,0.15)"
                            : u.attendance_rate >= 40
                            ? "rgba(234,179,8,0.18)"
                            : "rgba(239,68,68,0.12)",
                        color:
                          u.attendance_rate >= 75
                            ? "#4ade80"
                            : u.attendance_rate >= 40
                            ? "#fde68a"
                            : "#fecaca",
                      }}
                    >
                      {u.attendance_rate.toFixed(1)}%
                    </span>
                  </Td>
                  <Td style={{ fontWeight: 600, color: "#fcd34d" }}>
                    {u.streak || 0} days
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, accent }) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 12,
        background: "rgba(15,23,42,0.85)",
        border: `1px solid ${accent}33`,
        boxShadow: "0 8px 18px rgba(15,23,42,0.65)",
        animation: "fadeIn 0.35s ease",
      }}
    >
      <div style={{ fontSize: 13, textTransform: "uppercase", opacity: 0.7 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

const Th = (props) => (
  <th
    style={{
      padding: "10px 12px",
      textAlign: "left",
      borderBottom: "1px solid rgba(148,163,184,0.6)",
    }}
    {...props}
  />
);

const Td = (props) => (
  <td
    style={{
      padding: "10px 12px",
      borderBottom: "1px solid rgba(30,41,59,0.9)",
    }}
    {...props}
  />
);
