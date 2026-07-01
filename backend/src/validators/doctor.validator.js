import Joi from "joi";

export const updateDoctorSchema =
  Joi.object({
    specialization:
      Joi.string(),

    qualification:
      Joi.string(),

    experience:
      Joi.number().min(0),

    consultationFee:
      Joi.number().min(0),

    hospital:
      Joi.string(),

    about:
      Joi.string(),

    available:
      Joi.boolean(),
  }).min(1);