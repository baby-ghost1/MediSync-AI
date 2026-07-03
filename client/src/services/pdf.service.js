import API from "@/api/axios";

class PdfService {
  async downloadPrescriptionPdf(id) {
    const response = await API.get(`/pdf/prescription/${id}`, {
      responseType: "blob",
    });
    this._triggerDownload(response.data, `prescription_${id}.pdf`);
  }

  async downloadReportPdf(id) {
    const response = await API.get(`/pdf/report/${id}`, {
      responseType: "blob",
    });
    this._triggerDownload(response.data, `report_${id}.pdf`);
  }

  _triggerDownload(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

export default new PdfService();
