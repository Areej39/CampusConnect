import {
  Users,
  CalendarDays,
  ClipboardList,
  Wallet,
  Clock,
  XCircle,
} from "lucide-react";

const AdminStatCard = ({
  type,
  label,
  value,
  description,
}) => {
  const icons = {
    students: Users,
    events: CalendarDays,
    registrations: ClipboardList,
    revenue: Wallet,
    pending: Clock,
    cancelled: XCircle,
  };

  const Icon = icons[type] || ClipboardList;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 sm:h-12 sm:w-12">
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
};

export default AdminStatCard;