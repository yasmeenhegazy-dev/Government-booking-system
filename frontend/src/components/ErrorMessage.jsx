import { AlertCircle } from "lucide-react";
import { useTranslation } from "../lib/i18n";

export default function ErrorMessage({ message, onRetry }) {
  const { t } = useTranslation();
  return (
    <div className="card-standard bg-red-50 border border-red-200 text-center">
      <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" strokeWidth={1.75} />
      <p className="text-red-700 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition font-semibold"
        >
          {t("common.retry")}
        </button>
      )}
    </div>
  );
}
