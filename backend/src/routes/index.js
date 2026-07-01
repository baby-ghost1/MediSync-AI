import { Router } from "express";

import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import patientRoutes from "./patient.routes.js";
import doctorRoutes from "./doctor.routes.js";
import appointmentRoutes from "./appointment.routes.js";
import reportRoutes from "./report.routes.js";
import prescriptionRoutes from "./prescription.routes.js";
import notificationRoutes from "./notification.routes.js";
import aiRoutes from "./ai.routes.js";
import adminRoutes from "./admin.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = Router();

router.use(
  "/auth",
  authRoutes
);

router.use(
  "/users",
  userRoutes
);

router.use(
  "/patients",
  patientRoutes
);

router.use(
  "/doctors",
  doctorRoutes
);

router.use(
  "/appointments",
  appointmentRoutes
);

router.use(
  "/reports",
  reportRoutes
);

router.use(
  "/prescriptions",
  prescriptionRoutes
);

router.use(
  "/notifications",
  notificationRoutes
);

router.use(
  "/ai",
  aiRoutes
);

router.use(
  "/admin",
  adminRoutes
);

router.use(
  "/upload",
  uploadRoutes
);

export default router;