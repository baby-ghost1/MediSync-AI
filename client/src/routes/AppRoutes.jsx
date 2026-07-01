
import {
  lazy,
  Suspense,
} from "react";

import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { AnimatePresence } from "framer-motion";

import PageTransition from "@/components/transitions/PageTransition";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import LandingLayout from "@/components/layouts/LandingLayout";
import AuthLayout from "@/components/layouts/AuthLayout";

import Spinner from "@/components/ui/Spinner";

import { useAuth } from "@/hooks/useAuth";

/* ------------------------------------------------ */
/* Lazy Imports */
/* ------------------------------------------------ */

const HomePage = lazy(() =>
  import("@/pages/landing/HomePage")
);

const LoginPage = lazy(() =>
  import("@/pages/auth/LoginPage")
);

const RegisterPage = lazy(() =>
  import("@/pages/auth/RegisterPage")
);

const ForgotPasswordPage = lazy(() =>
  import("@/pages/auth/ForgotPasswordPage")
);

const ResetPasswordPage = lazy(() =>
  import("@/pages/auth/ResetPasswordPage")
);

const VerifyEmailPage = lazy(() =>
  import("@/pages/auth/VerifyEmailPage")
);

const PatientDashboard = lazy(() =>
  import("@/pages/patient/DashboardPage")
);

const DoctorDashboard = lazy(() =>
  import("@/pages/doctor/DashboardPage")
);

const DoctorProfile = lazy(() =>
  import("@/pages/doctor/ProfilePage")
);

const DoctorPatients = lazy(() =>
  import("@/pages/doctor/PatientsPage")
);

const DoctorPatientDetails = lazy(() =>
  import("@/pages/doctor/PatientDetailsPage")
);

const DoctorAppointments = lazy(() =>
  import("@/pages/doctor/AppointmentsPage")
);

const DoctorAppointmentDetails = lazy(() =>
  import("@/pages/doctor/AppointmentDetailsPage")
);

const DoctorReports = lazy(() =>
  import("@/pages/doctor/ReportsPage")
);

const DoctorPrescriptions = lazy(() =>
  import("@/pages/doctor/PrescriptionsPage")
);

const DoctorNotifications = lazy(() =>
  import("@/pages/doctor/NotificationsPage")
);

const DoctorAIAnalysis = lazy(() =>
  import("@/pages/doctor/AIReportAnalysisPage")
);

const DoctorSettings = lazy(() =>
  import("@/pages/doctor/SettingsPage")
);

const AdminDashboard = lazy(() =>
  import("@/pages/admin/DashboardPage")
);

const AdminUsers = lazy(() =>
  import("@/pages/admin/UsersPage")
);

const AdminPatients = lazy(() =>
  import("@/pages/admin/PatientsPage")
);

const AdminDoctors = lazy(() =>
  import("@/pages/admin/DoctorsPage")
);

const AdminReports = lazy(() =>
  import("@/pages/admin/ReportsPage")
);

const AdminPrescriptions = lazy(() =>
  import("@/pages/admin/PrescriptionsPage")
);

const AdminAnalytics = lazy(() =>
  import("@/pages/admin/AnalyticsPage")
);

const AdminNotifications = lazy(() =>
  import("@/pages/admin/NotificationsPage")
);

const AdminSystemSettings = lazy(() =>
  import("@/pages/admin/SystemSettingsPage")
);

const PatientProfile = lazy(() =>
  import("@/pages/patient/ProfilePage")
);

const PatientDoctors = lazy(() =>
  import("@/pages/patient/DoctorsPage")
);

const PatientBookAppointment = lazy(() =>
  import("@/pages/patient/BookAppointmentPage")
);

const PatientMyAppointments = lazy(() =>
  import("@/pages/patient/MyAppointmentsPage")
);

const PatientAppointmentDetails = lazy(() =>
  import("@/pages/patient/AppointmentDetailsPage")
);

const PatientReports = lazy(() =>
  import("@/pages/patient/ReportsPage")
);

const PatientPrescriptions = lazy(() =>
  import("@/pages/patient/PrescriptionsPage")
);

const PatientAIAssistant = lazy(() =>
  import("@/pages/patient/AIAssistantPage")
);

const PatientSettings = lazy(() =>
  import("@/pages/patient/SettingsPage")
);

const PatientNotifications = lazy(() =>
  import("@/pages/patient/NotificationsPage")
);

