import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-white"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600">
                <CalendarDays size={19} />
              </div>

              <span>
                Campus<span className="text-emerald-400">Connect</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              A simple platform for discovering, registering, and
              managing university events.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm transition hover:text-emerald-400"
              >
                Home
              </Link>

              <Link
                to="/events"
                className="text-sm transition hover:text-emerald-400"
              >
                Events
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Account
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/login"
                className="text-sm transition hover:text-emerald-400"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="text-sm transition hover:text-emerald-400"
              >
                Create Account
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-500">
            © 2026 CampusConnect. All rights reserved.
          </p>

          <p className="text-slate-500">
            University Event Management System
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;