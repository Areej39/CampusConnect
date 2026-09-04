import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Trophy,
  Users,
  Sparkles,
  LayoutDashboard,
  MapPin,
  Clock,
} from "lucide-react";

import { motion } from "framer-motion";
import { getEvents } from "../../services/eventApi";

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:p-7"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 leading-7 text-slate-600">
        {description}
      </p>
    </motion.div>
  );
};

const formatEventDate = (date) => {
  if (!date) return "Date not available";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isLoggedIn = Boolean(token);
  const isAdmin = user?.role === "admin";

  const dashboardPath = isAdmin ? "/admin" : "/dashboard";
  const dashboardLabel = isAdmin
    ? "Admin Dashboard"
    : "My Dashboard";

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await getEvents({
          status: "published",
          page: 1,
          limit: 4,
          sort: "date",
          order: "asc",
        });

        setUpcomingEvents(response?.events || []);
      } catch (error) {
        console.error("Failed to fetch upcoming events:", error);
        setUpcomingEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-emerald-50 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700 sm:text-sm"
            >
              <Sparkles size={16} className="shrink-0" />
              <span>Your campus events, all in one place</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Discover. Register.

              <span className="block text-emerald-600">
                Experience campus life.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
            >
              CampusConnect makes it easy for students to discover
              university events, register instantly, and stay connected
              with everything happening on campus.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
              >
                Browse Events
                <ArrowRight size={18} />
              </Link>

              {isLoggedIn ? (
                <Link
                  to={dashboardPath}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <LayoutDashboard size={18} />
                  {dashboardLabel}
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Create Account
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Stay connected
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Upcoming Events
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Discover what is happening next on your campus.
              </p>
            </div>

            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
            >
              Browse all events
              <ArrowRight size={16} />
            </Link>
          </div>

          {loadingEvents ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <CalendarDays
                size={36}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-4 font-semibold text-slate-900">
                No upcoming events yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                New campus events will appear here soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                      {event.category || "Event"}
                    </span>

                    <CalendarDays
                      size={18}
                      className="shrink-0 text-emerald-600"
                    />
                  </div>

                  <h3 className="mt-5 line-clamp-2 text-lg font-semibold text-slate-900">
                    {event.title}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                      <CalendarDays
                        size={15}
                        className="shrink-0"
                      />
                      {formatEventDate(event.date)}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin
                        size={15}
                        className="shrink-0"
                      />
                      <span className="truncate">
                        {event.location || "Location not available"}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Users
                        size={15}
                        className="shrink-0"
                      />
                      {event.registrationsCount || 0}/
                      {event.capacity || 0} registered
                    </p>
                  </div>

                  <Link
                    to={`/events/${event._id}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
                  >
                    View details
                    <ArrowRight size={15} />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center sm:mb-12"
          >
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Everything you need for campus events
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Discover events, connect with your campus, and never miss
              an opportunity.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<CalendarDays size={24} />}
              title="Discover Events"
              description="Explore workshops, seminars, competitions, sports events and more."
              delay={0}
            />

            <FeatureCard
              icon={<Users size={24} />}
              title="Easy Registration"
              description="Register for university events with a simple and smooth process."
              delay={0.1}
            />

            <FeatureCard
              icon={<Trophy size={24} />}
              title="Campus Experience"
              description="Participate, connect with other students, and make the most of campus life."
              delay={0.2}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;