import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  QrCode,
  UserCircle,
  LogOut,
  Bell,
  Menu,
} from "lucide-react";
import { useCitizenSession } from "../lib/citizenAuth.js";

const NAV_ITEMS = [
  { to: "/citizen/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { to: "/citizen/appointments", label: "حجوزاتي", icon: CalendarCheck },
  { to: "/citizen/confirmation", label: "تأكيد الحضور (QR)", icon: QrCode },
  { to: "/citizen/profile", label: "الملف الشخصي", icon: UserCircle },
];

export default function CitizenLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session: citizen, logout } = useCitizenSession();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const initials = (citizen?.citizenName || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("");

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden" dir="rtl">
      <aside
        className={`${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0 fixed lg:relative top-0 right-0 z-40 h-full w-72 bg-navy-500 text-white transition-transform duration-300 flex flex-col flex-shrink-0`}
      >
        <div className="px-6 pt-8 pb-6 border-b border-navy-400/30 text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-gov-lg p-2">
            <img src="/egypt-emblem.jpeg" alt="شعار الجمهورية" className="w-full h-full object-contain" />
          </div>
          <h2 className="mt-4 font-bold text-base text-white tracking-tight">
            بوابة الخدمات الرقمية
          </h2>
          <p className="text-xs text-gold-200 mt-1">حساب المواطن</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-gold-500 text-navy-500 font-semibold shadow-gov"
                    : "text-white/80 hover:bg-navy-400/40 hover:text-gold-200"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-navy-400/30">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-red-500/20 hover:text-red-200 transition"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.75} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="bg-white border-b border-slate-200 flex-shrink-0">
          <div className="px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-navy-500"
              aria-label="فتح القائمة"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>

            <div className="flex-1" />

            <button
              className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              aria-label="الإشعارات"
            >
              <Bell className="h-5 w-5" strokeWidth={1.75} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {citizen && (
              <Link
                to="/citizen/profile"
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="text-end hidden sm:block">
                  <div className="text-sm font-semibold text-navy-500 leading-tight">
                    {citizen.citizenName}
                  </div>
                  <div className="text-[11px] text-slate-500">مواطن</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gold-500 text-navy-500 flex items-center justify-center font-bold text-sm">
                  {initials || "م"}
                </div>
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
