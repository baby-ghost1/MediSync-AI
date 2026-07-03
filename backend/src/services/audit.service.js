import { AuditLogRepository } from "../repositories/index.js";

class AuditService {
  async log({ actor, action, target = null, targetModel = null, metadata = {}, ip = "", userAgent = "" }) {
    return AuditLogRepository.create({
      actor,
      action,
      target,
      targetModel,
      metadata,
      ip,
      userAgent,
    });
  }

  async getLogs(page = 1, limit = 20) {
    return AuditLogRepository.getRecent(limit);
  }

  async getLogsByActor(actorId, page = 1, limit = 20) {
    return AuditLogRepository.findByActor(actorId, { page, limit });
  }

  async getStatistics() {
    return AuditLogRepository.getStatistics();
  }
}

export default new AuditService();
