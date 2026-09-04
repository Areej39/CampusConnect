import {
  CalendarDays,
  MapPin,
  Users,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

const getStatusClasses = (status) => {
  const statusClasses = {
    draft: "bg-amber-100 text-amber-700",
    published: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-slate-200 text-slate-700",
  };

  return (
    statusClasses[status] ||
    "bg-slate-100 text-slate-600"
  );
};

const AdminEventRow = ({
  event,
  onEdit,
  onDelete,
  onPublish,
  onCancelEvent,
}) => {
  const eventStatus = event?.status || "draft";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_7rem_auto] lg:items-center">
        {/* Event title and category */}
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CalendarDays size={18} />
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {event?.title || "Untitled Event"}
              </p>

              <p className="mt-1 text-sm capitalize text-slate-500">
                {event?.category || "No category"}
              </p>
            </div>
          </div>
        </div>

        {/* Event details */}
        <div className="min-w-0">
          <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:gap-x-4 sm:gap-y-1.5">
            <span className="flex items-center gap-1.5">
              <CalendarDays
                size={13}
                className="shrink-0"
              />

              {event?.date
                ? new Date(event.date).toLocaleDateString()
                : "No date"}
            </span>

            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin
                size={13}
                className="shrink-0"
              />

              <span className="truncate">
                {event?.location || "No location"}
              </span>
            </span>

            <span className="flex items-center gap-1.5">
              <Users
                size={13}
                className="shrink-0"
              />

              {event?.registrationsCount || 0}/
              {event?.capacity || 0} registered
            </span>
          </div>
        </div>

        {/* Fixed-width status column */}
        <div className="flex w-28 shrink-0 justify-start lg:w-28 lg:justify-center">
          <span
            className={`inline-flex min-w-24 items-center justify-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
              eventStatus
            )}`}
          >
            {eventStatus}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <button
            type="button"
            onClick={() => onEdit?.(event)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(event)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </button>

          {eventStatus === "draft" && (
            <button
              type="button"
              onClick={() => onPublish?.(event)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
            >
              <CheckCircle size={14} />
              Publish
            </button>
          )}

          {eventStatus === "published" && (
            <button
              type="button"
              onClick={() => onCancelEvent?.(event)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              <XCircle size={14} />
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEventRow;