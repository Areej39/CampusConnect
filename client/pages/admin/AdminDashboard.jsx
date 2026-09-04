import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Wallet,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import AdminStatCard from "../../components/admin/AdminStatCard";
import RegistrationCategoryChart from "../../components/student/RegistrationCategoryChart";
import { getAdminDashboard } from "../../services/adminApi";

const formatDate = (date) => {
  if (!date) return "No date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString();
};

const getStatusClasses = (status) => {
  const statusClasses = {
    draft: "bg-slate-100 text-slate-700",
    published: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    statusClasses[status] ||
    "bg-slate-100 text-slate-600"
  );
};

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminDashboard();

        setDashboard({
          totalStudents: data?.totalStudents || 0,
          totalEvents: data?.totalEvents || 0,
          totalRegistrations: data?.totalRegistrations || 0,
          registrationsByCategory:
            data?.registrationsByCategory || [],
          upcomingEvents: data?.upcomingEvents || [],
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load admin dashboard."
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 rounded bg-slate-200" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-36 rounded-2xl bg-slate-200"
                />
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-72 rounded-2xl bg-slate-200" />
              <div className="h-72 rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
            <h2 className="font-semibold text-red-800">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-600">
            Admin Panel
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            CampusConnect Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Overview of students, events, and registrations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminStatCard
            type="students"
            label="Total Students"
            value={dashboard.totalStudents}
            description="Registered student accounts"
          />

          <AdminStatCard
            type="events"
            label="Total Events"
            value={dashboard.totalEvents}
            description="Events created on CampusConnect"
          />

          <AdminStatCard
            type="registrations"
            label="Total Registrations"
            value={dashboard.totalRegistrations}
            description="Currently active registrations"
          />
        </div>

        {/* Main Dashboard */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Category Chart */}
          <RegistrationCategoryChart
            data={dashboard.registrationsByCategory}
          />

          {/* Upcoming Events */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Upcoming Events
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Next events scheduled on campus.
              </p>
            </div>

            {dashboard.upcomingEvents.length === 0 ? (
              <div className="flex min-h-48 items-center justify-center rounded-xl bg-slate-50 px-4 text-center">
                <p className="text-sm text-slate-500">
                  No upcoming events.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboard.upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900">
                          {event.title || "Untitled Event"}
                        </h3>

                        <p className="mt-1 text-xs font-medium capitalize text-emerald-600">
                          {event.category || "Uncategorized"}
                        </p>
                      </div>

                      <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        {event.registrationsCount || 0}/
                        {event.capacity || 0}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.status && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClasses(
                            event.status
                          )}`}
                        >
                          {event.status === "published" && (
                            <CheckCircle size={13} />
                          )}

                          {event.status === "draft" && (
                            <Clock size={13} />
                          )}

                          {event.status === "cancelled" && (
                            <XCircle size={13} />
                          )}

                          {event.status}
                        </span>
                      )}

                      {event.registrationFee !== undefined && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
                          <Wallet size={13} />
                          Rs. {event.registrationFee || 0}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-500">
                      <div className="flex min-w-0 items-center gap-2">
                        <CalendarDays
                          size={15}
                          className="shrink-0"
                        />

                        <span>
                          {formatDate(event.date)}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2">
                        <MapPin
                          size={15}
                          className="shrink-0"
                        />

                        <span className="truncate">
                          {event.location || "No location"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;