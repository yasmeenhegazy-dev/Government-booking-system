import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Car,
  FileText,
  Home,
  CreditCard,
  Receipt,
  ArrowLeft,
} from "lucide-react";
import { getServices } from "../lib/api.js";
import { useTranslation } from "../lib/i18n.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

const ICON_MAP = {
  passport: BookOpen,
  "id-card": CreditCard,
  car: Car,
  "file-text": FileText,
  home: Home,
  receipt: Receipt,
  "clipboard-list": FileText,
};

export default function ServicesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getServices();
      setServices(data);
    } catch (err) {
      setError(t("services.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSelect = (service) => {
    const params = new URLSearchParams({
      serviceId: service._id,
      serviceName: service.name,
    });
    navigate(`/branches?${params.toString()}`);
  };

  if (loading) return <LoadingSpinner message={t("services.loading")} />;
  if (error) return <ErrorMessage message={error} onRetry={fetchServices} />;

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-500">{t("services.title")}</h2>
        <p className="text-slate-500 mt-1">{t("services.subtitle")}</p>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComponent = ICON_MAP[service.icon] || FileText;
          return (
            <button
              key={service._id}
              onClick={() => handleSelect(service)}
              className="group card-standard text-start
                         hover:shadow-gov-lg hover:-translate-y-1 transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2
                         border border-transparent hover:border-gold-300"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-navy-50 flex items-center justify-center group-hover:bg-navy-500 transition-colors">
                  <IconComponent
                    className="h-6 w-6 text-navy-500 group-hover:text-gold-400 transition-colors"
                    strokeWidth={1.75}
                  />
                </div>
                <ArrowLeft
                  className="h-5 w-5 text-slate-300 group-hover:text-gold-500 transition-all"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-navy-500 group-hover:text-gold-600 transition-colors">
                {service.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                {service.description}
              </p>
            </button>
          );
        })}
      </div>

      {services.length === 0 && !loading && (
        <div className="text-center py-16 text-slate-400">{t("services.empty")}</div>
      )}
    </div>
  );
}
