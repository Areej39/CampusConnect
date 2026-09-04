import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Ticket,
  Clock,
  ArrowRight,
  MapPin,
} from "lucide-react";

import { getStudentDashboard } from "../../services/dashboardApi";
import StatCard from "../../components/student/StatCard";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getStudentDashboard();

        setUser(data.user);
        setRegistrations(data.registrations || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="h-10 w-64 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-5 w-96 animate-pulse rounded bg-slate-200" />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-700">
            Unable to load dashboard
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>
      </main>
    );
  }

  const upcomingRegistrations = [...registrations]
    .filter(
      (registration) =>
        registration.event &&
        new Date(registration.event.date) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.event.date) -
        new Date(b.event.date)
    );

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Welcome */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Student Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back, {user?.name}!
          </h1>

          <p className="mt-2 text-slate-600">
            Keep track of your campus activities and event registrations.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <StatCard
            icon={Ticket}
            label="My Registrations"
            value={registrations.length}
            description="Events you are currently registered for"
          />

          <StatCard
            icon={CalendarDays}
            label="Upcoming Events"
            value={upcomingRegistrations.length}
            description="Registered events happening soon"
          />

          <StatCard
            icon={Clock}
            label="Account"
            value="Active"
            description={user?.email}
          />
        </div>

        {/* Upcoming Events */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Your Upcoming Events
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Events you've registered for.
              </p>
            </div>

            <Link
              to="/my-registrations"
              className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          {upcomingRegistrations.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <CalendarDays
                size={40}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No upcoming events
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Explore campus events and register for something interesting.
              </p>

              <Link
                to="/events"
                className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Events
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingRegistrations
                .slice(0, 3)
                .map((registration) => {
                  const event = registration.event;

                  return (
                    <article
                      key={registration._id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                        {event.category}
                      </span>

                      <h3 className="mt-4 line-clamp-2 text-lg font-bold text-slate-900">
                        {event.title}
                      </h3>

                      <div className="mt-5 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <CalendarDays
                            size={17}
                            className="text-emerald-600"
                          />

                          <span>
                            {new Date(
                              event.date
                            ).toLocaleDateString(
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

                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Clock
                            size={17}
                            className="text-emerald-600"
                          />

                          <span>
                            {new Date(
                              event.date
                            ).toLocaleTimeString(
                              undefined,
                              {
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <MapPin
                            size={17}
                            className="text-emerald-600"
                          />

                          <span className="truncate">
                            {event.location}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/events/${event._id}`}
                        className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        View Event
                        <ArrowRight size={16} />
                      </Link>
                    </article>
                  );
                })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-10 rounded-2xl bg-emerald-600 p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">
                Looking for something new?
              </h2>

              <p className="mt-2 text-sm text-emerald-50">
                Discover workshops, competitions, sports, and cultural events.
              </p>
            </div>

            <Link
              to="/events"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Browse Events
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;