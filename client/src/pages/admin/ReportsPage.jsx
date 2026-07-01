import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText, Download, Trash2, FilePieChart, FileImage, FileSpreadsheet,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SectionLoader from "@/components/common/SectionLoader";
import EmptyState from "@/components/ui/EmptyState";
import reportService from "@/services/report.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

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

const ReportsPage = () => {
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({ search: debouncedSearch || undefined, page, limit }), [debouncedSearch, page, limit]);

  const { data, isLoading, refetch } = useApiQuery({
    queryKey: ["admin-reports", params],
    queryFn: () => reportService.getReports(params),
  });

  const { mutate: deleteReport, isPending: isDeleting } = useApiMutation({
    mutationFn: () => reportService.deleteReport(deleteTarget),
    onSuccess: () => { setDeleteTarget(null); refetch(); },
    successMessage: "Report deleted",
  });

  const { mutate: downloadReport } = useApiMutation({
    mutationFn: (id) => reportService.downloadReport(id),
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `report-${id}.pdf`; a.click();
      window.URL.revokeObjectURL(url);
    },
  });

  const reports = data?.reports || data?.data || [];
  const totalPages = data?.totalPages || 1;

  const getFileIcon = (type) => {
    if (!type) return FilePieChart;
    if (type.includes("image")) return FileImage;
    if (type.includes("spreadsheet") || type.includes("excel")) return FileSpreadsheet;
    return FilePieChart;
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader title="All Reports" description="View and manage all medical reports across the platform" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card paddingSize="lg">
          <SearchInput value={search} onChange={setSearch} placeholder="Search reports by title, patient, doctor..." />
        </Card>
      </motion.div>

      {isLoading ? <SectionLoader /> : reports.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyState title="No reports found" description={search ? "Try a different search" : "No reports uploaded yet"} icon={FileText} />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-off)]">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Report</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Patient</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Doctor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {reports.map((report, i) => {
                    const FileIcon = getFileIcon(report.fileType);
                    return (
                      <motion.tr key={report._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="bg-[var(--surface)] transition-all duration-200 hover:bg-[var(--surface-off)]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileIcon size={20} className="text-[var(--primary)]" />
                            <span className="font-semibold text-[var(--text-primary)]">{report.title || report.name || "Report"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{report.patient?.name || "N/A"}</td>
                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{report.doctor?.name || "N/A"}</td>
                        <td className="px-6 py-4"><Badge variant="secondary" size="xs">{report.type || "General"}</Badge></td>
                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "N/A"}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => downloadReport(report._id)}><Download size={16} className="text-[var(--primary)]" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(report._id)}><Trash2 size={16} className="text-[var(--danger)]" /></Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </motion.div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteReport}
        title="Delete Report?" description="This will permanently delete this report." loading={isDeleting} />
    </motion.div>
  );
};

export default ReportsPage;
