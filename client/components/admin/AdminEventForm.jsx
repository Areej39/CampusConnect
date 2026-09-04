import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  category: "sports",
  date: "",
  registrationDeadline: "",
  location: "",
  capacity: "",
  registrationFee: "0",
  status: "draft",
};

const formatDateTimeLocal = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset =
    date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
};

const AdminEventForm = ({
  editingEvent,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (editingEvent) {
      setForm({
        title: editingEvent.title || "",
        description: editingEvent.description || "",
        category: editingEvent.category || "sports",
        date: formatDateTimeLocal(editingEvent.date),
        registrationDeadline: formatDateTimeLocal(
          editingEvent.registrationDeadline
        ),
        location: editingEvent.location || "",
        capacity:
          editingEvent.capacity !== undefined
            ? String(editingEvent.capacity)
            : "",
        registrationFee:
          editingEvent.registrationFee !== undefined
            ? String(editingEvent.registrationFee)
            : "0",
        status: editingEvent.status || "draft",
      });
    } else {
      setForm(initialForm);
    }

    setFormError("");
  }, [editingEvent]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    const title = form.title.trim();
    const description = form.description.trim();
    const location = form.location.trim();

    if (
      !title ||
      !description ||
      !location ||
      !form.date ||
      !form.registrationDeadline ||
      !form.capacity
    ) {
      setFormError(
        "Please fill in all required fields."
      );
      return;
    }

    if (title.length < 3) {
      setFormError(
        "Event title must be at least 3 characters."
      );
      return;
    }

    if (description.length < 10) {
      setFormError(
        "Description must be at least 10 characters."
      );
      return;
    }

    if (location.length < 2) {
      setFormError(
        "Location must be at least 2 characters."
      );
      return;
    }

    const eventDate = new Date(form.date);
    const deadlineDate = new Date(
      form.registrationDeadline
    );

    if (
      Number.isNaN(eventDate.getTime()) ||
      Number.isNaN(deadlineDate.getTime())
    ) {
      setFormError("Please provide valid dates.");
      return;
    }

    if (deadlineDate >= eventDate) {
      setFormError(
        "Registration deadline must be before the event date."
      );
      return;
    }

    const capacity = Number(form.capacity);
    const registrationFee = Number(
      form.registrationFee || 0
    );

    if (!Number.isInteger(capacity) || capacity < 1) {
      setFormError(
        "Capacity must be a whole number greater than 0."
      );
      return;
    }

    if (
      !Number.isFinite(registrationFee) ||
      registrationFee < 0
    ) {
      setFormError(
        "Registration fee cannot be negative."
      );
      return;
    }

    onSubmit({
      title,
      description,
      category: form.category,
      date: eventDate.toISOString(),
      registrationDeadline:
        deadlineDate.toISOString(),
      location,
      capacity,
      registrationFee,
      status: form.status,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {editingEvent ? "Edit Event" : "Create Event"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {editingEvent
            ? "Update the event information below."
            : "Add a new event to CampusConnect."}
        </p>
      </div>

      {formError && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="event-title"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Event Title
          </label>

          <input
            id="event-title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Annual Sports Day"
            maxLength={100}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="event-description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="event-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the event..."
            rows={4}
            maxLength={1000}
            required
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="event-category"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Category
            </label>

            <select
              id="event-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="sports">Sports</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="competition">
                Competition
              </option>
              <option value="cultural">Cultural</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="event-status"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Event Status
            </label>

            <select
              id="event-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="event-capacity"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Capacity
            </label>

            <input
              id="event-capacity"
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              min="1"
              step="1"
              placeholder="50"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label
              htmlFor="event-fee"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Registration Fee
            </label>

            <input
              id="event-fee"
              type="number"
              name="registrationFee"
              value={form.registrationFee}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <p className="mt-1 text-xs text-slate-500">
              Enter 0 for a free event.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="event-date"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Event Date and Time
          </label>

          <input
            id="event-date"
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="event-deadline"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Registration Deadline
          </label>

          <input
            id="event-deadline"
            type="datetime-local"
            name="registrationDeadline"
            value={form.registrationDeadline}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <p className="mt-1 text-xs text-slate-500">
            Students cannot register after this date.
          </p>
        </div>

        <div>
          <label
            htmlFor="event-location"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Location
          </label>

          <input
            id="event-location"
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. University Main Ground"
            maxLength={200}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading
              ? "Saving..."
              : editingEvent
                ? "Update Event"
                : "Create Event"}
          </button>

          {editingEvent && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminEventForm;