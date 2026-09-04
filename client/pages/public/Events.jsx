import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Wallet,
} from "lucide-react";

import { getEvents } from "../../services/eventApi";

const categories = [
  "all",
  "sports",
  "workshop",
  "seminar",
  "competition",
  "cultural",
];

const Events = () => {
  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [sort, setSort] = useState("date");
  const [order, setOrder] = useState("asc");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEvents({
        search,
        category,
        status: "published",
        page,
        limit: 6,
        sort,
        order,
      });

      setEvents(data.events || []);
      setTotalPages(data.totalPages || 1);
      setTotalEvents(data.totalEvents || 0);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load events. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, category, page, sort, order]);

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleOrderChange = (event) => {
    setOrder(event.target.value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("date");
    setOrder("asc");
    setPage(1);
  };

  const hasFilters =
    search ||
    category !== "all" ||
    sort !== "date" ||
    order !== "asc";

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-600 sm:text-sm">
              Campus Events
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Discover what's happening on campus.
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Find workshops, competitions, sports activities,
              seminars, and cultural events.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6">

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search events or locations..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <SlidersHorizontal
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={category}
                onChange={(event) =>
                  handleCategoryChange(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm text-slate-700 outline-none focus:border-emerald-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "all"
                      ? "All Categories"
                      : item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={handleSortChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="createdAt">Sort by Created</option>
              <option value="capacity">Sort by Capacity</option>
            </select>

            {/* Order */}
            <select
              value={order}
              onChange={handleOrderChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-3 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-500 transition hover:text-emerald-600"
            >
              <RotateCcw size={15} />
              Clear Filters
            </button>
          )}
        </div>
      </section>

      {/* Events */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Available Events
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {totalEvents} event{totalEvents !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
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
            <p className="font-medium text-red-700">
              {error}
            </p>

            <button
              onClick={fetchEvents}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && events.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center sm:px-6 sm:py-16">
            <CalendarDays
              size={40}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No events found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or category filter.
            </p>

            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                <RotateCcw size={15} />
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Event Cards */}
        {!loading && !error && events.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* Card Header */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                    {event.category}
                  </span>

                  <span className="shrink-0 text-xs font-medium text-slate-400">
                    {event.capacity} seats
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">

                  <h3 className="line-clamp-2 text-lg font-bold text-slate-900 transition group-hover:text-emerald-600 sm:text-xl">
                    {event.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-3">

                    {/* Date */}
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <CalendarDays
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />

                      <span>
                        {new Date(event.date).toLocaleDateString(
                          undefined,
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />

                      <span className="break-words">
                        {event.location}
                      </span>
                    </div>

                    {/* Registrations */}
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <Users
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />

                      <span>
                        {event.registrationsCount || 0} /{" "}
                        {event.capacity} registered
                      </span>
                    </div>

                    {/* Registration Fee */}
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <Wallet
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />

                      <span>
                        Fee:{" "}
                        <span className="font-semibold text-slate-900">
                          {Number(event.registrationFee || 0) > 0
                            ? `PKR ${Number(event.registrationFee).toLocaleString()}`
                            : "Free"}
                        </span>
                      </span>
                    </div>

                  </div>

                  {/* Button */}
                  <div className="mt-auto pt-6">
                    <button
                      onClick={() =>
                        (window.location.href = `/events/${event._id}`)
                      }
                      className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
                    >
                      View Event
                    </button>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <span className="text-sm font-medium text-slate-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              Next
              <ChevronRight size={17} />
            </button>

          </div>
        )}
      </section>
    </main>
  );
};

export default Events;