import React, { useEffect, useState } from "react";

// LocalStorage key
const STORAGE_KEY = "erp_users_dummy";

// Some initial dummy data (CSE etc.)
const defaultUsers = [
  { id: "CSE001", name: "Rohan Sharma", department: "CSE", status: "Present" },
  { id: "CSE002", name: "Priya Singh", department: "CSE", status: "Absent" },
  { id: "ECE001", name: "Rahul Verma", department: "ECE", status: "Not Marked" },
];

export default function UserERP() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: "", name: "", department: "CSE" });
  const [filterDept, setFilterDept] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Load from localStorage or use defaults
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      setUsers(defaultUsers);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }, []);

  const persist = (list) => {
    setUsers(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddUser = () => {
    if (!form.id.trim() || !form.name.trim()) {
      alert("Please fill both ID and Name.");
      return;
    }
    // Check duplicate ID
    if (users.some((u) => u.id === form.id.trim())) {
      alert("User ID already exists.");
      return;
    }
    const newUser = {
      id: form.id.trim(),
      name: form.name.trim(),
      department: form.department,
      status: "Not Marked",
    };
    const updated = [...users, newUser];
    persist(updated);
    setForm({ id: "", name: "", department: "CSE" });
  };

  const updateStatus = (id, status) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, status } : u
    );
    persist(updated);
  };

  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;
    const updated = users.filter((u) => u.id !== id);
    persist(updated);
  };

  const clearAllStatuses = () => {
    const updated = users.map((u) => ({ ...u, status: "Not Marked" }));
    persist(updated);
  };

  const filteredUsers = users.filter((u) => {
    if (filterDept !== "ALL" && u.department !== filterDept) return false;
    if (filterStatus !== "ALL" && u.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      <h1 style={{ fontSize: 34, fontWeight: 700, marginBottom: 6 }}>
        ERP – User & Attendance (Dummy)
      </h1>
      <p style={{ fontSize: 16, opacity: 0.75, marginBottom: 20 }}>
        Manage users (like students/employees) and mark their attendance as{" "}
        <b>Present</b> or <b>Absent</b>. Data is stored locally in your browser.
      </p>

      {/* Form Card */}
      <div
        style={{
          padding: 20,
          borderRadius: 12,
          background: "rgba(255,255,255,0.06)",
          marginBottom: 24,
          maxWidth: 620,
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 14, fontSize: 20 }}>
          ➕ Add User
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 2fr 1fr auto",
            gap: 10,
            alignItems: "center",
          }}
        >
          <input
            placeholder="User ID (e.g. CSE003)"
            value={form.id}
            onChange={(e) => handleChange("id", e.target.value)}
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1px solid #334155",
              background: "#020617",
              color: "#e5e7eb",
              fontSize: 14,
            }}
          />
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1px solid #334155",
              background: "#020617",
              color: "#e5e7eb",
              fontSize: 14,
            }}
          />
          <select
            value={form.department}
            onChange={(e) => handleChange("department", e.target.value)}
            style={{
              padding: 8,
              borderRadius: 6,
              border: "1px solid #334155",
              background: "#020617",
              color: "#e5e7eb",
              fontSize: 14,
            }}
          >
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
            <option value="ME">ME</option>
            <option value="AI">AI</option>
          </select>
          <button
            onClick={handleAddUser}
            style={{
              padding: "9px 14px",
              borderRadius: 8,
              border: "none",
              background: "#00d2ff",
              color: "#000",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Filters + Clear */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <span style={{ opacity: 0.8 }}>Filter:</span>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          style={{
            padding: 6,
            borderRadius: 6,
            border: "1px solid #334155",
            background: "#020617",
            color: "#e5e7eb",
            fontSize: 14,
          }}
        >
          <option value="ALL">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="IT">IT</option>
          <option value="ME">ME</option>
          <option value="AI">AI</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: 6,
            borderRadius: 6,
            border: "1px solid #334155",
            background: "#020617",
            color: "#e5e7eb",
            fontSize: 14,
          }}
        >
          <option value="ALL">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Not Marked">Not Marked</option>
        </select>

        <button
          onClick={clearAllStatuses}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            background: "rgba(248,250,252,0.12)",
            color: "#e5e7eb",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Reset Status (Today)
        </button>
      </div>

      {/* Users Table */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: 10,
          border: "1px solid rgba(148,163,184,0.4)",
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
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 14, textAlign: "center" }}>
                  No users found for selected filters.
                </td>
              </tr>
            )}

            {filteredUsers.map((u) => (
              <tr key={u.id} style={{ background: "#020617" }}>
                <td style={tdStyle}>{u.id}</td>
                <td style={tdStyle}>{u.name}</td>
                <td style={tdStyle}>{u.department}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      background:
                        u.status === "Present"
                          ? "rgba(34,197,94,0.15)"
                          : u.status === "Absent"
                          ? "rgba(239,68,68,0.15)"
                          : "rgba(148,163,184,0.18)",
                      color:
                        u.status === "Present"
                          ? "#4ade80"
                          : u.status === "Absent"
                          ? "#fca5a5"
                          : "#e5e7eb",
                    }}
                  >
                    {u.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={() => updateStatus(u.id, "Present")}
                      style={btnSmall("#22c55e")}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => updateStatus(u.id, "Absent")}
                      style={btnSmall("#ef4444")}
                    >
                      Absent
                    </button>
                    <button
                      onClick={() => updateStatus(u.id, "Not Marked")}
                      style={btnSmall("#64748b")}
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => deleteUser(u.id)}
                      style={btnSmall("transparent", "1px solid #4b5563")}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "10px 12px",
  textAlign: "left",
  borderBottom: "1px solid rgba(148,163,184,0.6)",
};

const tdStyle = {
  padding: "9px 12px",
  borderBottom: "1px solid rgba(30,41,59,0.9)",
};

const btnSmall = (bg, border = "none") => ({
  padding: "4px 10px",
  fontSize: 12,
  borderRadius: 999,
  border,
  background: bg,
  color: bg === "transparent" ? "#e5e7eb" : "#020617",
  cursor: "pointer",
  fontWeight: 600,
});
