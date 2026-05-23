import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ThemeProvider from "@/providers/ThemeProvider";
import ToastProvider from "@/providers/ToastProvider";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import Layout from "@/pages/Layout";
import SearchPage from "@/pages/SearchPage";
import UserRegistrationPage from "@/pages/UserRegistrationPage";
import HospitalRegistrationPage from "@/pages/HospitalRegistrationPage";
import DonorsPage from "@/pages/DonorsPage";
import HospitalsPage from "@/pages/HospitalsPage";
import HistoryPage from "@/pages/HistoryPage";
import EmergencyPage from "@/pages/EmergencyPage";
import CertificatePage from "@/pages/CertificatePage";
import SettingsPage from "@/pages/SettingsPage";
import ProfileEditPage from "@/pages/ProfileEditPage";
import AboutPage from "@/pages/AboutPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ContactPage from "@/pages/ContactPage";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter basename={import.meta.env.PROD ? "/raktavahini-web" : ""}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/search" replace />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/register" element={<UserRegistrationPage />} />
                <Route path="/register-hospital" element={<HospitalRegistrationPage />} />
                <Route path="/donors" element={<DonorsPage />} />
                <Route path="/hospitals" element={<HospitalsPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/emergency" element={<EmergencyPage />} />
                <Route path="/certificate" element={<CertificatePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile/edit" element={<ProfileEditPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
