import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Stethoscope, CheckCircle, XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/components/common/StatusBadge";
import SectionLoader from "@/components/common/SectionLoader";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import adminService from "@/services/admin.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

const statusFilters = ["All", "verified", "pending", "rejected"];

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
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
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

  const { mutate: verifyDoctor } = useApiMutation({
    mutationFn: (id) => adminService.verifyDoctor(id),
    onSuccess: () => { refetch(); toast.success("Doctor verified"); },
    successMessage: "Doctor verified",
  });

  const { mutate: rejectDoctor } = useApiMutation({
    mutationFn: () => adminService.rejectDoctor(rejectTarget, rejectReason),
    onSuccess: () => { setRejectTarget(null); setRejectReason(""); refetch(); },
    successMessage: "Doctor rejected",
  });

  const doctors = data?.doctors || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || doctors.length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader title="Doctor Management" description="Verify and manage registered doctors" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card paddingSize="lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by name, specialization..." />
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-[var(--text-secondary)]">Status:</span>
              {statusFilters.map((s) => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
                    statusFilter === s
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                      : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] bg-[var(--surface)]"
                  }`}
                >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {isLoading ? <SectionLoader /> : doctors.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyState title="No doctors found" description={search || statusFilter !== "All" ? "Try adjusting filters" : "No doctors registered"} icon={Stethoscope} />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-off)]">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Doctor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Specialization</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Hospital</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {doctors.map((doc, i) => (
                    <motion.tr key={doc._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="bg-[var(--surface)] transition-all duration-200 hover:bg-[var(--surface-off)]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={doc.name || `${doc.firstName} ${doc.lastName}`} src={doc.avatar} size="md" />
                          <span className="font-semibold text-[var(--text-primary)]">{doc.name || `${doc.firstName} ${doc.lastName}`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{doc.specialization || "General"}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{doc.hospital || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{doc.email}</td>
                      <td className="px-6 py-4"><StatusBadge status={doc.status || (doc.isVerified ? "verified" : "pending")} size="xs" /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {!doc.isVerified && doc.status !== "verified" && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => verifyDoctor(doc._id)}><CheckCircle size={16} className="text-[var(--success)]" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => setRejectTarget(doc._id)}><XCircle size={16} className="text-[var(--danger)]" /></Button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </motion.div>
      )}

      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Doctor" size="md">
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">Provide a reason for rejecting this doctor's verification.</p>
          <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/10"
            placeholder="Enter rejection reason..." />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={rejectDoctor} disabled={!rejectReason.trim()}>Reject</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default DoctorsPage;
