import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  Printer,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import { useTranslation } from "../lib/i18n.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { saveCitizenSession, getCitizenSession } from "../lib/citizenAuth.js";

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, dateLocale } = useTranslation();
  const ref = searchParams.get("ref");
  const serviceName = searchParams.get("serviceName");
  const branchName = searchParams.get("branchName");
  const branchCity = searchParams.get("branchCity");
  const slotDate = searchParams.get("slotDate");
  const slotStart = searchParams.get("slotStart");
  const slotEnd = searchParams.get("slotEnd");
  const citizenName = searchParams.get("citizenName");
  const citizenEmail = searchParams.get("citizenEmail");
  const citizenPhone = searchParams.get("citizenPhone");
  const nationalId = searchParams.get("nationalId");

  useEffect(() => {
    // Only auto-create a session for anonymous bookings (no existing login).
    // If the user is already logged in, their identity is set from auth and
    // should not be overwritten by whatever they typed in the booking form.
    if (nationalId && citizenName && !getCitizenSession()?.nationalId) {
      saveCitizenSession({
        nationalId,
        citizenName,
        citizenEmail: citizenEmail || "",
        citizenPhone: citizenPhone || "",
      });
    }
  }, [nationalId, citizenName, citizenEmail, citizenPhone]);

  const formattedDate = useMemo(() => {
    if (!slotDate) return "";
    return new Date(slotDate).toLocaleDateString(dateLocale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [slotDate, dateLocale]);

  if (!ref) {
    return <ErrorMessage message={t("confirm.missing")} onRetry={() => navigate("/")} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card-standard text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" strokeWidth={1.75} />
        </div>
        <h2 className="text-2xl font-bold text-navy-500">{t("success.title")}</h2>
        <p className="text-slate-500 mt-1">{t("success.subtitle")}</p>

        <div className="mt-6 inline-block bg-navy-50 border border-gold-300 rounded-xl px-6 py-4">
          <div className="text-xs text-slate-500">{t("success.reference")}</div>
          <div className="mt-1 text-2xl font-bold text-navy-600 tracking-wider" dir="ltr">
            {ref}
          </div>
        </div>
      </div>

      <div className="card-standard mt-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Item icon={User} label={t("success.name")} value={citizenName} />
          <Item label={t("success.service")} value={serviceName} />
          <Item icon={MapPin} label={t("success.branch")} value={branchName} />
          <Item label={t("success.city")} value={branchCity} />
          <Item icon={Calendar} label={t("success.date")} value={formattedDate} />
          <Item
            icon={Clock}
            label={t("success.time")}
            value={`${slotStart} - ${slotEnd}`}
            dir="ltr"
          />
        </dl>

        <div className="mt-6 rounded-lg bg-gold-50 border border-gold-200 px-4 py-3 text-sm text-gold-800">
          {t("success.note")}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center print:hidden">
        <button
          onClick={() => navigate("/citizen/dashboard")}
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
          {t("success.dashboard")}
        </button>
        <button
          onClick={() => navigate("/")}
          className="btn-secondary inline-flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          {t("success.newBooking")}
        </button>
        <button
          onClick={() => window.print()}
          className="btn-secondary inline-flex items-center justify-center gap-2"
        >
          <Printer className="h-4 w-4" strokeWidth={1.75} />
          {t("success.print")}
        </button>
      </div>
    </div>
  );
}

function Item({ icon: Icon, label, value, dir }) {
  return (
    <div>
      <dt className="text-xs text-slate-500 flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />}
        {label}
      </dt>
      <dd className="font-medium text-navy-600 mt-0.5" dir={dir}>
        {value}
      </dd>
    </div>
  );
}
