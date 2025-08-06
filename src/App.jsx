// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "./contexts/CurrencyContext";

// Pages
import HomePage from "./HomePage.jsx";
import NotFoundPage from "./pages/404.jsx";
import Cars from "./pages/Cars.jsx";
import Newsgrid from "./pages/News.jsx";
import CarsSingle from "./pages/carsSingle.jsx";
import NewsSingle from "./pages/newsSingle.jsx";
import Admin from "./pages/Admin.jsx";
import AdminEditCar from "./pages/admin_edit_car.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import TestPage from "./pages/TestPage.jsx";
import AdminBlog from "./pages/AdminBlog.jsx";
import AdminBlogForm from "./pages/AdminBlogForm.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";
import DebugAuth from "./pages/DebugAuth.jsx";
const App = () => {
  return (
    <CurrencyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/news" element={<Newsgrid />} />
          <Route path="/cars/:id" element={<CarsSingle />} />
          <Route path="/news/:slug" element={<NewsSingle />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/debug-auth" element={<DebugAuth />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/editCar"
            element={
              <ProtectedRoute>
                <AdminEditCar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cars/:id"
            element={
              <ProtectedRoute>
                <AdminEditCar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog"
            element={
              <ProtectedRoute>
                <AdminBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/new"
            element={
              <ProtectedRoute>
                <AdminBlogForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/blog/edit/:id"
            element={
              <ProtectedRoute>
                <AdminBlogForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </CurrencyProvider>
  );
};

export default App;
