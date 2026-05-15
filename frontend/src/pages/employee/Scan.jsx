import { useEffect, useRef, useState, useCallback } from "react";
import {
  ScanLine,
  Camera,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  User,
  Calendar,
  Clock,
  IdCard,
  ShieldCheck,
} from "lucide-react";
import { useEmployeeSession } from "../../lib/employeeAuth.js";
import { verifyQrCode } from "../../lib/api.js";

const SCANNER_DOM_ID = "qr-scanner-region";

export default function EmployeeScan() {
  const { session, loading: sessionLoading } = useEmployeeSession();
  const [mode, setMode] = useState("camera"); // 'camera' | 'file'
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // { ok, message, code, data, raw }
  const [verifying, setVerifying] = useState(false);
  const html5Ref = useRef(null);

  // Stop the camera stream cleanly on every unmount/mode-change
  const stopScanner = useCallback(async () => {
    const inst = html5Ref.current;
    if (!inst) return;
    try {
      if (inst._isScanning) {
        await inst.stop();
        inst._isScanning = false;
      }
      await inst.clear();
    } catch (e) {
      // Already stopped — ignore
    }
  }, []);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  const handleScanResult = useCallback(
    async (decodedText) => {
      if (!session?._id) return;
      let qrPayload = null;
      try {
        qrPayload = JSON.parse(decodedText);
      } catch {
        setResult({
          ok: false,
          code: "BAD_QR",
          message: "الرمز ليس بصيغة صحيحة. تأكد أنه رمز حجز من البوابة.",
          raw: decodedText,
        });
        return;
      }
      if (!qrPayload?.ref) {
        setResult({
          ok: false,
          code: "BAD_QR",
          message: "الرمز لا يحتوي على رقم حجز.",
          raw: decodedText,
        });
        return;
      }

      try {
        setVerifying(true);
        const response = await verifyQrCode(session._id, qrPayload);
        setResult({
          ok: true,
          message: response.message || "تم تأكيد حضور المواطن",
          data: response.data,
        });
      } catch (err) {
        const data = err?.response?.data;
        setResult({
          ok: false,
          code: data?.code,
          message: data?.message || "تعذر التحقق من الرمز",
          data: data?.data,
        });
      } finally {
        setVerifying(false);
      }
    },
    [session?._id]
  );

  // Camera mode lifecycle
  useEffect(() => {
    if (mode !== "camera" || !session?._id || result) return;
    let cancelled = false;

    async function startCamera() {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;
      const inst = new Html5Qrcode(SCANNER_DOM_ID, /* verbose */ false);
      html5Ref.current = inst;
      setScanning(true);

      // Try strategies in order: rear cam → front cam → any enumerated camera.
      // Laptops usually only expose a front camera, so "environment" can fail.
      const strategies = [
        { facingMode: { ideal: "environment" } },
        { facingMode: "user" },
      ];

      try {
        const cameras = await Html5Qrcode.getCameras().catch(() => []);
        if (cameras && cameras.length > 0) {
          strategies.push(cameras[0].id);
        }
      } catch {}

      let started = false;
      let lastErr = null;
      for (const source of strategies) {
        if (cancelled) return;
        try {
          await inst.start(
            source,
            { fps: 10, qrbox: { width: 240, height: 240 } },
            async (decodedText) => {
              try {
                await inst.stop();
                inst._isScanning = false;
              } catch {}
              handleScanResult(decodedText);
            },
            () => {}
          );
          inst._isScanning = true;
          started = true;
          break;
        } catch (err) {
          lastErr = err;
        }
      }

      if (!started) {
        const msg = String(lastErr?.message || lastErr || "");
        let humanMsg;
        if (msg.includes("Permission") || msg.includes("NotAllowed")) {
          humanMsg = "تم رفض الوصول للكاميرا. اسمح بالوصول من إعدادات المتصفح أو استخدم 'رفع صورة'.";
        } else if (msg.includes("NotReadable") || msg.includes("in use") || msg.includes("AbortError")) {
          humanMsg = "الكاميرا مستخدمة في تطبيق آخر (مثل Google Meet أو Zoom). أغلق التطبيق وحاول مجدداً، أو استخدم 'رفع صورة'.";
        } else if (msg.includes("NotFound") || msg.includes("DevicesNotFound")) {
          humanMsg = "لا توجد كاميرا متاحة. استخدم 'رفع صورة' بدلاً منها.";
        } else {
          humanMsg = "تعذر تشغيل الكاميرا. تأكد من إغلاق Meet/Zoom، أو استخدم 'رفع صورة'.";
        }
        setResult({ ok: false, code: "CAMERA", message: humanMsg });
      }
      setScanning(false);
    }

    startCamera();
    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [mode, session?._id, result, handleScanResult, stopScanner]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setScanning(true);
      const { Html5Qrcode } = await import("html5-qrcode");
      const inst = new Html5Qrcode(SCANNER_DOM_ID);
      const decodedText = await inst.scanFile(file, /* showImage */ false);
      await inst.clear();
      handleScanResult(decodedText);
    } catch (err) {
      setResult({
        ok: false,
        code: "FILE",
        message: "تعذر قراءة الرمز من الصورة. جرّب صورة أوضح.",
      });
    } finally {
      setScanning(false);
      // Reset input so the same file can be selected again
      e.target.value = "";
    }
  };

  const reset = useCallback(async () => {
    setResult(null);
    await stopScanner();
  }, [stopScanner]);

  if (sessionLoading) {
    return <div className="text-center text-slate-500 py-20">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-500 flex items-center gap-2">
            <ScanLine className="h-6 w-6 text-gold-600" strokeWidth={1.75} />
            مسح رمز QR المواطن
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            وجّه الكاميرا نحو رمز QR الموجود مع المواطن، أو ارفع صورة الرمز.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="inline-flex bg-white border border-slate-200 rounded-xl p-1 mb-5 shadow-gov">
          <ModeButton
            active={mode === "camera"}
            onClick={() => {
              setMode("camera");
              setResult(null);
            }}
            icon={Camera}
            label="كاميرا مباشرة"
          />
          <ModeButton
            active={mode === "file"}
            onClick={async () => {
              await stopScanner();
              setMode("file");
              setResult(null);
            }}
            icon={Upload}
            label="رفع صورة"
          />
        </div>

        {/* Scanner area */}
        <div className="card-standard">
          {!result && (
            <div className="bg-slate-900 rounded-xl overflow-hidden relative" style={{ minHeight: 320 }}>
              <div id={SCANNER_DOM_ID} className="w-full" dir="ltr" />
              {(scanning || verifying) && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="bg-black/60 text-white text-sm rounded-lg px-4 py-2 inline-flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                    {verifying ? "جاري التحقق..." : "جاري التشغيل..."}
                  </div>
                </div>
              )}

              {mode === "file" && !scanning && (
                <div className="p-10 text-center text-white/70">
                  <Upload className="h-10 w-10 mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm mb-4">اختر صورة تحتوي على رمز QR للحجز</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-navy-500 text-sm font-bold cursor-pointer">
                    <Upload className="h-4 w-4" strokeWidth={2} />
                    اختر صورة
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Result panel */}
          {result && (
            <ResultPanel result={result} onReset={reset} />
          )}
        </div>

        {/* Tips */}
        <div className="mt-5 rounded-xl bg-gold-50 border border-gold-200 p-4 text-sm text-gold-800">
          <p className="font-semibold mb-1 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" strokeWidth={2} />
            ملاحظات
          </p>
          <ul className="list-disc ps-5 space-y-0.5 text-xs leading-relaxed">
            <li>تأكد أن رمز QR في حدود الإطار المحدد على الشاشة.</li>
            <li>عند التأكيد، سيتم تحديث حالة الحجز إلى "تم التحقق" فوراً في النظام.</li>
            <li>لا يمكن تسجيل حضور حجز ملغي أو حجز خاص بفرع آخر.</li>
          </ul>
        </div>
    </div>
  );
}

function ModeButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 transition ${
        active ? "bg-navy-500 text-white" : "text-slate-600 hover:text-navy-500"
      }`}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
      {label}
    </button>
  );
}

function ResultPanel({ result, onReset }) {
  const { ok, message, code, data } = result;
  const apt = data;

  // Success or warning (already verified is informational, not really success)
  const isSuccess = ok;
  const isWarn = !ok && (code === "ALREADY_VERIFIED" || code === "CANCELLED" || code === "WRONG_BRANCH" || code === "MISMATCH");
  const isError = !ok && !isWarn;

  const colorCfg = isSuccess
    ? { ring: "bg-green-100", icon: "text-green-600", IconC: CheckCircle2, badge: "bg-green-50 text-green-700 border-green-200" }
    : isWarn
    ? { ring: "bg-amber-100", icon: "text-amber-600", IconC: AlertCircle, badge: "bg-amber-50 text-amber-700 border-amber-200" }
    : { ring: "bg-red-100", icon: "text-red-600", IconC: AlertCircle, badge: "bg-red-50 text-red-700 border-red-200" };

  return (
    <div className="text-center py-6">
      <div className={`mx-auto w-20 h-20 rounded-full ${colorCfg.ring} flex items-center justify-center mb-4`}>
        <colorCfg.IconC className={`h-10 w-10 ${colorCfg.icon}`} strokeWidth={1.75} />
      </div>
      <h3 className="text-xl font-bold text-navy-500 mb-1">
        {isSuccess ? "تم تأكيد الحضور" : isWarn ? "تنبيه" : "فشل التحقق"}
      </h3>
      <p className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${colorCfg.badge}`}>
        {message}
      </p>

      {apt && (
        <div className="mt-6 max-w-md mx-auto bg-slate-50 rounded-xl p-4 text-start space-y-2">
          <Row icon={User} label="المواطن" value={apt.citizenName} />
          <Row icon={IdCard} label="الرقم القومي" value={apt.nationalId} dir="ltr" />
          <Row label="الخدمة" value={apt.serviceId?.name} />
          <Row icon={Calendar} label="التاريخ" value={formatDate(apt.slotId?.date)} />
          <Row icon={Clock} label="التوقيت" value={`${apt.slotId?.startTime} - ${apt.slotId?.endTime}`} dir="ltr" />
          <Row label="رقم الحجز" value={apt.bookingReference} dir="ltr" />
          <Row label="الحالة" value={statusLabel(apt.status)} />
        </div>
      )}

      <button
        onClick={onReset}
        className="btn-primary inline-flex items-center gap-2 mt-6"
      >
        <ScanLine className="h-4 w-4" strokeWidth={2} />
        مسح رمز جديد
      </button>
    </div>
  );
}

function Row({ icon: Icon, label, value, dir }) {
  return (
    <div className="flex items-start gap-3 text-sm border-b border-slate-200 last:border-0 pb-2 last:pb-0">
      <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.75} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-slate-500">{label}</div>
        <div className="font-medium text-navy-600 mt-0.5 truncate" dir={dir}>{value || "—"}</div>
      </div>
    </div>
  );
}

function statusLabel(status) {
  switch (status) {
    case "confirmed": return "في الانتظار";
    case "verified": return "تم التحقق";
    case "completed": return "منجز";
    case "cancelled": return "ملغي";
    default: return status || "—";
  }
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
