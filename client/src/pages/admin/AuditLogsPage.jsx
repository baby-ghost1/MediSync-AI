import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileSearch, ShieldCheck, ShieldAlert, UserCheck, UserX, Trash2,
  CheckCircle, XCircle, Activity, Clock, Fingerprint, AlertTriangle,
} from "lucide-react";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import { ListSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import StatCard from "@/components/common/StatCard";
import adminService from "@/services/admin.service";
import { useApiQuery } from "@/hooks/useQuery";
import { usePagination } from "@/hooks/usePagination";

const actionLabels = {
  USER_VERIFY: { label: "User Verified", color: "success", icon: CheckCircle },
  USER_BLOCK: { label: "User Blocked", color: "danger", icon: UserX },
  USER_UNBLOCK: { label: "User Unblocked", color: "success", icon: UserCheck },
  USER_DELETE: { label: "User Deleted", color: "danger", icon: Trash2 },
  DOCTOR_APPROVE: { label: "Doctor Approved", color: "success", icon: ShieldCheck },
  DOCTOR_REJECT: { label: "Doctor Rejected", color: "warning", icon: XCircle },
  LOGIN_SUCCESS: { label: "Login Success", color: "success", icon: Activity },
  LOGIN_FAIL: { label: "Login Failed", color: "warning", icon: AlertTriangle },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

const AuditLogsPage = () => {
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({ page, limit }), [page, limit]);

  const { data, isLoading } = useApiQuery({
    queryKey: ["admin-audit-logs", params],
    queryFn: () => adminService.getAuditLogs(params),
  });

  const { data: stats } = useApiQuery({
    queryKey: ["admin-audit-statistics"],
    queryFn: () => adminService.getAuditStatistics(),
  });

  const logs = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || logs.length;
  const auditStats = stats?.data;

  const getActionInfo = (action) => {
    return actionLabels[action] || { label: action, color: "default", icon: Fingerprint };
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Audit Logs"
          description="Track all administrative actions and security events"
          icon={FileSearch}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Events"
          value={auditStats?.totalLogs || 0}
          icon={Activity}
          color="primary"
        />
        <StatCard
          title="Security Events"
          value={auditStats?.actionCounts?.filter(a => a._id.includes("LOGIN") || a._id.includes("BLOCK")).reduce((s, a) => s + a.count, 0) || 0}
          icon={ShieldAlert}
          color="warning"
        />
        <StatCard
          title="User Actions"
          value={auditStats?.actionCounts?.filter(a => a._id.includes("USER")).reduce((s, a) => s + a.count, 0) || 0}
          icon={UserCheck}
          color="primary"
        />
        <StatCard
          title="Doctor Actions"
          value={auditStats?.actionCounts?.filter(a => a._id.includes("DOCTOR")).reduce((s, a) => s + a.count, 0) || 0}
          icon={ShieldCheck}
          color="success"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card paddingSize="none">
          <CardHeader title="Activity Timeline" description="Recent admin actions across the platform" />
          {isLoading ? (
            <div className="p-8"><ListSkeleton items={8} /></div>
          ) : logs.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No audit logs"
                description="Admin actions will be recorded here"
                icon={FileSearch}
              />
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {logs.map((log, i) => {
                const actionInfo = getActionInfo(log.action);
                const ActionIcon = actionInfo.icon;
                const actorName = log.actor ? `${log.actor.firstName || ""} ${log.actor.lastName || ""}`.trim() : "System";
                const targetName = log.target ? `${log.target.firstName || ""} ${log.target.lastName || ""}`.trim() : "N/A";

                return (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-[var(--secondary)]"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      actionInfo.color === "success" ? "bg-[var(--success-light)] text-[var(--success)]" :
                      actionInfo.color === "danger" ? "bg-[var(--danger-light)] text-[var(--danger)]" :
                      actionInfo.color === "warning" ? "bg-[var(--warning-light)] text-[var(--warning)]" :
                      "bg-[var(--primary-light)] text-[var(--primary)]"
                    }`}>
                      <ActionIcon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--foreground)]">{actionInfo.label}</span>
                        <Badge variant={actionInfo.color === "default" ? "primary" : actionInfo.color} size="xs">
                          {log.action}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        By <span className="font-medium text-[var(--foreground)]">{actorName}</span>
                        {log.target ? ` on ${targetName}` : ""}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                        {log.ip && (
                          <span className="flex items-center gap-1">
                            IP: {log.ip}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          {logs.length > 0 && (
            <div className="border-t border-[var(--border)] px-6 py-4">
              <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AuditLogsPage;
