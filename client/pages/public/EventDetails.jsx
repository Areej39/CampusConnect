import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  User,
  Clock,
  CheckCircle2,
  Wallet,
  CreditCard,
} from "lucide-react";

import { getEventById } from "../../services/eventApi";
import {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  submitPayment,
} from "../../services/registrationApi";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [myRegistration, setMyRegistration] = useState(null);

  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const [paymentReference, setPaymentReference] = useState("");
  const [error, setError] = useState("");
  const [registrationMessage, setRegistrationMessage] =
    useState("");

  const token = localStorage.getItem("token");

  const registrationFee = Number(event?.registrationFee || 0);
  const isPaidEvent = registrationFee > 0;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEventById(id);

        setEvent(data.event);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load event."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    const fetchMyRegistration = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await getMyRegistrations();

        const registration = (data.registrations || []).find(
          (item) => item.event?._id === id
        );

        setMyRegistration(registration || null);
      } catch (error) {
        console.error(
          "Failed to check registration:",
          error
        );
      }
    };

    fetchMyRegistration();
  }, [id, token]);

  const handleRegister = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setRegistering(true);
      setRegistrationMessage("");
      setError("");

      const data = await registerForEvent(id);

      setRegistrationMessage(data.message);
      setMyRegistration(data.registration);

      setEvent((currentEvent) => ({
        ...currentEvent,
        registrationsCount:
          Number(currentEvent.registrationsCount || 0) + 1,
      }));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    if (!myRegistration) {
      return;
    }

    try {
      setCancelling(true);
      setRegistrationMessage("");
      setError("");

      const data = await cancelRegistration(
        myRegistration._id
      );

      setRegistrationMessage(data.message);
      setMyRegistration(null);
      setPaymentReference("");

      setEvent((currentEvent) => ({
        ...currentEvent,
        registrationsCount: Math.max(
          Number(currentEvent.registrationsCount || 0) - 1,
          0
        ),
      }));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Cancellation failed. Please try again."
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleSubmitPayment = async (event) => {
    event.preventDefault();

    if (!myRegistration) {
      return;
    }

    if (!paymentReference.trim()) {
      setError("Please enter your payment reference.");
      return;
    }

    try {
      setSubmittingPayment(true);
      setError("");
      setRegistrationMessage("");

      const data = await submitPayment(
        myRegistration._id,
        paymentReference.trim()
      );

      setRegistrationMessage(data.message);
      setMyRegistration(data.registration);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Payment submission failed. Please try again."
      );
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-8 h-96 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error && !event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
        <div className="w-full max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center sm:p-8">
          <h1 className="text-xl font-bold text-red-700">
            Unable to load event
          </h1>

          <p className="mt-2 break-words text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={() => navigate("/events")}
            className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Back to Events
          </button>
        </div>
      </main>
    );
  }

  if (!event) {
    return null;
  }

  const registeredCount = Number(
    event.registrationsCount || 0
  );

  const capacity = Number(event.capacity || 0);

  const remainingSeats = Math.max(
    capacity - registeredCount,
    0
  );

  const registrationPercentage =
    capacity > 0
      ? Math.min((registeredCount / capacity) * 100, 100)
      : 0;

  const paymentStatus =
    myRegistration?.paymentStatus || "not_required";

  const registrationStatus =
    myRegistration?.status || "pending";

  const canSubmitPayment =
    myRegistration &&
    isPaidEvent &&
    paymentStatus === "unpaid" &&
    registrationStatus === "pending";

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          to="/events"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600 sm:mb-8"
        >
          <ArrowLeft size={17} />
          Back to Events
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl">
          {/* Header */}
          <div className="bg-emerald-600 px-5 py-8 text-white sm:px-10 sm:py-10">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold capitalize">
              {event.category}
            </span>

            <h1 className="mt-4 max-w-3xl break-words text-2xl font-bold leading-tight sm:mt-5 sm:text-4xl">
              {event.title}
            </h1>

            <p className="mt-4 max-w-2xl break-words text-sm leading-6 text-emerald-50 sm:text-base">
              {event.description}
            </p>
          </div>

          {/* Content */}
          <div className="grid gap-8 p-5 sm:p-10 lg:grid-cols-3">
            {/* Information */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-slate-900">
                Event Information
              </h2>

              <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5">
                {/* Date */}
                <div className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                  <CalendarDays
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      Date
                    </p>

                    <p className="mt-1 break-words font-semibold text-slate-900">
                      {new Date(event.date).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                  <Clock
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      Time
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {new Date(event.date).toLocaleTimeString(
                        undefined,
                        {
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                  <MapPin
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      Location
                    </p>

                    <p className="mt-1 break-words font-semibold text-slate-900">
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* Registration */}
                <div className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                  <Users
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      Registration
                    </p>

                    <p className="mt-1 break-words font-semibold text-slate-900">
                      {registeredCount} / {capacity} registered
                    </p>
                  </div>
                </div>

                {/* Fee */}
                <div className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5 sm:col-span-2">
                  <Wallet
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      Registration Fee
                    </p>

                    <p className="mt-1 break-words font-semibold text-slate-900">
                      {isPaidEvent
                        ? `PKR ${registrationFee.toLocaleString()}`
                        : "Free"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Organizer */}
              {event.createdBy && (
                <div className="mt-8 border-t border-slate-100 pt-7 sm:pt-8">
                  <h2 className="text-lg font-bold text-slate-900">
                    Organized By
                  </h2>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <User size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="break-words font-medium text-slate-900">
                        {event.createdBy.name}
                      </p>

                      <p className="break-all text-sm text-slate-500">
                        {event.createdBy.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Registration Panel */}
            <div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 lg:sticky lg:top-24">
                <p className="text-sm font-medium text-slate-500">
                  Available Seats
                </p>

                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {remainingSeats}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  out of {capacity} seats remaining
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                    style={{
                      width: `${registrationPercentage}%`,
                    }}
                  />
                </div>

                {/* Fee Summary */}
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
                  <span className="text-sm text-slate-500">
                    Event Fee
                  </span>

                  <span className="font-bold text-slate-900">
                    {isPaidEvent
                      ? `PKR ${registrationFee.toLocaleString()}`
                      : "Free"}
                  </span>
                </div>

                {/* Success */}
                {registrationMessage && (
                  <div className="mt-5 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0"
                    />

                    <span className="break-words">
                      {registrationMessage}
                    </span>
                  </div>
                )}

                {/* Error */}
                {error && event && (
                  <div className="mt-5 break-words rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Payment Form */}
                {canSubmitPayment && (
                  <form
                    onSubmit={handleSubmitPayment}
                    className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard
                        size={18}
                        className="text-blue-700"
                      />

                      <h3 className="font-semibold text-blue-900">
                        Submit Payment
                      </h3>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-blue-700">
                      Pay the event fee through the method provided
                      by your university, then enter your payment
                      reference below.
                    </p>

                    <label
                      htmlFor="paymentReference"
                      className="mt-4 block text-sm font-medium text-blue-900"
                    >
                      Payment Reference
                    </label>

                    <input
                      id="paymentReference"
                      type="text"
                      value={paymentReference}
                      onChange={(event) =>
                        setPaymentReference(event.target.value)
                      }
                      placeholder="Enter transaction ID"
                      className="mt-2 w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />

                    <button
                      type="submit"
                      disabled={submittingPayment}
                      className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submittingPayment
                        ? "Submitting..."
                        : "Submit Payment"}
                    </button>
                  </form>
                )}

                {/* Payment Status */}
                {myRegistration && isPaidEvent && (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Payment Status
                    </p>

                    <p className="mt-1 font-semibold capitalize text-slate-900">
                      {paymentStatus.replace("_", " ")}
                    </p>

                    {myRegistration.paymentReference && (
                      <p className="mt-2 break-all text-xs text-slate-500">
                        Reference:{" "}
                        {myRegistration.paymentReference}
                      </p>
                    )}
                  </div>
                )}

                {/* Action */}
                {myRegistration ? (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="mt-6 w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {cancelling
                      ? "Cancelling..."
                      : "Cancel Registration"}
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={
                      registering || remainingSeats === 0
                    }
                    className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {registering
                      ? "Registering..."
                      : remainingSeats === 0
                      ? "Event Full"
                      : "Register for Event"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EventDetails;