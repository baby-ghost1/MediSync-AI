import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays, CheckCircle, XCircle, Clock, ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import { TableSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import adminService from "@/services/admin.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import { usePagination } from "@/hooks/usePagination";

const statusFilters = ["All", "pending", "confirmed", "completed", "cancelled"];

const statusConfig = {
  pending: { variant: "warning", label: "Pending" },
  confirmed: { variant: "primary", label: "Confirmed" },
  completed: { variant: "success", label: "Completed" },
  cancelled: { variant: "danger", label: "Cancelled" },
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

const AppointmentsPage = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({
    status: statusFilter !== "All" ? statusFilter : undefined,
    page, limit,
  }), [statusFilter, page, limit]);

  const { data, isLoading, refetch } = useApiQuery({
    queryKey: ["admin-appointments", params],
    queryFn: () => adminService.getAppointments(params),
  });

  const { mutate: updateStatus } = useApiMutation({
    mutationFn: ({ id, status }) => adminService.updateAppointmentStatus(id, status),
    onSuccess: () => { refetch(); toast.success("Appointment updated"); },
    successMessage: "Appointment updated",
  });

  const appointments = data?.appointments || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || appointments.length;

  const getPatientName = (apt) => {
    const p = apt.patient;
    if (!p) return "Patient";
    if (p.user?.firstName) return `${p.user.firstName} ${p.user.lastName}`;
    return p.name || "Patient";
  };

  const getDoctorName = (apt) => {
    const d = apt.doctor;
    if (!d) return "Doctor";
    if (d.user?.firstName) return `${d.user.firstName} ${d.user.lastName}`;
    return d.name || "Doctor";
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader title="Appointment Management" description="View and manage all appointments across the platform" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card paddingSize="lg">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Status:</span>
            {statusFilters.map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                  statusFilter === s
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                    : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] bg-[var(--surface)]"
                }`}
              >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
        </Card>
      </motion.div>

      {isLoading ? <TableSkeleton rows={6} cols={5} /> : appointments.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyState title="No appointments found" description={statusFilter !== "All" ? "No appointments with this status" : "No appointments scheduled yet"} icon={CalendarDays} />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-off)]">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Patient</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Doctor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Reason</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {appointments.map((apt, i) => {
                    const config = statusConfig[apt.status] || statusConfig.pending;
                    return (
                      <motion.tr key={apt._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="bg-[var(--surface)] transition-all duration-200 hover:bg-[var(--surface-off)]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={getPatientName(apt)} size="md" />
                            <span className="font-semibold text-[var(--text-primary)]">{getPatientName(apt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{getDoctorName(apt)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={14} className="text-[var(--muted-foreground)]" />
                            <span className="text-sm text-[var(--text-primary)]">
                              {apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString() : "N/A"}
                            </span>
                            <Clock size={14} className="text-[var(--muted-foreground)]" />
                            <span className="text-sm text-[var(--text-primary)]">{apt.appointmentTime || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)] max-w-[200px] truncate">{apt.reason || "N/A"}</td>
                        <td className="px-6 py-4"><Badge variant={config.variant} size="xs">{config.label}</Badge></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {apt.status === "pending" && (
                              <Button variant="ghost" size="icon" onClick={() => updateStatus({ id: apt._id, status: "confirmed" })}>
                                <CheckCircle size={16} className="text-[var(--success)]" />
                              </Button>
                            )}
                            {(apt.status === "pending" || apt.status === "confirmed") && (
                              <Button variant="ghost" size="icon" onClick={() => updateStatus({ id: apt._id, status: "cancelled" })}>
                                <XCircle size={16} className="text-[var(--danger)]" />
                              </Button>
                            )}
                            {(apt.status === "confirmed") && (
                              <Button variant="ghost" size="icon" onClick={() => updateStatus({ id: apt._id, status: "completed" })}>
                                <ArrowUpRight size={16} className="text-[var(--primary)]" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default AppointmentsPage;