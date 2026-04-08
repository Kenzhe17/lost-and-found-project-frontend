import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LoginPage from "../pages/LoginPage/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import HomePage from "../pages/HomePage/HomePage";
import LostPage from "../pages/LostPage/LostPage";
import FoundPage from "../pages/FoundPage/FoundPage";
import SubmitPage from "../pages/SubmitPage/SubmitPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";
import ContactPage from "../pages/ContactPage/ContactPage";
import NotificationsPage from "../pages/NotificationsPage/NotificationsPage";
import ClaimItemPage from "../pages/ClaimItemPage/ClaimItemPage";
import MyClaimsPage from "../pages/MyClaimsPage/MyClaimsPage";
import MyItemsPage from "../pages/MyItemsPage/MyItemsPage";
import ItemDetailsPage from "../pages/ItemDetailsPage/ItemDetailsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lost"
        element={
          <ProtectedRoute>
            <LostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/found"
        element={
          <ProtectedRoute>
            <FoundPage />
          </ProtectedRoute>
        }
      />
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
        path="/claims/my"
        element={
          <ProtectedRoute>
            <MyClaimsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/items/my"
        element={
          <ProtectedRoute>
            <MyItemsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/items/:id"
        element={
          <ProtectedRoute>
            <ItemDetailsPage />
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

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
