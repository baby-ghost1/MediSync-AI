import Joi from "joi";

export const createAppointmentSchema =
  Joi.object({
    doctorId: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages({
        "string.hex": "doctorId must be a valid ObjectId",
        "string.length": "doctorId must be 24 characters",
        "any.required": "Doctor is required",
      }),

    date: Joi.date()
      .required()
      .messages({
        "date.base": "Appointment date is invalid",
        "any.required": "Appointment date is required",
      }),

    time: Joi.string()
      .required()
      .messages({
        "any.required": "Appointment time is required",
      }),

    reason: Joi.string()
      .min(10)
      .max(1000)
      .required()
      .messages({
        "string.min": "Reason must be at least 10 characters",
        "string.max": "Reason must not exceed 1000 characters",
        "any.required": "Reason is required",
      }),

    notes: Joi.string()
      .allow("", null)
      .optional(),
  });

export const updateAppointmentSchema =
  Joi.object({
    appointmentDate:
      Joi.date(),

    appointmentTime:
      Joi.string(),

    reason: Joi.string()
      .max(1000),

    symptoms: Joi.array().items(
      Joi.string()
    ),

    status: Joi.string().valid(
      "pending",
      "confirmed",
      "completed",
      "cancelled"
    ),

    notes: Joi.string(),
  }).min(1);

export const appointmentStatusSchema =
  Joi.object({
    status: Joi.string()
      .valid(
        "pending",
        "confirmed",
        "completed",
        "cancelled"
      )
      .required(),
  });

export const rescheduleAppointmentSchema =
  Joi.object({
    appointmentDate: Joi.date()
      .required(),

    appointmentTime:
      Joi.string().required(),
  });

export const appointmentQuerySchema =
  Joi.object({
    page: Joi.number()
      .integer()
      .min(1),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100),

    status: Joi.string().valid(
      "pending",
      "confirmed",
      "completed",
      "cancelled"
    ),

    doctor: Joi.string(),

    patient: Joi.string(),
  });