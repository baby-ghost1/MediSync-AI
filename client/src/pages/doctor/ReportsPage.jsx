import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Upload, Download, Trash2, CalendarDays,
  FileSpreadsheet, FileImage, FilePieChart, ChevronRight,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import FileUpload from "@/components/common/FileUpload";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import StatusBadge from "@/components/common/StatusBadge";
import { ListSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import reportService from "@/services/report.service";
import aiService from "@/services/ai.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

const ReportsPage = () => {
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [preview, setPreview] = useState(null);
  const [summarizing, setSummarizing] = useState(null);
  const [summary, setSummary] = useState("");
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const { data, isLoading, refetch } = useApiQuery({
    queryKey: ["doctor-reports", { search: debouncedSearch, page, limit }],
    queryFn: () => reportService.getReports({ search: debouncedSearch, page, limit }),
  });

  const { mutate: deleteReport, isPending: isDeleting } = useApiMutation({
    mutationFn: () => reportService.deleteReport(deleteTarget),
    onSuccess: () => { setDeleteTarget(null); refetch(); },
    successMessage: "Report deleted",
  });

  const { mutate: uploadReport } = useApiMutation({
    mutationFn: (files) => reportService.uploadReport(files[0]),
    onSuccess: () => { setShowUpload(false); refetch(); },
    successMessage: "Report uploaded",
  });

  const { mutate: downloadReport } = useApiMutation({
    mutationFn: (id) => reportService.downloadReport(id),
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `report-${id}.pdf`; a.click();
      window.URL.revokeObjectURL(url);
    },
  });

  const handleSummarize = async (reportId) => {
    setSummarizing(reportId);
    try {
      const res = await aiService.summarizeReport(reportId);
      setSummary(res.summary || res.response || "AI analysis complete.");
      setSummarizing(null);
    } catch {
      toast.error("Failed to summarize report");
      setSummarizing(null);
    }
  };

  const reports = data?.reports || data?.data || [];
  const totalPages = data?.totalPages || 1;

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type) => {
    if (!type) return FilePieChart;
    if (type.includes("pdf")) return FilePieChart;
    if (type.includes("image")) return FileImage;
    if (type.includes("spreadsheet") || type.includes("excel")) return FileSpreadsheet;
    return FilePieChart;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <PageHeader
        title="Patient Reports"
        description="Upload, review and analyze medical reports with AI"
        actions={<Button variant="gradient" leftIcon={<Upload size={18} />} onClick={() => setShowUpload(true)}>Upload Report</Button>}
      />

      <Card paddingSize="lg">
        <SearchInput value={search} onChange={setSearch} placeholder="Search reports by name or patient..." />
      </Card>

      {isLoading ? <ListSkeleton items={6} /> : reports.length === 0 ? (
        <EmptyState title="No reports yet" description="Upload a medical report to get started" icon={FileText} actionText="Upload Report" onAction={() => setShowUpload(true)} />
      ) : (
        <>
          <div className="space-y-4">
            {reports.map((report, i) => {
              const FileIcon = getFileIcon(report.fileType);
              const patient = report.patient || {};
              return (
                <motion.div key={report._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -2, scale: 1.005 }}
                  className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:shadow-[var(--shadow-lg)] md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary)]/10 text-[var(--primary)] transition-all duration-300"><FileIcon size={26} /></div>
                    <div>
                      <h3 className="font-bold text-[var(--text-primary)]">{report.title || report.name || "Medical Report"}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{patient.name || "Patient"} · {formatFileSize(report.fileSize)}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                        <span className="flex items-center gap-1"><CalendarDays size={12} />{new Date(report.createdAt).toLocaleDateString()}</span>
                        {report.type && <Badge variant="secondary" size="xs">{report.type}</Badge>}
                        <StatusBadge status={report.status || "completed"} size="xs" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleSummarize(report._id)} loading={summarizing === report._id} className="transition-all duration-300 hover:bg-[var(--primary)]/10">
                      <Brain size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => downloadReport(report._id)} className="transition-all duration-300 hover:bg-[var(--primary)]/10"><Download size={18} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setPreview(report)} className="transition-all duration-300 hover:bg-[var(--primary)]/10"><ChevronRight size={18} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(report._id)} className="transition-all duration-300 hover:bg-[var(--danger)]/10"><Trash2 size={18} className="text-[var(--danger)]" /></Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Medical Report" size="lg">
        <FileUpload onUpload={uploadReport} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" maxSize={20 * 1024 * 1024} label="Select a report file (PDF, DOC, or Image)" />
      </Modal>

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Report Details" size="md">
        {preview && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <FilePieChart size={32} className="text-[var(--primary)]" />
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{preview.title || preview.name}</h3>
                <p className="text-[var(--text-secondary)]">{(preview.patient?.name || "Patient")} · {formatFileSize(preview.fileSize)}</p>
              </div>
            </div>
            {summary && (
              <div className="rounded-[var(--radius-lg)] bg-[var(--surface-off)] p-4 transition-all duration-300">
                <p className="text-sm font-semibold text-[var(--text-primary)]">AI Analysis</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{summary}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button fullWidth onClick={() => downloadReport(preview._id)} leftIcon={<Download size={16} />}>Download</Button>
              <Button fullWidth variant="outline" onClick={() => { setPreview(null); setSummary(""); }}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteReport} title="Delete Report?" description="This will permanently delete this medical report." loading={isDeleting} />
    </motion.div>
  );
};

export default ReportsPage;
