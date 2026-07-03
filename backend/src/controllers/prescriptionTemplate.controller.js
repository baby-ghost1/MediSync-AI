import PrescriptionTemplateService from "../services/prescriptionTemplate.service.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const createTemplate = asyncHandler(async (req, res) => {
  const payload = { ...req.body, doctor: req.user.doctorId || req.body.doctor };
  const template = await PrescriptionTemplateService.createTemplate(payload);
  res.status(201).json({ success: true, data: template });
});

export const getTemplate = asyncHandler(async (req, res) => {
  const template = await PrescriptionTemplateService.getTemplate(req.params.id);
  res.json({ success: true, data: template });
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const template = await PrescriptionTemplateService.updateTemplate(req.params.id, req.body);
  res.json({ success: true, data: template });
});

export const deleteTemplate = asyncHandler(async (req, res) => {
  const result = await PrescriptionTemplateService.deleteTemplate(req.params.id);
  res.json(result);
});

export const getMyTemplates = asyncHandler(async (req, res) => {
  const doctorId = req.user.doctorId || req.query.doctorId;
  const result = await PrescriptionTemplateService.getDoctorTemplates(doctorId, req.query);
  res.json({ success: true, ...result });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const template = await PrescriptionTemplateService.toggleFavorite(req.params.id);
  res.json({ success: true, data: template });
});

export const incrementUsage = asyncHandler(async (req, res) => {
  const template = await PrescriptionTemplateService.incrementUsage(req.params.id);
  res.json({ success: true, data: template });
});
