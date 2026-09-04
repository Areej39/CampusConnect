import {
  CalendarDays,
  Check,
  Mail,
  MapPin,
  User,
  Wallet,
  X,
} from "lucide-react";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
};

const paymentStyles = {
  not_required: "bg-slate-100 text-slate-600",
  unpaid: "bg-orange-100 text-orange-700",
  paid: "bg-blue-100 text-blue-700",
  refunded: "bg-purple-100 text-purple-700",
};

const AdminRegistrationRow = ({
  registration,
  onApprove,
  onReject,
  processingId,
}) => {
  const user = registration?.user;
  const event = registration?.event;

  const registrationStatus = registration?.status || "pending";
  const paymentStatus =
    registration?.paymentStatus || "not_required";

  const isPending = registrationStatus === "pending";
  const isProcessing = processingId === registration?._id;

  const formattedPaymentStatus =
    paymentStatus === "not_required"
      ? "Not required"
      : paymentStatus;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_9rem_auto] lg:items-center">
        {/* Student */}
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <User size={18} />
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {user?.name || "Unknown Student"}
              </p>

              <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                <Mail size={13} className="shrink-0" />

                <span className="truncate">
                  {user?.email || "No email"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Event */}
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">
            {event?.title || "Unknown Event"}
          </p>

          <div className="mt-2 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:gap-4">
            <span className="capitalize">
              {event?.category || "Unknown category"}
            </span>

            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} />

              {event?.date
                ? new Date(event.date).toLocaleDateString()
                : "No date"}
            </span>

            <span className="flex items-center gap-1.5">
              <MapPin size={13} />

              <span className="truncate">
                {event?.location || "No location"}
              </span>
            </span>
          </div>

          {registration?.paymentReference && (
            <p className="mt-2 break-all text-xs text-slate-500">
              Payment reference:{" "}
              <span className="font-medium text-slate-700">
                {registration.paymentReference}
              </span>
            </p>
          )}
        </div>

        {/* Status and payment */}
        <div className="flex w-36 shrink-0 flex-col items-start gap-2 lg:items-center">
          <span
            className={`inline-flex min-w-28 justify-center rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
              statusStyles[registrationStatus] ||
              "bg-slate-100 text-slate-600"
            }`}
          >
            {registrationStatus}
          </span>

          <span
            className={`inline-flex min-w-28 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
              paymentStyles[paymentStatus] ||
              "bg-slate-100 text-slate-600"
            }`}
          >
            <Wallet size={13} />
            {formattedPaymentStatus}
          </span>

          <p className="text-center text-xs text-slate-500">
            Fee:{" "}
            <span className="font-semibold text-slate-700">
              {event?.registrationFee > 0
                ? `PKR ${event.registrationFee}`
                : "Free"}
            </span>
          </p>
        </div>

        {/* Admin actions */}
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {isPending && (
            <>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onApprove?.(registration)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={14} />
                {isProcessing ? "Saving..." : "Approve"}
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onReject?.(registration)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={14} />
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default AdminRegistrationRow;