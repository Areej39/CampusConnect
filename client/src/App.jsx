import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InitialLoader from "../components/InitialLoader";

import ProtectedRoute from "../components/student/ProtectedRoute";
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Signup from "../pages/public/Signup";
import Events from "../pages/public/Events";
import EventDetails from "../pages/public/EventDetails";
import NotFound from "../pages/public/NotFound";

import MyRegistrations from "../pages/student/MyRegistrations";
import Dashboard from "../pages/student/Dashboard";

import AdminRoute from "../components/admin/AdminRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminEvents from "../pages/admin/AdminEvents";
import AdminRegistrations from "../pages/admin/AdminRegistrations";

function App() {

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <InitialLoader />;
  }

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

        {/* Student */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-registrations"
          element={
            <ProtectedRoute>
              <MyRegistrations />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <AdminRoute>
              <AdminEvents />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/registrations"
          element={
            <AdminRoute>
              <AdminRegistrations />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;