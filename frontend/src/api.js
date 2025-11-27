const API_BASE = "http://localhost:8000";

// -------- Helper for sending images --------
async function postImage(url, blob, extraFields = {}) {
  const form = new FormData();
  form.append("file", blob, "frame.jpg");
  Object.entries(extraFields).forEach(([k, v]) => form.append(k, v));

  const res = await fetch(`${API_BASE}${url}`, { method: "POST", body: form });
  return res.json();
}

// -------- Vision APIs --------
export const api = {
  registerFace: (blob, name) => postImage("/api/register_face", blob, { name }),
  recognize: (blob) => postImage("/api/recognize", blob),
  emotion: (blob) => postImage("/api/emotion", blob),
  ocr: (blob) => postImage("/api/ocr", blob),
  attendance: async () => {
    const res = await fetch(`${API_BASE}/erp/attendance/${new Date()
      .toISOString()
      .split("T")[0]}`);
    return res.json();
  },
};

// -------- ERP APIs --------
export const erp = {
  getUsers: async () =>
    (await fetch(`${API_BASE}/erp/users`)).json(),

  addUser: async (data) =>
    (await fetch(`${API_BASE}/erp/users`, { method: "POST", body: JSON.stringify(data) })).json(),

  deleteUser: async (id) =>
    (await fetch(`${API_BASE}/erp/users/${id}`, { method: "DELETE" })).json(),

  markAttendance: async (record) =>
    (await fetch(`${API_BASE}/erp/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    })).json(),

  getOverview: async () =>
    (await fetch(`${API_BASE}/erp/analytics/overview`)).json(),

  getUserStats: async () =>
    (await fetch(`${API_BASE}/erp/analytics/by-user`)).json(),
};
