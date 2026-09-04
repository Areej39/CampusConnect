import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  ClipboardList,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isLoggedIn = Boolean(token);
  const isAdmin = user?.role === "admin";

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) =>
    `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive(path)
        ? "bg-emerald-50 text-emerald-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
    }`;

  const mobileNavLinkClass = (path) =>
    `flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition ${
      isActive(path)
        ? "bg-emerald-50 text-emerald-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
    }`;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <CalendarDays size={21} />
          </div>

          <span>
            Campus<span className="text-emerald-600">Connect</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Public */}
          <Link to="/" className={navLinkClass("/")}>
            Home
          </Link>

          <Link to="/events" className={navLinkClass("/events")}>
            Browse Events
          </Link>

          {/* Student */}
          {isLoggedIn && !isAdmin && (
            <>
              <Link
                to="/dashboard"
                className={navLinkClass("/dashboard")}
              >
                <LayoutDashboard size={16} />
                My Dashboard
              </Link>

              <Link
                to="/my-registrations"
                className={navLinkClass("/my-registrations")}
              >
                <ClipboardList size={16} />
                My Registrations
              </Link>
            </>
          )}

          {/* Admin */}
          {isLoggedIn && isAdmin && (
            <>
              <Link
                to="/admin"
                className={navLinkClass("/admin")}
              >
                <LayoutDashboard size={16} />
                Admin Dashboard
              </Link>

              <Link
                to="/admin/events"
                className={navLinkClass("/admin/events")}
              >
                Manage Events
              </Link>

              <Link
                to="/admin/registrations"
                className={navLinkClass("/admin/registrations")}
              >
                Registrations
              </Link>
            </>
          )}
        </div>

        {/* Desktop user/auth section */}
        <div className="hidden items-center gap-4 md:flex">
          {isLoggedIn ? (
            <>
              <div className="hidden items-center gap-2 lg:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <User size={17} />
                </div>

                <div>
                  <p className="max-w-32 truncate text-sm font-medium text-slate-900">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs capitalize text-slate-500">
                    {user?.role || "student"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className={
                  isActive("/login")
                    ? "rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700"
                    : "rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600"
                }
              >
                Login
              </Link>

              <Link
                to="/signup"
                className={
                  isActive("/signup")
                    ? "rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white"
                    : "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                }
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={mobileNavLinkClass("/")}
            >
              Home
            </Link>

            <Link
              to="/events"
              onClick={closeMobileMenu}
              className={mobileNavLinkClass("/events")}
            >
              <CalendarDays size={17} />
              Browse Events
            </Link>

            {isLoggedIn && !isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass("/dashboard")}
                >
                  <LayoutDashboard size={17} />
                  My Dashboard
                </Link>

                <Link
                  to="/my-registrations"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass("/my-registrations")}
                >
                  <ClipboardList size={17} />
                  My Registrations
                </Link>
              </>
            )}

            {isLoggedIn && isAdmin && (
              <>
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass("/admin")}
                >
                  <LayoutDashboard size={17} />
                  Admin Dashboard
                </Link>

                <Link
                  to="/admin/events"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass("/admin/events")}
                >
                  Manage Events
                </Link>

                <Link
                  to="/admin/registrations"
                  onClick={closeMobileMenu}
                  className={mobileNavLinkClass("/admin/registrations")}
                >
                  Registrations
                </Link>
              </>
            )}

            <div className="mt-2 border-t border-slate-200 pt-3">
              {isLoggedIn ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 px-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <User size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {user?.name || "User"}
                      </p>

                      <p className="text-xs capitalize text-slate-500">
                        {user?.role || "student"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;