import { createContext, useContext, useEffect } from "react";

const TRANSLATIONS = {
  "app.title": "بوابة الحجز الحكومية",
  "app.subtitle": "بوابة خدمات المواطنين",
  "nav.services": "الخدمات",
  "nav.tagline": "احجز موعدك إلكترونياً",
  "footer.rights": "بوابة الحجز الحكومية. جميع الحقوق محفوظة.",
  "breadcrumb.services": "الخدمات",
  "breadcrumb.branches": "الفروع",
  "breadcrumb.slots": "المواعيد",

  "services.title": "الخدمات الحكومية",
  "services.subtitle": "اختر الخدمة لحجز موعدك",
  "services.loading": "جاري تحميل الخدمات الحكومية...",
  "services.error": "تعذر تحميل الخدمات. حاول مجدداً.",
  "services.empty": "لا توجد خدمات متاحة حالياً.",

  "branches.back": "العودة إلى الخدمات",
  "branches.title": "اختر الفرع",
  "branches.subtitle": "الفروع المتاحة لـ",
  "branches.loading": "جاري تحميل الفروع...",
  "branches.error": "تعذر تحميل الفروع. حاول مجدداً.",
  "branches.empty": "لا توجد فروع متاحة لهذه الخدمة.",
  "branches.noService": "لم يتم اختيار خدمة. ارجع واختر خدمة أولاً.",

  "slots.back": "العودة إلى الفروع",
  "slots.title": "اختر الموعد",
  "slots.loading": "جاري تحميل المواعيد المتاحة...",
  "slots.error": "تعذر تحميل المواعيد. حاول مجدداً.",
  "slots.empty": "لا توجد مواعيد متاحة لهذا الفرع.",
  "slots.noBranch": "لم يتم اختيار فرع. ارجع واختر فرعاً أولاً.",
  "slots.selected": "تم اختيار الموعد",
  "slots.branch": "الفرع",
  "slots.city": "المدينة",
  "slots.date": "التاريخ",
  "slots.time": "الوقت",

  "common.retry": "حاول مجدداً",
  "common.loading": "جاري التحميل...",
};

const LanguageContext = createContext({
  lang: "ar",
  t: (k) => k,
  localized: (item, field) => item?.[field],
  dateLocale: "ar-EG",
});

export function LanguageProvider({ children }) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }, []);

  const t = (key) => TRANSLATIONS[key] ?? key;
  const localized = (item, field) => item?.[field] ?? "";

  return (
    <LanguageContext.Provider value={{ lang: "ar", t, localized, dateLocale: "ar-EG" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
