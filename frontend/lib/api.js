import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

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

// ---------- Employee API ----------

export async function employeeLogin(employeeCode) {
  const { data } = await api.post(`/employees/login`, { employeeCode });
  return data.data;
}

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

export async function verifyQrCode(employeeId, qrPayload) {
  const { data } = await api.post(`/appointments/verify-qr`, { employeeId, qrPayload });
  return data;
}

export async function updateAppointmentStatus(id, employeeId, status) {
  const { data } = await api.put(`/appointments/${id}/status`, { employeeId, status });
  return data;
}
