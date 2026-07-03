import BaseRepository from "./base.repository.js";
import { AuditLog } from "../models/index.js";

class AuditLogRepository extends BaseRepository {
  constructor() {
    super(AuditLog);
  }

  async findByActor(actorId, { page = 1, limit = 20 }) {
    return this.find({ actor: actorId }, { page, limit, sort: "-createdAt" });
  }

  async findByAction(action, { page = 1, limit = 20 }) {
    return this.find({ action }, { page, limit, sort: "-createdAt" });
  }

  async getRecent(limit = 50) {
    return this.find(
      {},
      { page: 1, limit, sort: "-createdAt", populate: "actor target" }
    );
  }

  async getStatistics() {
    const [totalLogs, actionCounts] = await Promise.all([
      this.count(),
      AuditLog.aggregate([
        { $group: { _id: "$action", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);
    return { totalLogs, actionCounts };
  }
}

export default new AuditLogRepository();
