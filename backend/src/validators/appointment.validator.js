import Joi from "joi";

export const createAppointmentSchema =
  Joi.object({
    patient: Joi.string()
      .hex()
      .length(24)
      .required(),

    doctor: Joi.string()
      .hex()
      .length(24)
      .required(),

    appointmentDate: Joi.date()
      .required(),

    appointmentTime: Joi.string()
      .required(),

    reason: Joi.string()
      .max(1000)
      .allow("", null),

    symptoms: Joi.array().items(
      Joi.string()
    ),
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