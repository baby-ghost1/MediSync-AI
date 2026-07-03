import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Star, Plus, Trash2, Edit3, Search } from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import PageHeader from "@/components/common/PageHeader";
import { CardSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import prescriptionTemplateService from "@/services/prescriptionTemplate.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import useAuth from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";

const PrescriptionTemplatesPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "", diagnosis: "", medicines: [], advice: "", followUpDays: "",
  });
  const [newMed, setNewMed] = useState({ medicine: "", dosage: "", frequency: "", duration: "", instructions: "" });

  const doctorId = user?.doctorId;

  const { data, isLoading, refetch } = useApiQuery({
    queryKey: ["doctor-templates", doctorId, debouncedSearch],
    queryFn: () => prescriptionTemplateService.getMyTemplates({ search: debouncedSearch, limit: 100 }),
    enabled: !!doctorId,
  });

  const { mutate: createTemplate } = useApiMutation({
    mutationFn: (payload) => prescriptionTemplateService.createTemplate(payload),
    onSuccess: () => { refetch(); setShowCreate(false); resetForm(); toast.success("Template created"); },
  });

  const { mutate: updateTemplate } = useApiMutation({
    mutationFn: ({ id, payload }) => prescriptionTemplateService.updateTemplate(id, payload),
    onSuccess: () => { refetch(); setEditing(null); resetForm(); toast.success("Template updated"); },
  });

  const { mutate: deleteTemplate } = useApiMutation({
    mutationFn: (id) => prescriptionTemplateService.deleteTemplate(id),
    onSuccess: () => { refetch(); toast.success("Template deleted"); },
  });

  const { mutate: toggleFavorite } = useApiMutation({
    mutationFn: (id) => prescriptionTemplateService.toggleFavorite(id),
    onSuccess: () => refetch(),
  });

  const templates = data?.data || [];

  const resetForm = () => {
    setForm({ name: "", diagnosis: "", medicines: [], advice: "", followUpDays: "" });
    setNewMed({ medicine: "", dosage: "", frequency: "", duration: "", instructions: "" });
  };

  const addMedicine = () => {
    if (!newMed.medicine) return;
    setForm((f) => ({ ...f, medicines: [...f.medicines, newMed] }));
    setNewMed({ medicine: "", dosage: "", frequency: "", duration: "", instructions: "" });
  };

  const removeMedicine = (idx) => {
    setForm((f) => ({ ...f, medicines: f.medicines.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = () => {
    if (!form.name) { toast.error("Template name is required"); return; }
    if (editing) {
      updateTemplate({ id: editing, payload: form });
    } else {
      createTemplate(form);
    }
  };

  const openEdit = (template) => {
    setEditing(template._id);
    setForm({
      name: template.name,
      diagnosis: template.diagnosis || "",
      medicines: template.medicines || [],
      advice: template.advice || "",
      followUpDays: template.followUpDays || "",
    });
    setShowCreate(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <PageHeader
        title="Prescription Templates"
        description="Create and manage reusable prescription templates"
        action={
          <Button onClick={() => { setEditing(null); resetForm(); setShowCreate(true); }}>
            <Plus size={16} /> New Template
          </Button>
        }
      />

      <Card paddingSize="lg">
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefix={<Search size={16} />}
        />
      </Card>

      {isLoading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=><CardSkeleton key={i}/>)}</div> : templates.length === 0 ? (
        <EmptyState title="No templates" description="Create your first prescription template" icon={ClipboardList} action={
          <Button onClick={() => { setEditing(null); resetForm(); setShowCreate(true); }}><Plus size={16} /> Create Template</Button>
        } />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5 transition-all duration-300 hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[var(--foreground)]">{t.name}</h3>
                  {t.diagnosis && <p className="mt-1 text-sm text-[var(--muted-foreground)]">{t.diagnosis}</p>}
                </div>
                <button onClick={() => toggleFavorite(t._id)} className="ml-2 text-[var(--muted-foreground)] hover:text-[var(--warning)]">
                  <Star size={16} fill={t.isFavorite ? "var(--warning)" : "none"} />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                {t.medicines?.slice(0, 3).map((m, i) => (
                  <p key={i} className="text-xs text-[var(--muted-foreground)]">
                    {m.medicine} {m.dosage ? `- ${m.dosage}` : ""}
                  </p>
                ))}
                {t.medicines?.length > 3 && (
                  <p className="text-xs text-[var(--primary)]">+{t.medicines.length - 3} more</p>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary" size="xs">Used {t.usageCount || 0} times</Badge>
                <div className="ml-auto flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Edit3 size={14} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteTemplate(t._id)}><Trash2 size={14} className="text-[var(--danger)]" /></Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); setEditing(null); resetForm(); }} title={editing ? "Edit Template" : "New Template"} size="lg">
        <div className="space-y-4">
          <Input label="Template Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input label="Default Diagnosis" value={form.diagnosis} onChange={(e) => setForm((f) => ({ ...f, diagnosis: e.target.value }))} />
          <Textarea label="Default Advice" value={form.advice} onChange={(e) => setForm((f) => ({ ...f, advice: e.target.value }))} />
          <Input label="Follow-up (days)" type="number" value={form.followUpDays} onChange={(e) => setForm((f) => ({ ...f, followUpDays: e.target.value }))} />

          <div className="space-y-3">
            <label className="text-sm font-medium text-[var(--foreground)]">Medicines</label>
            {form.medicines.map((m, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                <div className="flex-1 text-sm"><strong>{m.medicine}</strong> {m.dosage ? `- ${m.dosage}` : ""} {m.frequency ? `- ${m.frequency}` : ""}</div>
                <Button variant="ghost" size="icon" onClick={() => removeMedicine(i)}><Trash2 size={14} className="text-[var(--danger)]" /></Button>
              </div>
            ))}
            <div className="flex flex-wrap gap-2">
              <Input placeholder="Medicine" value={newMed.medicine} onChange={(e) => setNewMed((f) => ({ ...f, medicine: e.target.value }))} className="flex-1 min-w-[120px]" />
              <Input placeholder="Dosage" value={newMed.dosage} onChange={(e) => setNewMed((f) => ({ ...f, dosage: e.target.value }))} className="w-20" />
              <Input placeholder="Frequency" value={newMed.frequency} onChange={(e) => setNewMed((f) => ({ ...f, frequency: e.target.value }))} className="w-24" />
              <Input placeholder="Duration" value={newMed.duration} onChange={(e) => setNewMed((f) => ({ ...f, duration: e.target.value }))} className="w-24" />
              <Button variant="secondary" size="sm" onClick={addMedicine}>Add</Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => { setShowCreate(false); setEditing(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSubmit}>{editing ? "Update" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default PrescriptionTemplatesPage;
