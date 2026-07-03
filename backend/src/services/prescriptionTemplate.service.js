import PrescriptionTemplate from "../models/PrescriptionTemplate.js";
import { DoctorRepository } from "../repositories/index.js";
import { ApiError } from "../utils/index.js";

class PrescriptionTemplateService {
  async createTemplate(payload) {
    const { doctor } = payload;
    const doctorExists = await DoctorRepository.findById(doctor);
    if (!doctorExists) throw new ApiError(404, "Doctor not found.");
    return PrescriptionTemplate.create(payload);
  }

  async getTemplate(id) {
    const template = await PrescriptionTemplate.findById(id);
    if (!template) throw new ApiError(404, "Template not found.");
    return template;
  }

  async updateTemplate(id, payload) {
    const template = await PrescriptionTemplate.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!template) throw new ApiError(404, "Template not found.");
    return template;
  }

  async deleteTemplate(id) {
    const template = await PrescriptionTemplate.findByIdAndDelete(id);
    if (!template) throw new ApiError(404, "Template not found.");
    return { success: true, message: "Template deleted." };
  }

  async getDoctorTemplates(doctorId, { page = 1, limit = 50, search, favorite }) {
    const filter = { doctor: doctorId };
    if (favorite) filter.isFavorite = true;
    if (search) filter.name = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;
    const [templates, total] = await Promise.all([
      PrescriptionTemplate.find(filter)
        .sort({ isFavorite: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      PrescriptionTemplate.countDocuments(filter),
    ]);
    return { data: templates, page, limit, total, totalPages: Math.ceil(total / limit) };
  }

  async incrementUsage(id) {
    return PrescriptionTemplate.findByIdAndUpdate(id, { $inc: { usageCount: 1 } }, { new: true });
  }

  async toggleFavorite(id) {
    const template = await PrescriptionTemplate.findById(id);
    if (!template) throw new ApiError(404, "Template not found.");
    template.isFavorite = !template.isFavorite;
    await template.save();
    return template;
  }
}

export default new PrescriptionTemplateService();
