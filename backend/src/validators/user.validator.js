import Joi from "joi";

export const updateProfileSchema =
  Joi.object({
    firstName: Joi.string()
      .trim()
      .min(2)
      .max(50),

    lastName: Joi.string()
      .trim()
      .min(2)
      .max(50),

    phone: Joi.string()
      .trim()
      .allow("", null),

    avatar: Joi.object({
      url: Joi.string(),

      publicId: Joi.string(),
    }),
  }).min(1);