import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import AdminRegistrationFilters from "../../components/admin/AdminRegistrationFilters";
import AdminRegistrationRow from "../../components/admin/AdminRegistrationRow";

import { getEvents } from "../../services/eventApi";

import {
  getAdminRegistrations,
  approveRegistration,
  rejectRegistration,
} from "../../services/adminRegistrationApi";

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");
  const [event, setEvent] = useState("");
  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRegistrations, setTotalRegistrations] =
    useState(0);

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");

  // Load events for the event filter
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents({
          page: 1,
          limit: 50,
          sort: "date",
          order: "asc",
        });

        setEvents(data.events || []);
      } catch (error) {
        console.error("Failed to load events:", error);
      }
    };

    loadEvents();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminRegistrations({
        search,
        event,
        status,
        page,
        limit: 10,
        sort: "createdAt",
        order: "desc",
      });

      setRegistrations(data.registrations || []);
      setTotalPages(data.totalPages || 1);
      setTotalRegistrations(data.totalRegistrations || 0);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load registrations."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load registrations with a small search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadRegistrations();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, event, status, page]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleEventChange = (value) => {
    setEvent(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setEvent("");
    setStatus("all");
    setPage(1);
  };

  const handleApprove = async (registration) => {
    const registrationId = registration?._id;

    if (!registrationId) return;

    try {
      setProcessingId(registrationId);
      setError("");

      await approveRegistration(registrationId);

      await loadRegistrations();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to approve registration."
      );
    } finally {
      setProcessingId("");
    }
  };

  const handleReject = async (registration) => {
    const registrationId = registration?._id;

    if (!registrationId) return;

    const shouldReject = window.confirm(
      "Are you sure you want to reject this registration?"
    );

    if (!shouldReject) return;

    try {
      setProcessingId(registrationId);
      setError("");

      await rejectRegistration(registrationId);

      await loadRegistrations();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to reject registration."
      );
    } finally {
      setProcessingId("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-600">
            Admin Panel
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Registration Management
          </h1>

          <p className="mt-2 text-slate-500">
            View, approve, and reject student event registrations.
          </p>
        </div>

        {/* Filters */}
        <AdminRegistrationFilters
          search={search}
          setSearch={handleSearchChange}
          event={event}
          setEvent={handleEventChange}
          status={status}
          setStatus={handleStatusChange}
          events={events}
          onClear={handleClear}
        />

        {/* Count */}
        <div className="mt-6">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {registrations.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {totalRegistrations}
            </span>{" "}
            registrations
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Registration List */}
        <div className="mt-5 space-y-4">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-xl bg-slate-200"
                />
              ))}
            </>
          ) : registrations.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
              <h2 className="text-lg font-semibold text-slate-900">
                No registrations found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            registrations.map((registration) => (
              <AdminRegistrationRow
                key={registration._id}
                registration={registration}
                onApprove={handleApprove}
                onReject={handleReject}
                processingId={processingId}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && registrations.length > 0 && (
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
            <button
              type="button"
              onClick={() =>
                setPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={page === 1}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <div className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-900">
                {page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {totalPages}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={page === totalPages}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminRegistrations;