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
