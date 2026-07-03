export const ROUTES = {
  /* ==========================================
      Public
  ========================================== */

  HOME: "/",

  ABOUT: "/about",

  CONTACT: "/contact",

  FAQ: "/faq",

  PRIVACY_POLICY: "/privacy-policy",

  TERMS: "/terms",

  /* ==========================================
      Authentication
  ========================================== */

  LOGIN: "/login",

  REGISTER: "/register",

  FORGOT_PASSWORD: "/forgot-password",

  RESET_PASSWORD: "/reset-password",

  VERIFY_EMAIL: "/verify-email",

  /* ==========================================
      Common
  ========================================== */

  DASHBOARD: "/dashboard",

  PROFILE: "/profile",

  SETTINGS: "/settings",

  NOTIFICATIONS: "/notifications",

  CHAT: "/chat",

  /* ==========================================
      Patient
  ========================================== */

  PATIENT: {
    ROOT: "/patient",

    DASHBOARD: "/patient/dashboard",

    PROFILE: "/patient/profile",

    SETTINGS: "/patient/settings",

    APPOINTMENTS: "/patient/appointments",

    BOOK_APPOINTMENT:
      "/patient/appointments/book",

    MEDICAL_HISTORY:
      "/patient/medical-history",

    REPORTS: "/patient/reports",

    PRESCRIPTIONS:
      "/patient/prescriptions",

    AI_ASSISTANT:
      "/patient/ai-assistant",

    SYMPTOM_CHECKER:
      "/patient/ai/symptom-checker",

    MEDICINE_INFO:
      "/patient/ai/medicine-info",

    HEALTH_SCORE:
      "/patient/ai/health-score",

    HEALTH_TIPS:
      "/patient/ai/health-tips",

    REPORT_SUMMARY:
      "/patient/ai/report-summary",

    MEDICAL_HISTORY:
      "/patient/medical-history",
  },

  /* ==========================================
      Doctor
  ========================================== */

  DOCTOR: {
    ROOT: "/doctor",

    DASHBOARD: "/doctor/dashboard",

    PROFILE: "/doctor/profile",

    SETTINGS: "/doctor/settings",

    PATIENTS: "/doctor/patients",

    PATIENT_DETAILS: "/doctor/patients/:id",

    APPOINTMENTS:
      "/doctor/appointments",

    APPOINTMENT_DETAILS: "/doctor/appointments/:id",

    REPORTS: "/doctor/reports",

    PRESCRIPTIONS:
      "/doctor/prescriptions",

    CONSULTATION_NOTES:
      "/doctor/consultation-notes",

    PRESCRIPTION_TEMPLATES:
      "/doctor/prescription-templates",

    SCHEDULE: "/doctor/schedule",

    AI_ASSISTANT:
      "/doctor/ai-assistant",

    AI_ANALYSIS: "/doctor/ai-analysis",

    SYMPTOM_CHECKER:
      "/doctor/ai/symptom-checker",

    MEDICINE_INFO:
      "/doctor/ai/medicine-info",

    HEALTH_TIPS:
      "/doctor/ai/health-tips",

    REPORT_SUMMARY:
      "/doctor/ai/report-summary",
  },

  /* ==========================================
      Admin
  ========================================== */

  ADMIN: {
    ROOT: "/admin",

    LOGIN: "/admin/login",

    DASHBOARD: "/admin/dashboard",

    USERS: "/admin/users",

    PATIENTS: "/admin/patients",

    DOCTORS: "/admin/doctors",

    APPOINTMENTS: "/admin/appointments",

    REPORTS: "/admin/reports",

    PRESCRIPTIONS: "/admin/prescriptions",

    HOSPITALS: "/admin/hospitals",

    ANALYTICS: "/admin/analytics",

    NOTIFICATIONS: "/admin/notifications",

    SETTINGS: "/admin/settings",
  },

  /* ==========================================
      Errors
  ========================================== */

  SUPPORT: "/support",

  DOCUMENTATION: "/documentation",

  NOT_FOUND: "/404",

  FORBIDDEN: "/403",

  SERVER_ERROR: "/500",
};

export default ROUTES;