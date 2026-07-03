import ConsultationService from "../services/consultation.service.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const createNote = asyncHandler(async (req, res) => {
  const payload = { ...req.body, doctor: req.user.doctorId || req.body.doctor };
  const note = await ConsultationService.createNote(payload);
  res.status(201).json({ success: true, data: note });
});

export const getNote = asyncHandler(async (req, res) => {
  const note = await ConsultationService.getNote(req.params.id);
  res.json({ success: true, data: note });
});

export const getNoteByAppointment = asyncHandler(async (req, res) => {
  const note = await ConsultationService.getNoteByAppointment(req.params.appointmentId);
  res.json({ success: true, data: note });
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await ConsultationService.updateNote(req.params.id, req.body);
  res.json({ success: true, data: note });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const result = await ConsultationService.deleteNote(req.params.id);
  res.json(result);
});

export const getDoctorNotes = asyncHandler(async (req, res) => {
  const result = await ConsultationService.getDoctorNotes(req.params.doctorId, req.query);
  res.json({ success: true, ...result });
});

export const getPatientNotes = asyncHandler(async (req, res) => {
  const result = await ConsultationService.getPatientNotes(req.params.patientId, req.query);
  res.json({ success: true, ...result });
});
