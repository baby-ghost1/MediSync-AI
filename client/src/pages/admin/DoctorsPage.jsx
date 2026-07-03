import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Stethoscope, CheckCircle, XCircle, ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/components/common/StatusBadge";
import { TableSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import adminService from "@/services/admin.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

const statusFilters = ["All", "approved", "pending", "verified"];

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

const DoctorsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({
    search: debouncedSearch || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
    page, limit,
  }), [debouncedSearch, statusFilter, page, limit]);

  const { data, isLoading, refetch } = useApiQuery({
    queryKey: ["admin-doctors", params],
    queryFn: () => adminService.getDoctors(params),
  });

  const { mutate: approveDoctor } = useApiMutation({
    mutationFn: (id) => adminService.approveDoctor(id),
    onSuccess: () => { refetch(); toast.success("Doctor approved"); },
  });

  const { mutate: rejectDoctor } = useApiMutation({
    mutationFn: (id) => adminService.rejectDoctor(id),
    onSuccess: () => { refetch(); toast.success("Doctor rejected"); },
  });

  const { mutate: verifyDoctor } = useApiMutation({
    mutationFn: (id) => adminService.verifyDoctor(id),
    onSuccess: () => { refetch(); toast.success("Doctor verified"); },
  });

  const doctors = data?.doctors || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || doctors.length;

  const getDoctorApprovalStatus = (doc) => {
    if (doc.isApproved) return "approved";
    if (doc.isVerified) return "verified";
    return "pending";
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Doctor Management"
          description="Approve, verify, and manage registered doctors"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card paddingSize="lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by name, specialization..." />
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-[var(--muted-foreground)]">Status:</span>
              {statusFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
                    statusFilter === s
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                      : "border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)]"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {isLoading ? <TableSkeleton rows={6} cols={6} /> : doctors.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyState
            title="No doctors found"
            description={search || statusFilter !== "All" ? "Try adjusting filters" : "No doctors registered"}
            icon={Stethoscope}
          />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--secondary)]">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Doctor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Specialization</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Hospital</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Approval</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Verified</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {doctors.map((doc, i) => {
                    const user = doc.user || {};
                    const fullName = doc.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown";
                    const email = user.email || doc.email || "N/A";
                    const approvalStatus = getDoctorApprovalStatus(doc);
                    return (
                      <motion.tr
                        key={doc._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="bg-[var(--card)] transition-all duration-200 hover:bg-[var(--secondary)]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={fullName} size="md" />
                            <span className="font-semibold text-[var(--foreground)]">{fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{doc.specialization || "General"}</td>
                        <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{doc.hospital || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">{email}</td>
                        <td className="px-6 py-4">
                          {approvalStatus === "approved" ? (
                            <Badge variant="success" size="xs">Approved</Badge>
                          ) : (
                            <Badge variant="warning" size="xs">Pending</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={user.isVerified ? "verified" : "pending"} size="xs" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {!doc.isApproved && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => approveDoctor(doc._id)}
                                title="Approve doctor"
                              >
                                <CheckCircle size={16} className="text-[var(--success)]" />
                              </Button>
                            )}
                            {doc.isApproved && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => rejectDoctor(doc._id)}
                                title="Revoke approval"
                              >
                                <XCircle size={16} className="text-[var(--danger)]" />
                              </Button>
                            )}
                            {!user.isVerified && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => verifyDoctor(doc._id)}
                                title="Verify user"
                              >
                                <ShieldCheck size={16} className="text-[var(--primary)]" />
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

export default DoctorsPage;
