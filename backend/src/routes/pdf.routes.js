import { Router } from "express";

import PdfService from "../services/pdf.service.js";
import PrescriptionService from "../services/prescription.service.js";
import ReportService from "../services/report.service.js";
import { auth } from "../middleware/index.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = Router();

router.use(auth);

router.get("/prescription/:id", asyncHandler(async (req, res) => {
  const prescription = await PrescriptionService.getPrescription(req.params.id);
  const pdf = await PdfService.generatePrescriptionPdf(prescription);

  const filename = `prescription_${req.params.id}.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(pdf);
}));

router.get("/report/:id", asyncHandler(async (req, res) => {
  const report = await ReportService.getReport(req.params.id);
  const pdf = await PdfService.generateReportPdf(report);

  const filename = `report_${req.params.id}.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(pdf);
}));

export default router;
