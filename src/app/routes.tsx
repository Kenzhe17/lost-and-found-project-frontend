import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LoginPage from "../pages/LoginPage/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import HomePage from "../pages/HomePage/HomePage";
import ItemsPage from "../pages/ItemsPage/ItemsPage";
import SubmitPage from "../pages/SubmitPage/SubmitPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";
import ContactPage from "../pages/ContactPage/ContactPage";
import NotificationsPage from "../pages/NotificationsPage/NotificationsPage";
import ClaimItemPage from "../pages/ClaimItemPage/ClaimItemPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/items"
        element={
          <ProtectedRoute>
            <ItemsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/lost" element={<Navigate to="/items?type=LOST" replace />} />
      <Route path="/found" element={<Navigate to="/items?type=FOUND" replace />} />
      <Route
        path="/submit"
        element={
          <ProtectedRoute>
            <SubmitPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <ContactPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/items/:id/claim"
        element={
          <ProtectedRoute>
            <ClaimItemPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
