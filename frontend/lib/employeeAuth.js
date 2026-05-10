// Employee session — stored in localStorage, similar to the citizen session
// but keyed off the employee code. Branch is included so the dashboard can
// filter today's appointments without a second round-trip.

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { getEmployeeProfile } from "./api";

const STORAGE_KEY = "gov.employee.session";

export function getEmployeeSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveEmployeeSession(session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearEmployeeSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function useEmployeeSession({ requireAuth = true } = {}) {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    const current = getEmployeeSession();
    if (!current?._id) {
      setLoading(false);
      return null;
    }
    try {
      setLoading(true);
      setError(null);
      const fresh = await getEmployeeProfile(current._id);
      setSession(fresh);
      saveEmployeeSession(fresh);
      return fresh;
    } catch (err) {
      // If the profile is gone (e.g. data wiped), force a fresh login
      if (err?.response?.status === 404) {
        clearEmployeeSession();
        if (router.isReady) router.replace("/employee/login");
        return null;
      }
      setError(err?.response?.data?.message || "تعذر تحديث بياناتك");
      // Still expose the cached session so the page can render
      setSession(current);
      return current;
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const existing = getEmployeeSession();
    if (!existing?._id) {
      setLoading(false);
      if (requireAuth && router.isReady) {
        router.replace("/employee/login");
      }
      return;
    }
    setSession(existing);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const logout = useCallback(() => {
    clearEmployeeSession();
    setSession(null);
    router.replace("/employee/login");
  }, [router]);

  return { session, loading, error, refresh, logout };
}
