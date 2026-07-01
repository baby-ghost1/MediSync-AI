import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Pill, Download,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/components/common/StatusBadge";
import SectionLoader from "@/components/common/SectionLoader";
import EmptyState from "@/components/ui/EmptyState";
import prescriptionService from "@/services/prescription.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

const statusFilters = ["All", "active", "completed", "expired"];

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

const PrescriptionsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({
    search: debouncedSearch || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
    page, limit,
  }), [debouncedSearch, statusFilter, page, limit]);

  const { data, isLoading } = useApiQuery({
    queryKey: ["admin-prescriptions", params],
    queryFn: () => prescriptionService.getPrescriptions(params),
  });

  const { mutate: downloadPrescription } = useApiMutation({
    mutationFn: (id) => prescriptionService.downloadPrescription(id),
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `prescription-${id}.pdf`; a.click();
      window.URL.revokeObjectURL(url);
    },
  });

  const prescriptions = data?.prescriptions || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || prescriptions.length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader title="All Prescriptions" description="View all prescriptions across the platform" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card paddingSize="lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SearchInput value={search} onChange={setSearch} placeholder="Search prescriptions..." />
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((f) => (
                <button key={f} onClick={() => { setStatusFilter(f); setPage(1); }}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
                    statusFilter === f
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                      : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] bg-[var(--surface)]"
                  }`}
                >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {isLoading ? <SectionLoader /> : prescriptions.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyState title="No prescriptions found" description={search || statusFilter !== "All" ? "Try adjusting filters" : "No prescriptions yet"} icon={Pill} />
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
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Diagnosis</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Medications</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {prescriptions.map((pres, i) => (
                    <motion.tr key={pres._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="bg-[var(--surface)] transition-all duration-200 hover:bg-[var(--surface-off)]"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">{pres.patient?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{pres.doctor?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{pres.diagnosis || "N/A"}</td>
                      <td className="px-6 py-4"><Badge variant="secondary" size="xs">{(pres.medications?.length || 0)} meds</Badge></td>
                      <td className="px-6 py-4"><StatusBadge status={pres.status || "active"} size="xs" /></td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{pres.createdAt ? new Date(pres.createdAt).toLocaleDateString() : "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => downloadPrescription(pres._id)}><Download size={16} className="text-[var(--primary)]" /></Button>
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
    </motion.div>
  );
};

export default PrescriptionsPage;
