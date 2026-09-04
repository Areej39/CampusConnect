import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Clock,
  Ticket,
  Wallet,
  CreditCard,
} from "lucide-react";

import { getMyRegistrations } from "../../services/registrationApi";

const registrationStatusStyles = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
};

const paymentStatusStyles = {
  not_required: "bg-slate-100 text-slate-600",
  unpaid: "bg-amber-50 text-amber-700",
  paid: "bg-blue-50 text-blue-700",
  refunded: "bg-purple-50 text-purple-700",
};

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyRegistrations();

        setRegistrations(data.registrations || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load your registrations."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Ticket size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                My Registrations
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track your event registrations and payment status.
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          registrations.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <CalendarDays
                size={42}
                className="mx-auto text-slate-400"
              />

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                No registrations yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Explore campus events and register for one.
              </p>

              <Link
                to="/events"
                className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Browse Events
              </Link>
            </div>
          )}

        {/* Registrations */}
        {!loading &&
          !error &&
          registrations.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {registrations.map((registration) => {
                const event = registration.event;

                if (!event) {
                  return null;
                }

                const registrationStatus =
                  registration.status || "pending";

                const paymentStatus =
                  registration.paymentStatus || "not_required";

                const eventFee = Number(
                  event.registrationFee || 0
                );

                return (
                  <article
                    key={registration._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                        {event.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          registrationStatusStyles[
                            registrationStatus
                          ] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {registrationStatus}
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-slate-900">
                      {event.title}
                    </h2>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <CalendarDays
                          size={17}
                          className="shrink-0 text-emerald-600"
                        />

                        <span>
                          {new Date(
                            event.date
                          ).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Clock
                          size={17}
                          className="shrink-0 text-emerald-600"
                        />

                        <span>
                          {new Date(
                            event.date
                          ).toLocaleTimeString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <MapPin
                          size={17}
                          className="shrink-0 text-emerald-600"
                        />

                        <span className="break-words">
                          {event.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Wallet
                          size={17}
                          className="shrink-0 text-emerald-600"
                        />

                        <span>
                          Event Fee:{" "}
                          <strong className="text-slate-900">
                            {eventFee > 0
                              ? `PKR ${eventFee.toLocaleString()}`
                              : "Free"}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <CreditCard
                          size={17}
                          className="shrink-0 text-emerald-600"
                        />

                        <span>
                          Payment:{" "}
                          <strong
                            className={`capitalize ${
                              paymentStatusStyles[paymentStatus]
                                ? ""
                                : "text-slate-700"
                            }`}
                          >
                            {paymentStatus.replace("_", " ")}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {registration.paymentReference && (
                      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
                        <p className="font-semibold">
                          Payment Reference
                        </p>

                        <p className="mt-1 break-all">
                          {registration.paymentReference}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm">
                      <span className="text-slate-500">
                        Registration Status
                      </span>

                      <span className="font-semibold capitalize text-slate-900">
                        {registrationStatus}
                      </span>
                    </div>

                    <Link
                      to={`/events/${event._id}`}
                      className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      View Event
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
      </section>
    </main>
  );
};

export default MyRegistrations;