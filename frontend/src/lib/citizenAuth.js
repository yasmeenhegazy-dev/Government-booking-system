// Lightweight citizen "session" stored in localStorage.
// Identity is the national ID — the same one used to create the booking.
// Profile is hydrated from the latest appointment after login.

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUserAppointments } from "./api.js";

const STORAGE_KEY = "gov.citizen.session";

export function getCitizenSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCitizenSession(session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearCitizenSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function useCitizenSession({ requireAuth = true } = {}) {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async (nationalIdOverride) => {
    // Always read the stored session so we don't lose the name/email/phone
    // that login set. The override only changes which nationalId we fetch.
    const stored = getCitizenSession() || {};
    const current = nationalIdOverride
      ? { ...stored, nationalId: nationalIdOverride }
      : stored;

    if (!current?.nationalId) {
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const list = await getUserAppointments(current.nationalId);
      setAppointments(list || []);

      // Identity (name/email/phone) is set at login and stays fixed —
      // appointments may belong to different people (family bookings), so we
      // never overwrite the logged-in identity from booking data. Only fill
      // gaps if the stored session is missing a field.
      const latest = (list || [])[0];
      const merged = {
        nationalId: current.nationalId,
        citizenName: current.citizenName || latest?.citizenName || "",
        citizenEmail: current.citizenEmail || latest?.citizenEmail || "",
        citizenPhone: current.citizenPhone || latest?.citizenPhone || "",
      };
      setSession(merged);
      saveCitizenSession(merged);
      return merged;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "تعذر جلب البيانات. حاول مجدداً.";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const existing = getCitizenSession();
    if (!existing?.nationalId) {
      setLoading(false);
      if (requireAuth) {
        navigate("/auth/login", { replace: true });
      }
      return;
    }
    setSession(existing);
    refresh(existing.nationalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(() => {
    clearCitizenSession();
    setSession(null);
    setAppointments([]);
    navigate("/auth/login", { replace: true });
  }, [navigate]);

  return { session, appointments, loading, error, refresh, logout };
}
