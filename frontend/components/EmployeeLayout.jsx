import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  ScanLine,
  UserCog,
  LogOut,
  Building2,
  Bell,
  Menu,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/employee/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/employee/scan", label: "مسح QR", icon: ScanLine },
  { href: "/employee/appointments", label: "المراجعة اليومية", icon: ClipboardList },
  { href: "/employee/profile", label: "الملف الشخصي", icon: UserCog },
];

export default function EmployeeLayout({ children, employee, onLogout }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  const initials = (employee?.name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("");

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0 fixed lg:relative top-0 right-0 z-40 h-full w-72 bg-navy-500 text-white transition-transform duration-300 flex flex-col flex-shrink-0`}
      >
        {/* Brand */}
        <div className="px-6 pt-8 pb-6 border-b border-navy-400/30 text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-gov-lg">
            <Building2 className="w-10 h-10 text-navy-500" strokeWidth={1.75} />
          </div>
          <h2 className="mt-4 font-bold text-base text-white tracking-tight">
            بوابة الخدمات الرقمية
          </h2>
          <p className="text-xs text-gold-200 mt-1">حساب الموظف</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
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
            onClick={onLogout}
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

            {employee?.branch && (
              <div className="hidden sm:flex flex-col text-sm">
                <span className="text-navy-500 font-semibold leading-tight">
                  {employee.branch.name}
                </span>
                <span className="text-xs text-slate-500">{employee.branch.city}</span>
              </div>
            )}

            <div className="flex-1" />

            <Link
              href="/employee/scan"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-navy-500 text-sm font-bold shadow-gov transition"
            >
              <ScanLine className="h-4 w-4" strokeWidth={2} />
              امسح QR
            </Link>

            <button
              className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              aria-label="الإشعارات"
            >
              <Bell className="h-5 w-5" strokeWidth={1.75} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>

            {employee && (
              <Link
                href="/employee/profile"
                className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="text-end hidden sm:block">
                  <div className="text-sm font-semibold text-navy-500 leading-tight">
                    {employee.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {employee.role === "manager" ? "مدير" : "موظف"} · {employee.employeeCode}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gold-500 text-navy-500 flex items-center justify-center font-bold text-sm">
                  {initials || "م"}
                </div>
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
