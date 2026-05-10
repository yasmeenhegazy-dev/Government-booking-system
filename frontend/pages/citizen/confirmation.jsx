import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  IdCard,
  Printer,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import CitizenLayout from "../../components/CitizenLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useCitizenSession } from "../../lib/citizenAuth";
import { getAppointmentByReference } from "../../lib/api";

export default function CitizenConfirmation() {
  const router = useRouter();
  const { session, appointments, loading, logout } = useCitizenSession();
  const [resolved, setResolved] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState(null);

  const queryRef = router.query.ref;

  // Pick the appointment to show:
  // 1. If ?ref=... in URL, fetch it directly
  // 2. Otherwise, the next upcoming confirmed appointment
  const fallback = useMemo(() => {
    if (!appointments?.length) return null;
    const today = startOfToday();
    return (
      appointments
        .filter((a) => a.status === "confirmed" && new Date(a.slotId?.date) >= today)
        .sort((a, b) => new Date(a.slotId?.date) - new Date(b.slotId?.date))[0] || null
    );
  }, [appointments]);

  useEffect(() => {
    let cancelled = false;
    async function resolveByRef() {
      if (!queryRef) {
        setResolved(null);
        return;
      }
      try {
        setResolving(true);
        setResolveError(null);
        const apt = await getAppointmentByReference(queryRef);
        if (!cancelled) setResolved(apt);
      } catch (err) {
        if (!cancelled) {
          setResolveError(
            err?.response?.data?.message || "تعذر العثور على الحجز المطلوب."
          );
          setResolved(null);
        }
      } finally {
        if (!cancelled) setResolving(false);
      }
    }
    resolveByRef();
    return () => {
      cancelled = true;
    };
  }, [queryRef]);

  const apt = resolved || fallback;

  if (loading || resolving) {
    return (
      <CitizenLayout citizen={session} onLogout={logout}>
        <LoadingSpinner message="جاري تحميل بيانات التأكيد..." />
      </CitizenLayout>
    );
  }

  if (!apt) {
    return (
      <CitizenLayout citizen={session} onLogout={logout}>
        <div className="max-w-2xl mx-auto card-standard text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-slate-300 mb-3" strokeWidth={1.5} />
          <h2 className="text-lg font-bold text-navy-500">لا يوجد حجز للعرض</h2>
          <p className="text-slate-500 text-sm mt-1">
            {resolveError || "ليس لديك حجوزات قادمة لعرض رمز QR الخاص بها."}
          </p>
          <div className="flex gap-3 justify-center mt-5">
            <Link href="/citizen/appointments" className="btn-secondary">
              عرض الحجوزات
            </Link>
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              احجز موعداً
            </Link>
          </div>
        </div>
      </CitizenLayout>
    );
  }

  const qrPayload = JSON.stringify({
    ref: apt.bookingReference,
    nid: apt.nationalId,
    sid: apt.serviceId?._id || apt.serviceId,
    bid: apt.branchId?._id || apt.branchId,
    slot: apt.slotId?._id || apt.slotId,
  });

  return (
    <CitizenLayout citizen={session} onLogout={logout}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-500">رمز التأكيد QR</h1>
          <p className="text-slate-500 text-sm mt-1">
            اعرض هذا الرمز لموظف الفرع عند الحضور للتحقق من حجزك.
          </p>
        </div>

        <div className="card-standard print:shadow-none print:border print:border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR */}
            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-xl shadow-gov" dir="ltr">
                <QRCodeCanvas
                  value={qrPayload}
                  size={220}
                  level="H"
                  includeMargin={false}
                  fgColor="#0A2540"
                  bgColor="#FFFFFF"
                />
              </div>

              <div className="mt-4 text-center">
                <div className="text-xs text-slate-500">رقم الحجز</div>
                <div className="text-xl font-bold text-navy-600 tracking-wider mt-1" dir="ltr">
                  {apt.bookingReference}
                </div>
              </div>

              <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
                حجز موثق ومؤكد
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <Detail icon={User} label="اسم المواطن" value={apt.citizenName} />
              <Detail icon={IdCard} label="الرقم القومي" value={apt.nationalId} dir="ltr" />
              <Detail label="الخدمة" value={apt.serviceId?.name} />
              <Detail icon={MapPin} label="الفرع" value={`${apt.branchId?.name}`} />
              <Detail label="المدينة" value={apt.branchId?.city} />
              <Detail icon={Calendar} label="التاريخ" value={formatDate(apt.slotId?.date)} />
              <Detail
                icon={Clock}
                label="التوقيت"
                value={`${apt.slotId?.startTime} - ${apt.slotId?.endTime}`}
                dir="ltr"
              />
            </div>
          </div>

          <div className="mt-6 bg-gold-50 border border-gold-200 rounded-lg p-4 text-sm text-gold-800">
            <p className="font-semibold mb-1">ملاحظات هامة:</p>
            <ul className="list-disc ps-5 space-y-0.5 text-xs leading-relaxed">
              <li>يرجى الحضور قبل الموعد بـ 15 دقيقة على الأقل.</li>
              <li>أحضر بطاقة الرقم القومي الأصلية معك.</li>
              <li>سيقوم موظف الفرع بمسح هذا الرمز للتحقق من حجزك.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center print:hidden">
          <Link
            href="/citizen/appointments"
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            العودة للحجوزات
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <Printer className="h-4 w-4" strokeWidth={1.75} />
            طباعة التأكيد
          </button>
        </div>
      </div>
    </CitizenLayout>
  );
}

function Detail({ icon: Icon, label, value, dir }) {
  return (
    <div className="flex items-start gap-3 py-1.5 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        {Icon && <Icon className="h-4 w-4 text-slate-500" strokeWidth={1.75} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="font-medium text-navy-600 text-sm mt-0.5 truncate" dir={dir}>
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
