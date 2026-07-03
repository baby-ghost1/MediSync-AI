import PDFDocument from "pdfkit";

class PdfService {
  generatePrescriptionPdf(prescription) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: "A4", margin: 50 });
        const buffers = [];
        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        const bold = (text, opts = {}) =>
          doc.font("Helvetica-Bold").fontSize(opts.size || 11).text(text, opts);
        const normal = (text, opts = {}) =>
          doc.font("Helvetica").fontSize(opts.size || 10).text(text, opts);

        // Header
        doc.fontSize(22).font("Helvetica-Bold").text("PRESCRIPTION", { align: "center" });
        doc.moveDown(0.3);
        doc.fontSize(9).font("Helvetica").fillColor("#666")
          .text("MediSync AI — Digital Healthcare Platform", { align: "center" })
          .fillColor("#000");
        doc.moveDown(0.5);

        // Horizontal line
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#ddd").stroke();
        doc.moveDown(0.5);

        const doctor = prescription.doctor || {};
        const patient = prescription.patient || {};

        // Doctor & Patient Info side by side
        const leftX = 50;
        const rightX = 310;
        const infoY = doc.y;

        doc.font("Helvetica-Bold").fontSize(11);
        doc.text("Doctor", leftX, infoY);
        doc.font("Helvetica").fontSize(10);
        doc.text(
          `Dr. ${doctor.name || `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim() || "N/A"}`,
          leftX, doc.y + 4
        );
        doc.text(`Specialization: ${doctor.specialization || "N/A"}`, leftX);
        doc.text(`Hospital: ${doctor.hospital || "N/A"}`, leftX);

        doc.font("Helvetica-Bold").fontSize(11);
        doc.text("Patient", rightX, infoY);
        doc.font("Helvetica").fontSize(10);
        const patientName = patient.name || `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "N/A";
        doc.text(patientName, rightX, doc.y + 4);

        if (patient.bloodGroup) doc.text(`Blood Group: ${patient.bloodGroup}`, rightX);
        doc.moveDown(1);

        // Date
        doc.fontSize(9).font("Helvetica").fillColor("#666")
          .text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`, { align: "right" })
          .fillColor("#000");
        doc.moveDown(0.5);

        // Line
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#ddd").stroke();
        doc.moveDown(0.5);

        // Diagnosis
        if (prescription.diagnosis) {
          bold("Diagnosis:");
          normal(prescription.diagnosis);
          doc.moveDown(0.5);
        }

        // Medicines Table
        if (prescription.medicines?.length > 0) {
          bold("Medicines Prescribed:");
          doc.moveDown(0.3);

          const tableTop = doc.y;
          const col1 = 50;
          const col2 = 180;
          const col3 = 280;
          const col4 = 370;
          const col5 = 460;
          const rowHeight = 20;

          // Table header
          doc.font("Helvetica-Bold").fontSize(9);
          doc.text("Medicine", col1, tableTop);
          doc.text("Dosage", col2, tableTop);
          doc.text("Frequency", col3, tableTop);
          doc.text("Duration", col4, tableTop);
          doc.text("Instructions", col5, tableTop);
          doc.moveDown(0.5);

          doc.moveTo(col1, doc.y).lineTo(545, doc.y).strokeColor("#eee").stroke();
          doc.moveDown(0.2);

          // Table rows
          doc.font("Helvetica").fontSize(9);
          prescription.medicines.forEach((med) => {
            const rowY = doc.y;
            const maxHeight = Math.max(
              15,
              ...([med.medicine, med.dosage, med.frequency, med.duration, med.instructions].map(
                (t) => doc.fontSize(9).heightOfString(t || "", { width: 80 }) + 2
              ))
            );

            doc.text(med.medicine || "", col1, rowY, { width: 120 });
            doc.text(med.dosage || "", col2, rowY, { width: 90 });
            doc.text(med.frequency || "", col3, rowY, { width: 80 });
            doc.text(med.duration || "", col4, rowY, { width: 80 });
            doc.text(med.instructions || "", col5, rowY, { width: 80 });

            doc.moveDown(0.8);
          });

          doc.moveDown(0.3);
        }

        // Advice
        if (prescription.advice) {
          doc.moveDown(0.3);
          bold("Advice:");
          normal(prescription.advice);
        }

        // Follow-up
        if (prescription.followUpDate) {
          doc.moveDown(0.5);
          bold("Follow-up Date:");
          normal(new Date(prescription.followUpDate).toLocaleDateString());
        }

        // Footer
        doc.moveDown(2);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#ddd").stroke();
        doc.moveDown(0.5);
        doc.fontSize(8).font("Helvetica").fillColor("#999")
          .text("This is a computer-generated prescription from MediSync AI. No signature required.", { align: "center" });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  generateReportPdf(report) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: "A4", margin: 50 });
        const buffers = [];
        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        const bold = (text, opts = {}) =>
          doc.font("Helvetica-Bold").fontSize(opts.size || 11).text(text, opts);
        const normal = (text, opts = {}) =>
          doc.font("Helvetica").fontSize(opts.size || 10).text(text, opts);

        // Header
        doc.fontSize(22).font("Helvetica-Bold").text("MEDICAL REPORT", { align: "center" });
        doc.moveDown(0.3);
        doc.fontSize(9).font("Helvetica").fillColor("#666")
          .text("MediSync AI — Digital Healthcare Platform", { align: "center" })
          .fillColor("#000");
        doc.moveDown(0.5);

        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#ddd").stroke();
        doc.moveDown(0.5);

        const doctor = report.doctor || {};
        const patient = report.patient || {};

        bold("Patient:");
        const patientName = patient.name || `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || "N/A";
        normal(patientName);
        doc.moveDown(0.3);

        bold("Doctor:");
        const doctorName = `Dr. ${doctor.name || `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim() || "N/A"}`;
        normal(doctorName);
        doc.moveDown(0.3);

        if (report.title) { bold("Title:"); normal(report.title); doc.moveDown(0.3); }
        if (report.category) { bold("Category:"); normal(report.category); doc.moveDown(0.3); }

        doc.fontSize(9).font("Helvetica").fillColor("#666")
          .text(`Date: ${new Date(report.createdAt).toLocaleDateString()}`, { align: "right" })
          .fillColor("#000");
        doc.moveDown(0.5);

        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#ddd").stroke();
        doc.moveDown(0.5);

        if (report.diagnosis) { bold("Diagnosis:"); normal(report.diagnosis); doc.moveDown(0.5); }
        if (report.observations) { bold("Observations:"); normal(report.observations); doc.moveDown(0.5); }
        if (report.recommendations) { bold("Recommendations:"); normal(report.recommendations); doc.moveDown(0.5); }

        if (report.healthScore > 0) {
          bold("Health Score:");
          normal(`${report.healthScore}/100`);
          doc.moveDown(0.5);
        }

        if (report.aiSummary) {
          doc.moveDown(0.3);
          bold("AI Summary:");
          normal(report.aiSummary);
        }

        doc.moveDown(2);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#ddd").stroke();
        doc.moveDown(0.5);
        doc.fontSize(8).font("Helvetica").fillColor("#999")
          .text("This is a computer-generated report from MediSync AI.", { align: "center" });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new PdfService();
