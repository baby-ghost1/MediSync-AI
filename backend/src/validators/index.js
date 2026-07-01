export { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, verifyEmailSchema } from "./auth.validator.js";
export { updateProfileSchema } from "./user.validator.js";
export { updatePatientSchema } from "./patient.validator.js";
export { updateDoctorSchema } from "./doctor.validator.js";
export { createAppointmentSchema, updateAppointmentSchema, appointmentStatusSchema, rescheduleAppointmentSchema, appointmentQuerySchema } from "./appointment.validator.js";
export { createReportSchema, updateReportSchema, reportQuerySchema } from "./report.validator.js";
export { createPrescriptionSchema, updatePrescriptionSchema, prescriptionQuerySchema } from "./prescription.validator.js";
