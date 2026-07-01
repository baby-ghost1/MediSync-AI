import Joi from "joi";

export const updatePatientSchema =
  Joi.object({
    dob: Joi.date(),

    gender: Joi.string().valid(
      "male",
      "female",
      "other"
    ),

    bloodGroup: Joi.string(),

    height: Joi.number()
      .min(0),

    weight: Joi.number()
      .min(0),

    allergies: Joi.array().items(
      Joi.string()
    ),

    chronicDiseases:
      Joi.array().items(
        Joi.string()
      ),

    emergencyContact:
      Joi.object({
        name: Joi.string(),

        phone: Joi.string(),

        relation: Joi.string(),
      }),

    address: Joi.object({
      street: Joi.string(),

      city: Joi.string(),

      state: Joi.string(),

      country:
        Joi.string(),

      pincode:
        Joi.string(),
    }),
  }).min(1);