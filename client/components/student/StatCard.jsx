const StatCard = ({ icon: Icon, label, value, description }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Icon size={21} />
        </div>
      </div>

      {description && (
        <p className="mt-4 text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatCard;