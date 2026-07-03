import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, FileText, Stethoscope, ClipboardList, Pill, ChevronRight } from "lucide-react";

import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/common/PageHeader";
import { ListSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import { useApiQuery } from "@/hooks/useQuery";
import { usePagination } from "@/hooks/usePagination";
import appointmentService from "@/services/appointment.service";
import prescriptionService from "@/services/prescription.service";
import reportService from "@/services/report.service";
import consultationService from "@/services/consultation.service";
import useAuth from "@/hooks/useAuth";
import ROUTES from "@/routes/routeConstants";

const MedicalHistoryPage = () => {
  const { user } = useAuth();
  const patientId = user?.patientId;
  const { page, limit } = usePagination();
  const params = useMemo(() => ({ page, limit }), [page, limit]);

  const { data: appointments, isLoading: loadingApts } = useApiQuery({
    queryKey: ["patient-appointments-history", params],
    queryFn: () => appointmentService.getMyAppointments({ ...params, limit: 20 }),
  });

  const { data: prescriptions, isLoading: loadingRx } = useApiQuery({
    queryKey: ["patient-prescriptions-history"],
    queryFn: () => prescriptionService.getPatientPrescriptions(patientId, { limit: 20 }),
    enabled: !!patientId,
  });

  const { data: reports, isLoading: loadingReports } = useApiQuery({
    queryKey: ["patient-reports-history"],
    queryFn: () => reportService.getPatientReports(patientId, { limit: 20 }),
    enabled: !!patientId,
  });

  const { data: notes, isLoading: loadingNotes } = useApiQuery({
    queryKey: ["patient-consultation-notes-history"],
    queryFn: () => consultationService.getPatientNotes(patientId, { limit: 20 }),
    enabled: !!patientId,
  });

  const isLoading = loadingApts || loadingRx || loadingReports || loadingNotes;
  const appointmentsList = appointments?.data || [];
  const prescriptionsList = prescriptions?.data || [];
  const reportsList = reports?.data || [];
  const notesList = notes?.data || [];

  const timeline = useMemo(() => {
    const events = [
      ...appointmentsList.map((a) => ({
        _id: a._id,
        date: new Date(a.appointmentDate || a.date || a.createdAt).getTime(),
        type: "appointment",
        title: "Appointment",
        description: `${a.reason || "Consultation"} with Dr. ${a.doctor?.name || "Doctor"}`,
        status: a.status,
        link: `${ROUTES.PATIENT.APPOINTMENTS}/${a._id}`,
      })),
      ...prescriptionsList.map((p) => ({
        _id: p._id,
        date: new Date(p.createdAt).getTime(),
        type: "prescription",
        title: "Prescription",
        description: `${p.medicines?.length || 0} medicine(s) prescribed`,
        status: p.status,
        link: `${ROUTES.PATIENT.PRESCRIPTIONS}/${p._id}`,
      })),
      ...reportsList.map((r) => ({
        _id: r._id,
        date: new Date(r.createdAt).getTime(),
        type: "report",
        title: r.title || "Medical Report",
        description: r.category || "Report",
        link: `${ROUTES.PATIENT.REPORTS}/${r._id}`,
      })),
      ...notesList.map((n) => ({
        _id: n._id,
        date: new Date(n.createdAt).getTime(),
        type: "consultation",
        title: "Consultation Note",
        description: n.diagnosis || "Consultation completed",
        link: `/patient/appointments/${n.appointment?._id || ""}`,
      })),
    ];
    return events.sort((a, b) => b.date - a.date);
  }, [appointmentsList, prescriptionsList, reportsList, notesList]);

  const getIcon = (type) => {
    switch (type) {
      case "appointment": return CalendarDays;
      case "prescription": return Pill;
      case "report": return FileText;
      case "consultation": return Stethoscope;
      default: return Clock;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "appointment": return "text-[var(--primary)] bg-[var(--primary)]/10";
      case "prescription": return "text-[var(--success)] bg-[var(--success)]/10";
      case "report": return "text-[var(--warning)] bg-[var(--warning)]/10";
      case "consultation": return "text-[var(--info)] bg-[var(--info)]/10";
      default: return "text-[var(--muted-foreground)] bg-[var(--muted)]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <PageHeader title="Medical History" description="Complete timeline of your healthcare journey" />

      {isLoading ? <ListSkeleton items={8} /> : timeline.length === 0 ? (
        <EmptyState
          title="No medical history"
          description="Your health events will appear here as you use the platform"
          icon={ClipboardList}
        />
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 h-full w-0.5 bg-[var(--border)]" />
          <div className="space-y-6">
            {timeline.slice(0, 50).map((event, i) => {
              const Icon = getIcon(event.type);
              return (
                <Link key={`${event.type}-${event._id}`} to={event.link || "#"}>
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.35 }}
                    className="relative flex items-start gap-6 pl-14"
                  >
                    <div className={`absolute left-4 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full ${getColor(event.type)}`}>
                      <Icon size={12} />
                    </div>
                    <div className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all duration-200 hover:shadow-[var(--shadow-md)]">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[var(--foreground)]">{event.title}</span>
                        {event.status && (
                          <Badge variant={event.status === "completed" || event.status === "dispensed" ? "success" : event.status === "cancelled" ? "danger" : "warning"} size="xs">
                            {event.status}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{event.description}</p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{new Date(event.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                    <ChevronRight size={16} className="mt-4 text-[var(--muted-foreground)]" />
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MedicalHistoryPage;
