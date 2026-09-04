import { Search, X } from "lucide-react";

const AdminRegistrationFilters = ({
  search,
  setSearch,
  event,
  setEvent,
  status,
  setStatus,
  events,
  onClear,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_180px_auto]">
        {/* Search */}
        <div className="min-w-0">
          <label
            htmlFor="registration-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Search
          </label>

          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="registration-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name or email..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>

        {/* Event */}
        <div>
          <label
            htmlFor="registration-event"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Event
          </label>

          <select
            id="registration-event"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All Events</option>

            {events.map((item) => (
              <option key={item._id} value={item._id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="registration-status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="registration-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Clear */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={onClear}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 lg:w-auto"
          >
            <X size={17} />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrationFilters;