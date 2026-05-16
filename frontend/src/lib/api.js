import axios from "axios";

// In dev we hit the backend on a separate port; in production the SPA is
// served by the same Express process, so a relative /api path works.
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});

// Retry GET requests when the backend is still warming up (network error or 5xx).
// The backend uses mongodb-memory-server which takes ~10–20s to boot on first run.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || config.method !== "get") return Promise.reject(error);

    const isNetworkError = !error.response;
    const isServerError = error.response && error.response.status >= 500;
    if (!isNetworkError && !isServerError) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;
    const MAX_RETRIES = 8;
    if (config.__retryCount >= MAX_RETRIES) return Promise.reject(error);

    config.__retryCount += 1;
    const delay = Math.min(500 * 2 ** (config.__retryCount - 1), 4000);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return api(config);
  }
);

export async function getServices() {
  const { data } = await api.get("/services");
  return data.data;
}

export async function getBranches(serviceId) {
  const { data } = await api.get(`/branches?serviceId=${serviceId}`);
  return data.data;
}

export async function getSlots(branchId) {
  const { data } = await api.get(`/slots?branchId=${branchId}`);
  return data.data;
}

export async function createAppointment(payload) {
  const { data } = await api.post("/appointments", payload);
  return data;
}

export async function getUserAppointments(nationalId) {
  const { data } = await api.get(`/appointments/user`, { params: { nationalId } });
  return data.data;
}

export async function getAppointmentByReference(ref) {
  const { data } = await api.get(`/appointments/reference/${encodeURIComponent(ref)}`);
  return data.data;
}

export async function cancelAppointment(id, nationalId, reason) {
  const { data } = await api.put(`/appointments/${id}/cancel`, { nationalId, reason });
  return data;
}

// ---------- Auth API ----------

export async function registerRequest(payload) {
  const { data } = await api.post(`/auth/register`, payload);
  return data;
}

export async function loginRequest(payload) {
  const { data } = await api.post(`/auth/login`, payload);
  return data.data;
}

export async function sendOtpRequest(payload) {
  const { data } = await api.post(`/auth/sendOtp`, payload);
  return data;
}

export async function resetPasswordRequest(payload) {
  const { data } = await api.post(`/auth/resetpassword`, payload);
  return data;
}

// ---------- Employee API ----------

export async function getEmployeeProfile(id) {
  const { data } = await api.get(`/employees/${id}`);
  return data.data;
}

export async function getTodayAppointments(branchId, dateStr) {
  const params = { branchId };
  if (dateStr) params.date = dateStr;
  const { data } = await api.get(`/appointments/today`, { params });
  return data; // { stats, count, data, date }
}

export async function getAllUpcomingAppointments() {
  const { data } = await api.get(`/appointments/all-upcoming`);
  return data; // { stats, count, data }
}

export async function getAppointmentsByDate(dateStr) {
  const params = dateStr ? { date: dateStr } : {};
  const { data } = await api.get(`/appointments/by-date`, { params });
  return data; // { stats, count, data, date }
}

export async function verifyQrCode(employeeId, qrPayload) {
  const { data } = await api.post(`/appointments/verify-qr`, { employeeId, qrPayload });
  return data;
}

export async function updateAppointmentStatus(id, employeeId, status) {
  const { data } = await api.put(`/appointments/${id}/status`, { employeeId, status });
  return data;
}

// ---------- Admin API ----------

export async function getAdminStats() {
  const { data } = await api.get(`/admin/stats`);
  return data.data;
}

export async function getAdminReports(days = 7) {
  const { data } = await api.get(`/admin/reports`, { params: { days } });
  return data.data;
}

export async function getAdminSlots(dateStr) {
  const params = dateStr ? { date: dateStr } : {};
  const { data } = await api.get(`/admin/slots`, { params });
  return data;
}

export async function updateAdminSlot(id, payload) {
  const { data } = await api.put(`/admin/slots/${id}`, payload);
  return data;
}

export async function getAdminAppointments(params = {}) {
  const { data } = await api.get(`/admin/appointments`, { params });
  return data;
}

export async function getAdminLogs() {
  const { data } = await api.get(`/admin/logs`);
  return data.data;
}

// ---------- Admin CRUD (Users / Services / Branches / Roles) ----------

function crud(entity) {
  return {
    list: async () => (await api.get(`/admin/${entity}`)).data.data,
    create: async (payload) => (await api.post(`/admin/${entity}`, payload)).data.data,
    update: async (id, payload) => (await api.put(`/admin/${entity}/${id}`, payload)).data.data,
    remove: async (id) => (await api.delete(`/admin/${entity}/${id}`)).data,
  };
}

export const adminUsers = crud("users");
export const adminServices = crud("services");
export const adminBranches = crud("branches");
export const adminRoles = crud("roles");
