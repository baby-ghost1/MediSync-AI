import Joi from "joi";

export const chatSchema = Joi.object({
  prompt: Joi.string().trim().min(1).max(10000).required(),
});

export const askSchema = Joi.object({
  question: Joi.string().trim().min(1).max(10000).required(),
});

export const symptomsSchema = Joi.object({
  symptoms: Joi.string().trim().min(1).max(5000).required(),
});

export const medicineSchema = Joi.object({
  medicine: Joi.string().trim().min(1).max(500).required(),
});

export const healthTipsSchema = Joi.object({
  age: Joi.number().integer().min(0).max(150).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
});
