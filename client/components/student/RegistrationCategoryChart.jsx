const RegistrationCategoryChart = ({ data = [], }) => {
  const maxValue = Math.max(
    ...data.map((item) => item.totalRegistrations),
    1
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Registrations by Category
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution of registered students across event categories.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex min-h-48 items-center justify-center rounded-xl bg-slate-50">
          <p className="text-sm text-slate-500">
            No registration data available.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {data.map((item) => {
            const percentage =
              (item.totalRegistrations / maxValue) * 100;

            return (
              <div key={item._id}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="min-w-0 truncate text-sm font-medium capitalize text-slate-700">
                    {item._id}
                  </span>

                  <span className="text-sm font-semibold text-slate-900">
                    {item.totalRegistrations}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RegistrationCategoryChart;