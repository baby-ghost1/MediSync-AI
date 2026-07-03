export { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, verifyEmailSchema } from "./auth.validator.js";
export { updateProfileSchema } from "./user.validator.js";
export { updatePatientSchema } from "./patient.validator.js";
export { updateDoctorSchema } from "./doctor.validator.js";
export { createAppointmentSchema, updateAppointmentSchema, rescheduleAppointmentSchema } from "./appointment.validator.js";
export { createReportSchema, updateReportSchema } from "./report.validator.js";
export { createPrescriptionSchema, updatePrescriptionSchema } from "./prescription.validator.js";
