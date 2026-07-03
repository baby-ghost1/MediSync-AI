import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Upload, Download, Trash2, CalendarDays,
  FileSpreadsheet, FileImage, FilePieChart, ChevronRight,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import FileUpload from "@/components/common/FileUpload";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import StatusBadge from "@/components/common/StatusBadge";
import SectionLoader from "@/components/common/SectionLoader";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import reportService from "@/services/report.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

const ReportsPage = () => {
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [preview, setPreview] = useState(null);
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const { data, isLoading, refetch } = useApiQuery({
    queryKey: ["reports", { search: debouncedSearch, page, limit }],
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
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });

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
    <div className="space-y-8">
      <PageHeader
        title="Medical Reports"
        description="Upload, view and manage your medical reports"
        actions={
          <Button variant="gradient" leftIcon={<Upload size={18} />} onClick={() => setShowUpload(true)}>
            Upload Report
          </Button>
        }
      />

      <Card paddingSize="lg" className="overflow-hidden border-0 bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-[var(--primary-foreground)] shadow-[var(--shadow-lg)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--primary-foreground)]/70">Clinical records</p>
            <h2 className="mt-2 text-xl font-semibold">Keep medical history organized and accessible</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--primary-foreground)]/75">Upload new reports, review summaries and manage important documents in one secure place.</p>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-[var(--primary-foreground)]/15 px-4 py-3 backdrop-blur-xl">
            <p className="text-sm font-semibold">{reports.length} report{reports.length === 1 ? "" : "s"} available</p>
          </div>
        </div>
      </Card>

      <Card paddingSize="lg" className="border-[var(--border)]/70 bg-[var(--surface)]/80">
        <SearchInput value={search} onChange={setSearch} placeholder="Search reports by name or type..." />
      </Card>

      {isLoading ? <SectionLoader /> : reports.length === 0 ? (
        <EmptyState
          title="No reports yet"
          description="Upload your first medical report to get started"
          icon={FileText}
          actionText="Upload Report"
          onAction={() => setShowUpload(true)}
        />
      ) : (
        <>
          <div className="space-y-4">
            {reports.map((report, i) => {
              const FileIcon = getFileIcon(report.fileType);
              return (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.01 }}
                  className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--border)]/80 bg-[linear-gradient(135deg,var(--surface),var(--surface-off))] p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--primary-light)] text-[var(--primary)]">
                      <FileIcon size={26} />
                    </div>
                    <div>
                      <h3 className="font-bold">{report.title || report.name || "Medical Report"}</h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {report.doctor?.name || "Doctor"} · {formatFileSize(report.fileSize)}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={12} />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                        {report.type && <Badge variant="secondary" size="xs">{report.type}</Badge>}
                        <StatusBadge status={report.status || "completed"} size="xs" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => downloadReport(report._id)}>
                      <Download size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setPreview(report)}>
                      <ChevronRight size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(report._id)}>
                      <Trash2 size={18} className="text-[var(--danger)]" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Medical Report" size="lg">
        <FileUpload
          onUpload={uploadReport}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          maxSize={20 * 1024 * 1024}
          label="Select a report file (PDF, DOC, or Image)"
        />
      </Modal>

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Report Details" size="md">
        {preview && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <FilePieChart size={32} className="text-[var(--primary)]" />
              <div>
                <h3 className="font-bold text-lg text-[var(--foreground)]">{preview.title || preview.name}</h3>
                <p className="text-[var(--muted-foreground)]">{preview.doctor?.name} · {formatFileSize(preview.fileSize)}</p>
              </div>
            </div>
            {preview.summary && (
              <div className="rounded-[var(--radius-lg)] bg-[var(--secondary)] p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">AI Summary</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{preview.summary}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button fullWidth onClick={() => downloadReport(preview._id)} leftIcon={<Download size={16} />}>
                Download
              </Button>
              <Button fullWidth variant="outline" onClick={() => { setPreview(null); }}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteReport}
        title="Delete Report?"
        description="This will permanently delete this medical report."
        loading={isDeleting}
      />
    </div>
  );
};

export default ReportsPage;
