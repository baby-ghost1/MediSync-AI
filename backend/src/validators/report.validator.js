import Joi from "joi";

export const createReportSchema =
  Joi.object({
    patient: Joi.string()
      .hex()
      .length(24)
      .required(),

    doctor: Joi.string()
      .hex()
      .length(24)
      .required(),

    appointment: Joi.string()
      .hex()
      .length(24)
      .allow(null, ""),

    title: Joi.string()
      .required(),

    category: Joi.string().valid(
      "blood-test",
      "xray",
      "ct-scan",
      "mri",
      "ecg",
      "prescription",
      "other"
    ),

    diagnosis:
      Joi.string().allow(""),

    observations:
      Joi.string().allow(""),

    recommendations:
      Joi.string().allow(""),
  });

export const updateReportSchema =
  Joi.object({
    title: Joi.string(),

    category: Joi.string().valid(
      "blood-test",
      "xray",
      "ct-scan",
      "mri",
      "ecg",
      "prescription",
      "other"
    ),

    diagnosis:
      Joi.string(),

    observations:
      Joi.string(),

    recommendations:
      Joi.string(),

    aiSummary:
      Joi.string(),

    healthScore:
      Joi.number()
        .min(0)
        .max(100),
  }).min(1);

export const reportQuerySchema =
  Joi.object({
    page: Joi.number()
      .integer()
      .min(1),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100),

    category:
      Joi.string(),

    patient:
      Joi.string(),

    doctor:
      Joi.string(),
  });
