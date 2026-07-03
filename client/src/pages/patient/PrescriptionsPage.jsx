import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Pill, Clock, CalendarDays, Download, ChevronRight,
  Stethoscope,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/components/common/StatusBadge";
import { ListSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import prescriptionService from "@/services/prescription.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

const activeFilters = ["All", "active", "completed", "expired"];

const PrescriptionsPage = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({
    search: debouncedSearch || undefined,
    status: activeFilter !== "All" ? activeFilter : undefined,
    page,
    limit,
  }), [debouncedSearch, activeFilter, page, limit]);

  const { data, isLoading } = useApiQuery({
    queryKey: ["prescriptions", params],
    queryFn: () => prescriptionService.getPrescriptions(params),
  });

  const { mutate: downloadPrescription } = useApiMutation({
    mutationFn: (id) => prescriptionService.downloadPrescription(id),
    onSuccess: (blob, id) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prescription-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });

  const prescriptions = data?.prescriptions || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || prescriptions.length;

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "border-l-4 border-l-[var(--success)]";
      case "completed": return "border-l-4 border-l-[var(--primary)]";
      case "expired": return "border-l-4 border-l-[var(--danger)]";
      default: return "border-l-4 border-l-[var(--border)]";
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Prescriptions"
        description="View and manage your medication prescriptions"
      />

      <Card paddingSize="lg" className="overflow-hidden border-0 bg-[linear-gradient(135deg,var(--success),var(--primary))] text-[var(--primary-foreground)] shadow-[var(--shadow-lg)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--primary-foreground)]/70">Medication plan</p>
            <h2 className="mt-2 text-xl font-semibold">Review your active prescriptions with clarity</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--primary-foreground)]/75">Stay informed about dosage, timing and medication status in one streamlined view.</p>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-[var(--primary-foreground)]/15 px-4 py-3 backdrop-blur-xl">
            <p className="text-sm font-semibold">{prescriptions.length} prescription{prescriptions.length === 1 ? "" : "s"}</p>
          </div>
        </div>
      </Card>

      <Card paddingSize="lg" className="border-[var(--border)]/70 bg-[var(--surface)]/80">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search prescriptions..." />
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((f) => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setPage(1); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                  activeFilter === f
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)]"
                    : "border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {isLoading ? <ListSkeleton items={6} /> : prescriptions.length === 0 ? (
        <EmptyState
          title="No prescriptions yet"
          description={search || activeFilter !== "All" ? "Try adjusting your filters" : "Your prescriptions will appear here once prescribed"}
          icon={Pill}
        />
      ) : (
        <>
          <div className="space-y-4">
            {prescriptions.map((prescription, i) => {
              const meds = prescription.medications || [];
              const isExpanded = expanded === prescription._id;

              return (
                <motion.div
                  key={prescription._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-[var(--radius-xl)] border border-[var(--border)]/80 bg-[linear-gradient(135deg,var(--surface),var(--surface-off))] shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] ${getStatusColor(prescription.status)}`}
                >
                  <div className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-1 items-start gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--success-light)] text-[var(--success)]">
                        <Pill size={26} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold">{prescription.title || `Prescription #${prescription._id?.slice(-6)}`}</h3>
                          <StatusBadge status={prescription.status} size="xs" />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1">
                            <Stethoscope size={14} />
                            {prescription.doctor?.name || "Doctor"}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDays size={14} />
                            Issued: {new Date(prescription.issueDate || prescription.createdAt).toLocaleDateString()}
                          </span>
                          {prescription.expiryDate && (
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              Expires: {new Date(prescription.expiryDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="secondary" size="xs">{meds.length} medication{meds.length !== 1 ? "s" : ""}</Badge>
                          {prescription.diagnosis && <Badge variant="secondary" size="xs">{prescription.diagnosis}</Badge>}
                        </div>

                        {isExpanded && meds.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-5 space-y-3 rounded-[var(--radius-lg)] bg-[var(--secondary)] p-4"
                          >
                            <p className="text-sm font-semibold text-[var(--foreground)]">Medications</p>
                            {meds.map((med, mi) => (
                              <div key={mi} className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--card)] p-3 text-sm">
                                <div>
                                  <span className="font-medium text-[var(--foreground)]">{med.name}</span>
                                  {med.dosage && <span className="ml-2 text-[var(--muted-foreground)]">· {med.dosage}</span>}
                                </div>
                                <div className="text-right text-[var(--muted-foreground)]">
                                  <p>{med.frequency || "As directed"}</p>
                                  {med.duration && <p className="text-xs">for {med.duration}</p>}
                                </div>
                              </div>
                            ))}
                            {prescription.notes && (
                              <p className="pt-2 text-xs italic text-[var(--muted-foreground)]">Note: {prescription.notes}</p>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:self-start">
                      <Button variant="ghost" size="icon" onClick={() => downloadPrescription(prescription._id)}>
                        <Download size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setExpanded(isExpanded ? null : prescription._id)}>
                        <ChevronRight size={18} className={`transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default PrescriptionsPage;
