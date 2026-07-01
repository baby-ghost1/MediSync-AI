import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Pill, Plus, CalendarDays, Download, ChevronRight,
  CheckCircle, User,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

import Button from "@/components/ui/Button";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/components/common/StatusBadge";
import SectionLoader from "@/components/common/SectionLoader";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import prescriptionService from "@/services/prescription.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

const statusFilters = ["All", "active", "completed", "expired"];

const PrescriptionsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({
    search: debouncedSearch || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
    page, limit,
  }), [debouncedSearch, statusFilter, page, limit]);

  const { data, isLoading, refetch } = useApiQuery({
    queryKey: ["doctor-prescriptions", params],
    queryFn: () => prescriptionService.getPrescriptions(params),
  });

  const { mutate: createPrescription, isPending: isCreating } = useApiMutation({
    mutationFn: (payload) => prescriptionService.createPrescription(payload),
    onSuccess: () => { setShowCreate(false); refetch(); },
    successMessage: "Prescription created",
  });

  const { mutate: updatePrescription } = useApiMutation({
    mutationFn: ({ id, payload }) => prescriptionService.updatePrescription(id, payload),
    onSuccess: () => { setEditing(null); refetch(); },
    successMessage: "Prescription updated",
  });

  const { mutate: markDispensed } = useApiMutation({
    mutationFn: (id) => prescriptionService.markDispensed(id),
    onSuccess: () => refetch(),
    successMessage: "Marked as dispensed",
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

  const [formData, setFormData] = useState({ patientId: "", title: "", diagnosis: "", medications: [{ name: "", dosage: "", frequency: "", duration: "" }], notes: "" });

  const handleFormChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleMedicationChange = (index, field, value) => {
    const meds = [...formData.medications];
    meds[index] = { ...meds[index], [field]: value };
    setFormData((prev) => ({ ...prev, medications: meds }));
  };

  const addMedication = () => {
    setFormData((prev) => ({ ...prev, medications: [...prev.medications, { name: "", dosage: "", frequency: "", duration: "" }] }));
  };

  const removeMedication = (index) => {
    setFormData((prev) => ({ ...prev, medications: prev.medications.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updatePrescription({ id: editing, payload: formData });
    } else {
      createPrescription(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <PageHeader
        title="Prescriptions"
        description="Create and manage patient prescriptions"
        actions={<Button variant="gradient" leftIcon={<Plus size={18} />} onClick={() => { setEditing(null); setFormData({ patientId: "", title: "", diagnosis: "", medications: [{ name: "", dosage: "", frequency: "", duration: "" }], notes: "" }); setShowCreate(true); }}>New Prescription</Button>}
      />

      <Card paddingSize="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search prescriptions..." />
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((f) => (
              <button key={f} onClick={() => { setStatusFilter(f); setPage(1); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${statusFilter === f ? "bg-[var(--primary)] text-white shadow-sm" : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"}`}
              >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
            ))}
          </div>
        </div>
      </Card>

      {isLoading ? <SectionLoader /> : prescriptions.length === 0 ? (
        <EmptyState title="No prescriptions yet" description="Create your first prescription" icon={Pill} actionText="New Prescription" onAction={() => setShowCreate(true)} />
      ) : (
        <>
          <div className="space-y-4">
            {prescriptions.map((prescription, i) => {
              const meds = prescription.medications || [];
              const patient = prescription.patient || {};
              const isExpanded = expanded === prescription._id;
              return (
                <motion.div key={prescription._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:shadow-[var(--shadow-lg)] ${
                    prescription.status === "active" ? "border-l-4 border-l-[var(--success)]" : prescription.status === "completed" ? "border-l-4 border-l-[var(--primary)]" : ""
                  }`}
                >
                  <div className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-1 items-start gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--success)]/10 text-[var(--success)]"><Pill size={26} /></div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-[var(--text-primary)]">{prescription.title || `Prescription #${prescription._id?.slice(-6)}`}</h3>
                          <StatusBadge status={prescription.status} size="xs" />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
                          <span className="flex items-center gap-1"><User size={14} />{patient.name || "Patient"}</span>
                          {prescription.diagnosis && <span>{prescription.diagnosis}</span>}
                          <span className="flex items-center gap-1"><CalendarDays size={14} />{new Date(prescription.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="secondary" size="xs">{meds.length} medication{meds.length !== 1 ? "s" : ""}</Badge>
                        </div>
                        {isExpanded && meds.length > 0 && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-5 space-y-3 rounded-[var(--radius-lg)] bg-[var(--surface-off)] p-4">
                            <p className="text-sm font-semibold text-[var(--text-primary)]">Medications</p>
                            {meds.map((med, mi) => (
                              <div key={mi} className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--surface)] p-3 text-sm transition-all duration-300 hover:shadow-[var(--shadow-sm)]">
                                <div><span className="font-medium text-[var(--text-primary)]">{med.name}</span>{med.dosage && <span className="ml-2 text-[var(--text-muted)]">· {med.dosage}</span>}</div>
                                <div className="text-right text-[var(--text-muted)]"><p>{med.frequency || "As directed"}</p>{med.duration && <p className="text-xs">for {med.duration}</p>}</div>
                              </div>
                            ))}
                            {prescription.notes && <p className="pt-2 text-xs italic text-[var(--text-muted)]">Note: {prescription.notes}</p>}
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:self-start">
                      {prescription.status === "active" && (
                        <Button variant="ghost" size="icon" onClick={() => markDispensed(prescription._id)} className="transition-all duration-300 hover:bg-[var(--success)]/10"><CheckCircle size={18} className="text-[var(--success)]" /></Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => downloadPrescription(prescription._id)} className="transition-all duration-300 hover:bg-[var(--primary)]/10"><Download size={18} /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setExpanded(isExpanded ? null : prescription._id)} className="transition-all duration-300 hover:bg-[var(--primary)]/10"><ChevronRight size={18} className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} /></Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </>
      )}

      <Modal open={showCreate || !!editing} onClose={() => { setShowCreate(false); setEditing(null); }} title={editing ? "Update Prescription" : "New Prescription"} size="xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Patient ID</label>
              <input value={formData.patientId} onChange={(e) => handleFormChange("patientId", e.target.value)} className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20" placeholder="Patient ID" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Title</label>
              <input value={formData.title} onChange={(e) => handleFormChange("title", e.target.value)} className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20" placeholder="e.g. Post-Op Medication" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Diagnosis</label>
              <input value={formData.diagnosis} onChange={(e) => handleFormChange("diagnosis", e.target.value)} className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20" placeholder="Diagnosis" />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Medications</p>
              <Button type="button" variant="ghost" size="sm" leftIcon={<Plus size={14} />} onClick={addMedication}>Add</Button>
            </div>
            <div className="space-y-3">
              {formData.medications.map((med, i) => (
                <div key={i} className="flex flex-wrap items-end gap-3 rounded-[var(--radius-lg)] bg-[var(--surface-off)] p-4">
                  <div className="flex-1 min-w-[120px]">
                    <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Medication</label>
                    <input value={med.name} onChange={(e) => handleMedicationChange(i, "name", e.target.value)} className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20" placeholder="Name" />
                  </div>
                  <div className="w-20">
                    <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Dosage</label>
                    <input value={med.dosage} onChange={(e) => handleMedicationChange(i, "dosage", e.target.value)} className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20" placeholder="e.g. 500mg" />
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Frequency</label>
                    <input value={med.frequency} onChange={(e) => handleMedicationChange(i, "frequency", e.target.value)} className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20" placeholder="e.g. Twice daily" />
                  </div>
                  <div className="w-24">
                    <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">Duration</label>
                    <input value={med.duration} onChange={(e) => handleMedicationChange(i, "duration", e.target.value)} className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20" placeholder="e.g. 7 days" />
                  </div>
                  {formData.medications.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeMedication(i)} className="transition-all duration-300 hover:bg-[var(--danger)]/10"><ChevronRight size={16} className="rotate-45 text-[var(--danger)]" /></Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">Notes</label>
            <textarea value={formData.notes} onChange={(e) => handleFormChange("notes", e.target.value)} rows={2} className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20" placeholder="Additional instructions..." />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => { setShowCreate(false); setEditing(null); }}>Cancel</Button>
            <Button type="submit" loading={isCreating}>{editing ? "Update" : "Create Prescription"}</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default PrescriptionsPage;
