import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, CalendarDays, ChevronRight } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import { ListSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import consultationService from "@/services/consultation.service";
import { useApiQuery } from "@/hooks/useQuery";
import useAuth from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

const ConsultationNotesPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const doctorId = user?.doctorId;

  const params = useMemo(() => ({
    search: debouncedSearch || undefined, page, limit,
  }), [debouncedSearch, page, limit]);

  const { data, isLoading } = useApiQuery({
    queryKey: ["doctor-consultation-notes", doctorId, params],
    queryFn: () => consultationService.getDoctorNotes(doctorId, params),
    enabled: !!doctorId,
  });

  const notes = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || notes.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <PageHeader title="Consultation Notes" description="Clinical notes from patient consultations" />

      <Card paddingSize="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search notes..." />
        </div>
      </Card>

      {isLoading ? <ListSkeleton items={6} /> : notes.length === 0 ? (
        <EmptyState
          title="No consultation notes"
          description="Notes will appear here after you complete consultations"
          icon={FileText}
        />
      ) : (
        <>
          <div className="space-y-4">
            {notes.map((note, i) => {
              const patient = note.patient || {};
              const patientName = patient.name || "Patient";
              const appointment = note.appointment || {};
              return (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:shadow-[var(--shadow-lg)] md:flex-row md:items-start md:justify-between"
                >
                  <div className="flex items-start gap-5">
                    <Avatar name={patientName} size="lg" />
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">{patientName}</h3>
                      {note.diagnosis && (
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">Diagnosis: {note.diagnosis}</p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1"><CalendarDays size={14} />{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                      {note.symptoms?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {note.symptoms.map((s, idx) => (
                            <Badge key={idx} variant="secondary" size="xs">{s}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    to={`/doctor/appointments/${appointment._id || ""}`}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/5"
                  >
                    View Appointment <ChevronRight size={16} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </>
      )}
    </motion.div>
  );
};

export default ConsultationNotesPage;
