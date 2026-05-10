// Lightweight citizen "session" stored in localStorage.
// Identity is the national ID — the same one used to create the booking.
// Profile is hydrated from the latest appointment after login.

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { getUserAppointments } from "./api";

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
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async (nationalIdOverride) => {
    const current = nationalIdOverride
      ? { nationalId: nationalIdOverride }
      : getCitizenSession();

    if (!current?.nationalId) {
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const list = await getUserAppointments(current.nationalId);
      setAppointments(list || []);

      // Hydrate profile from the most recent appointment (any status)
      const latest = (list || [])[0];
      const merged = {
        nationalId: current.nationalId,
        citizenName: latest?.citizenName || current.citizenName || "",
        citizenEmail: latest?.citizenEmail || current.citizenEmail || "",
        citizenPhone: latest?.citizenPhone || current.citizenPhone || "",
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
      if (requireAuth && router.isReady) {
        router.replace("/citizen/login");
      }
      return;
    }
    setSession(existing);
    refresh(existing.nationalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const logout = useCallback(() => {
    clearCitizenSession();
    setSession(null);
    setAppointments([]);
    router.replace("/citizen/login");
  }, [router]);

  return { session, appointments, loading, error, refresh, logout };
}