const PatientSymptomChecker = lazy(() =>
  import("@/pages/patient/SymptomCheckerPage")
);

const PatientMedicineInfo = lazy(() =>
  import("@/pages/patient/MedicineInfoPage")
);

const PatientHealthScore = lazy(() =>
  import("@/pages/patient/HealthScorePage")
);

const PatientHealthTips = lazy(() =>
  import("@/pages/patient/HealthTipsPage")
);

const PatientReportSummary = lazy(() =>
  import("@/pages/patient/ReportSummaryPage")
);

const NotFoundPage = lazy(() =>
  import("@/pages/common/NotFoundPage")
);

/* ------------------------------------------------ */
/* Loader */
/* ------------------------------------------------ */

const Loader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Spinner size="xl" />
  </div>
);

/* ------------------------------------------------ */
/* Guest Route */
/* ------------------------------------------------ */

const GuestRoute = ({
  children,
}) => {
  const { isAuthenticated } =
    useAuth();

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

/* ------------------------------------------------ */
/* Protected Route */
/* ------------------------------------------------ */

const ProtectedRoute = ({
  children,
}) => {
  const { isAuthenticated } =
    useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};

/* ------------------------------------------------ */
/* Role Route */
/* ------------------------------------------------ */

const RoleRoute = ({
  children,
  allowedRoles = [],
}) => {
  const {
    user,
    isAuthenticated,
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    !allowedRoles.includes(
      user?.role
    )
  ) {
    return (
      <Navigate
        to="/404"
        replace
      />
    );
  }

  return children;
};

/* ------------------------------------------------ */

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<Loader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ========================================= */}
          {/* Public Routes */}
          {/* ========================================= */}

          <Route element={<LandingLayout />}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          </Route>

          {/* ========================================= */}
          {/* Authentication */}
          {/* ========================================= */}

          <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
            <Route path="/verify-email" element={<PageTransition><VerifyEmailPage /></PageTransition>} />
          </Route>

          {/* ========================================= */}
          {/* Protected Dashboard */}
          {/* ========================================= */}

          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>

            {/* Patient */}
            <Route path="/patient/dashboard" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientDashboard /></PageTransition></RoleRoute>} />
            <Route path="/patient/profile" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientProfile /></PageTransition></RoleRoute>} />
            <Route path="/patient/doctors" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientDoctors /></PageTransition></RoleRoute>} />
            <Route path="/patient/appointments" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientMyAppointments /></PageTransition></RoleRoute>} />
            <Route path="/patient/appointments/book" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientBookAppointment /></PageTransition></RoleRoute>} />
            <Route path="/patient/appointments/:id" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientAppointmentDetails /></PageTransition></RoleRoute>} />
            <Route path="/patient/reports" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientReports /></PageTransition></RoleRoute>} />
            <Route path="/patient/prescriptions" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientPrescriptions /></PageTransition></RoleRoute>} />
            <Route path="/patient/ai-assistant" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientAIAssistant /></PageTransition></RoleRoute>} />
            <Route path="/patient/ai/symptom-checker" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientSymptomChecker /></PageTransition></RoleRoute>} />
            <Route path="/patient/ai/medicine-info" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientMedicineInfo /></PageTransition></RoleRoute>} />
            <Route path="/patient/ai/health-score" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientHealthScore /></PageTransition></RoleRoute>} />
            <Route path="/patient/ai/health-tips" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientHealthTips /></PageTransition></RoleRoute>} />
            <Route path="/patient/ai/report-summary" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientReportSummary /></PageTransition></RoleRoute>} />
            <Route path="/patient/settings" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientSettings /></PageTransition></RoleRoute>} />
            <Route path="/patient/notifications" element={<RoleRoute allowedRoles={["patient"]}><PageTransition><PatientNotifications /></PageTransition></RoleRoute>} />

            {/* Doctor */}
            <Route path="/doctor/dashboard" element={<RoleRoute allowedRoles={["doctor"]}><PageTransition><DoctorDashboard /></PageTransition></RoleRoute>} />
            <Route path="/doctor/profile" element={<RoleRoute allowedRoles={["doctor"]}><PageTransition><DoctorProfile /></PageTransition></RoleRoute>} />
            <Route path="/doctor/patients" element={<RoleRoute allowedRoles={["doctor"]}><PageTransition><DoctorPatients /></PageTransition></RoleRoute>} />
            <Route path="/doctor/patients/:id" element={<RoleRoute allowedRoles={["doctor"]}><PageTransition><DoctorPatientDetails /></PageTransition></RoleRoute>} />
            <Route path="/doctor/appointments" element={<RoleRoute allowedRoles={["doctor"]}><PageTransition><DoctorAppointments /></PageTransition></RoleRoute>} />
            <Route path="/doctor/appointments/:id" element={<RoleRoute allowedRoles={["doctor"]}><PageTransition><DoctorAppointmentDetails /></PageTransition></RoleRoute>} />
            <Route path="/doctor/reports" element={<RoleRoute allowedRoles={["doctor"]}><PageTransition><DoctorReports /></PageTransition></RoleRoute>} />
            <Route path="/doctor/prescriptions" element={<RoleRoute allowedRoles={["doctor"]}><PageTransition><DoctorPrescriptions /></PageTransition></RoleRoute>} />
            <Route path="/doctor/notifications" element={<RoleRoute allowedRoles={["doctor"]}><PageTransition><DoctorNotifications /></PageTransition></RoleRoute>} />
            <Route path="/doctor/ai-analysis" element={<RoleRoute allowedRoles={["doctor"]}><PageTransition><DoctorAIAnalysis /></PageTransition></RoleRoute>} />
            <Route path="/doctor/settings" element={<RoleRoute allowedRoles={["doctor"]}><PageTransition><DoctorSettings /></PageTransition></RoleRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<RoleRoute allowedRoles={["admin"]}><PageTransition><AdminDashboard /></PageTransition></RoleRoute>} />
            <Route path="/admin/users" element={<RoleRoute allowedRoles={["admin"]}><PageTransition><AdminUsers /></PageTransition></RoleRoute>} />
            <Route path="/admin/patients" element={<RoleRoute allowedRoles={["admin"]}><PageTransition><AdminPatients /></PageTransition></RoleRoute>} />
            <Route path="/admin/doctors" element={<RoleRoute allowedRoles={["admin"]}><PageTransition><AdminDoctors /></PageTransition></RoleRoute>} />
            <Route path="/admin/reports" element={<RoleRoute allowedRoles={["admin"]}><PageTransition><AdminReports /></PageTransition></RoleRoute>} />
            <Route path="/admin/prescriptions" element={<RoleRoute allowedRoles={["admin"]}><PageTransition><AdminPrescriptions /></PageTransition></RoleRoute>} />
            <Route path="/admin/analytics" element={<RoleRoute allowedRoles={["admin"]}><PageTransition><AdminAnalytics /></PageTransition></RoleRoute>} />
            <Route path="/admin/notifications" element={<RoleRoute allowedRoles={["admin"]}><PageTransition><AdminNotifications /></PageTransition></RoleRoute>} />
            <Route path="/admin/settings" element={<RoleRoute allowedRoles={["admin"]}><PageTransition><AdminSystemSettings /></PageTransition></RoleRoute>} />

            {/* Shared (All Roles) */}
            <Route path="/settings" element={<RoleRoute allowedRoles={["patient", "doctor", "admin"]}><PageTransition><PatientSettings /></PageTransition></RoleRoute>} />
            <Route path="/notifications" element={<RoleRoute allowedRoles={["patient", "doctor", "admin"]}><PageTransition><PatientNotifications /></PageTransition></RoleRoute>} />

          </Route>

          {/* ========================================= */}
          {/* Smart Dashboard Redirect */}
          {/* ========================================= */}

          <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

          {/* ========================================= */}
          {/* Error Routes */}
          {/* ========================================= */}

          <Route path="/404" element={<PageTransition><NotFoundPage /></PageTransition>} />

          {/* ========================================= */}
          {/* Catch All */}
          {/* ========================================= */}

          <Route path="*" element={<Navigate to="/404" replace />} />

        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

/* ================================================ */
/* Dashboard Redirect */
/* ================================================ */

const DashboardRedirect = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case "patient":
      return (
        <Navigate
          to="/patient/dashboard"
          replace
        />
      );

    case "doctor":
      return (
        <Navigate
          to="/doctor/dashboard"
          replace
        />
      );

    case "admin":
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );

    default:
      return (
        <Navigate
          to="/login"
          replace
        />
      );
  }
};

export default AppRoutes;