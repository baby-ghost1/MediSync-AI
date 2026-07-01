import Joi from "joi";

const medicineSchema =
  Joi.object({
    medicine: Joi.string()
      .required(),

    dosage:
      Joi.string().required(),

    frequency:
      Joi.string().required(),

    duration:
      Joi.string().required(),

    instructions:
      Joi.string().allow(""),
  });

export const createPrescriptionSchema =
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
      .allow("", null),

    diagnosis:
      Joi.string().allow(""),

    advice:
      Joi.string().allow(""),

    followUpDate:
      Joi.date(),

    medicines:
      Joi.array()
        .items(
          medicineSchema
        )
        .min(1)
        .required(),
  });

export const updatePrescriptionSchema =
  Joi.object({
    diagnosis:
      Joi.string(),

    advice:
      Joi.string(),

    followUpDate:
      Joi.date(),

    medicines:
      Joi.array().items(
        medicineSchema
      ),

    status: Joi.string().valid(
      "active",
      "dispensed",
      "completed",
      "expired"
    ),
  }).min(1);

export const prescriptionQuerySchema =
  Joi.object({
    page: Joi.number()
      .integer()
      .min(1),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100),

    status: Joi.string().valid(
      "active",
      "dispensed",
      "completed",
      "expired"
    ),

    patient:
      Joi.string(),

    doctor:
      Joi.string(),
  });
