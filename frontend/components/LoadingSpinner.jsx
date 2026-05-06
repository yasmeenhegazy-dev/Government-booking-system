import { useTranslation } from "../lib/i18n";

export default function LoadingSpinner({ message }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-navy-100 border-t-gold-500 rounded-full animate-spin" />
      <p className="mt-4 text-slate-500 text-sm">{message ?? t("common.loading")}</p>
    </div>
  );
}
