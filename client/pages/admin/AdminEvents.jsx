import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Plus, Search, X } from "lucide-react";

import AdminEventForm from "../../components/admin/AdminEventForm";
import AdminEventRow from "../../components/admin/AdminEventRow";

import { getEvents } from "../../services/eventApi";

import {
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  cancelEvent,
} from "../../services/adminEventApi";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEvents({
        search: search.trim(),
        category,
        page: 1,
        limit: 50,
        sort: "date",
        order: "asc",
      });

      setEvents(response?.events || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [loadEvents, refreshKey]);

  const handleCreate = () => {
    setEditingEvent(null);
    setShowForm(true);
    setError("");
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
    setError("");
  };

  const handleCancelForm = () => {
    if (saving) {
      return;
    }

    setEditingEvent(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (eventData) => {
    try {
      setSaving(true);
      setError("");

      if (editingEvent) {
        await updateEvent(
          editingEvent._id,
          eventData
        );
      } else {
        await createEvent(eventData);
      }

      setEditingEvent(null);
      setShowForm(false);

      setRefreshKey((previousKey) => previousKey + 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save event. Please check your data and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteEvent(event._id);

      setRefreshKey((previousKey) => previousKey + 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete event. Please try again."
      );
    }
  };

  const handlePublish = async (event) => {
    const confirmed = window.confirm(
      `Publish "${event.title}"? Students will be able to see and register for it.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await publishEvent(event._id);

      setRefreshKey((previousKey) => previousKey + 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to publish event. Please try again."
      );
    }
  };

  const handleCancelEvent = async (event) => {
    const confirmed = window.confirm(
      `Cancel "${event.title}"? This event will no longer be available for registration.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await cancelEvent(event._id);

      setRefreshKey((previousKey) => previousKey + 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to cancel event. Please try again."
      );
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
  };

  const hasFilters =
    search.trim().length > 0 || category.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Manage Events
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, update, and manage CampusConnect events.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
          >
            <Plus size={18} />
            Create Event
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <AdminEventForm
              editingEvent={editingEvent}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
              loading={saving}
            />
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 rounded-md p-1 text-red-600 transition hover:bg-red-100"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <div>
              <label
                htmlFor="event-search"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Search events
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="event-search"
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search by title..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="event-category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <select
                id="event-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">All categories</option>
                <option value="sports">Sports</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="competition">
                  Competition
                </option>
                <option value="cultural">Cultural</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasFilters}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                All Events
              </h2>

              <p className="text-sm text-slate-500">
                {loading
                  ? "Loading events..."
                  : `${events.length} event${
                      events.length === 1 ? "" : "s"
                    } found`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-40 items-center justify-center">
              <p className="text-sm text-slate-500">
                Loading events...
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 text-center">
              <h3 className="font-semibold text-slate-800">
                No events found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your filters or create a new event.
              </p>

              {!hasFilters && (
                <button
                  type="button"
                  onClick={handleCreate}
                  className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Create your first event
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <AdminEventRow
                  key={event._id}
                  event={event}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPublish={handlePublish}
                  onCancelEvent={handleCancelEvent}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;