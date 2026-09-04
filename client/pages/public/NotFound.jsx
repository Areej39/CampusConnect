import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <SearchX size={30} />
        </div>

        <p className="mt-6 text-sm font-semibold text-emerald-600">
          404 ERROR
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Page not found
        </h1>

        <p className="mt-3 text-slate-500">
          The page you're looking for doesn't exist or
          may have been moved.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;