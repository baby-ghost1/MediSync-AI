import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays, Clock, User, Stethoscope, MapPin, MessageSquare,
  FileText, ArrowLeft, XCircle, CheckCircle,
  ClipboardCheck, Plus,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import Modal from "@/components/ui/Modal";
import SectionLoader from "@/components/common/SectionLoader";
import ErrorState from "@/components/ui/ErrorState";
import appointmentService from "@/services/appointment.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import ROUTES from "@/routes/routeConstants";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const fadeSlide = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

const AppointmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCancel, setShowCancel] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const { data: appointment, isLoading, error, refetch } = useApiQuery({
    queryKey: ["doctor-appointment", id],
    queryFn: () => appointmentService.getAppointment(id),
    enabled: !!id,
  });

  const { mutate: confirmAppt } = useApiMutation({
    mutationFn: () => appointmentService.confirmAppointment(id),
    onSuccess: () => { refetch(); toast.success("Appointment confirmed"); },
    successMessage: "Appointment confirmed",
  });

  const { mutate: completeAppt } = useApiMutation({
    mutationFn: () => appointmentService.completeAppointment(id),
    onSuccess: () => { refetch(); toast.success("Appointment completed"); },
    successMessage: "Appointment completed",
  });

  const { mutate: cancelAppt } = useApiMutation({
    mutationFn: () => appointmentService.cancelAppointment(id, "Cancelled by doctor"),
    onSuccess: () => { setShowCancel(false); refetch(); toast.success("Appointment cancelled"); },
    successMessage: "Appointment cancelled",
  });

  const { mutate: saveNotes } = useApiMutation({
    mutationFn: () => appointmentService.addNotes(id, notes),
    onSuccess: () => { setShowNotes(false); refetch(); toast.success("Notes saved"); },
    successMessage: "Notes saved",
  });

  if (isLoading) return <SectionLoader />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!appointment) return <ErrorState title="Appointment not found" />;

  const a = appointment.appointment || appointment;
  const patient = a.patient || {};
  const doctor = a.doctor || {};

  const canConfirm = a.status === "pending";
  const canComplete = a.status === "confirmed";
  const canCancel = a.status === "pending" || a.status === "confirmed";

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={fadeSlide} className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></Button>
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)]">Appointment Details</h1>
            <p className="mt-1 text-[var(--text-secondary)]">ID: {a._id?.slice(-8) || "N/A"}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {canConfirm && <Button variant="success" leftIcon={<CheckCircle size={18} />} onClick={confirmAppt}>Confirm</Button>}
          {canComplete && <Button variant="success" leftIcon={<ClipboardCheck size={18} />} onClick={completeAppt}>Complete</Button>}
          {canCancel && <Button variant="danger" leftIcon={<XCircle size={18} />} onClick={() => setShowCancel(true)}>Cancel</Button>}
          <Button variant="outline" leftIcon={<MessageSquare size={18} />} onClick={() => { setNotes(a.notes || ""); setShowNotes(true); }}>Notes</Button>
          <StatusBadge status={a.status} size="md" />
        </div>
      </motion.div>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <motion.div variants={fadeSlide}>
            <Card>
              <CardHeader title="Appointment Information" />
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { icon: CalendarDays, label: "Date", value: new Date(a.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                  { icon: Clock, label: "Time", value: a.time },
                  { icon: Stethoscope, label: "Type", value: a.type || "In-Person" },
                  { icon: MapPin, label: "Location", value: a.location || "Main Hospital" },
                  { icon: FileText, label: "Reason", value: a.reason || "General consultation" },
                  { icon: MessageSquare, label: "Notes", value: a.notes || "No notes added" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 rounded-[var(--radius-lg)] bg-[var(--surface-off)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-sm)]">
                    <div className="rounded-[var(--radius-md)] bg-[var(--primary)]/10 p-3 text-[var(--primary)]"><item.icon size={20} /></div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">{item.label}</p>
                      <p className="mt-1 font-semibold text-[var(--text-primary)]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeSlide} className="flex gap-4">
            <Link to={`${ROUTES.DOCTOR.PRESCRIPTIONS}`} className="flex-1">
              <Button fullWidth variant="outline" leftIcon={<Plus size={16} />}>Create Prescription</Button>
            </Link>
            <Link to={`${ROUTES.DOCTOR.PATIENTS}/${patient._id}`} className="flex-1">
              <Button fullWidth variant="outline" leftIcon={<FileText size={16} />}>View Patient</Button>
            </Link>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div variants={fadeSlide}>
            <Card>
              <CardHeader title="Patient" />
              <div className="flex items-center gap-4">
                <Avatar name={patient.name} src={patient.avatar} size="lg" />
                <div>
                  <h3 className="font-bold text-[var(--text-primary)]">{patient.name || "Patient"}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{patient.email}</p>
                  {patient.phone && <p className="text-sm text-[var(--text-muted)]">{patient.phone}</p>}
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <Link to={`${ROUTES.DOCTOR.PATIENTS}/${patient._id}`}>
                  <Button fullWidth variant="secondary" leftIcon={<User size={16} />}>View Profile</Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {doctor.name && (
            <motion.div variants={fadeSlide}>
              <Card>
                <CardHeader title="Doctor" />
                <div className="flex items-center gap-4">
                  <Avatar name={doctor.name} src={doctor.avatar} size="lg" />
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)]">{doctor.name}</h3>
                    <p className="text-sm text-[var(--primary)]">{doctor.specialization || "General"}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {a.status === "cancelled" && a.cancellationReason && (
            <motion.div variants={fadeSlide}>
              <Card className="border-[var(--danger)]/30">
                <CardHeader title="Cancellation Reason" />
                <p className="text-sm leading-7 text-[var(--danger)]">{a.cancellationReason}</p>
              </Card>
            </motion.div>
          )}

          {a.status === "completed" && a.followUp && (
            <motion.div variants={fadeSlide}>
              <Card variant="gradient" className="text-white">
                <h3 className="text-xl font-bold">Follow-Up Scheduled</h3>
                <p className="mt-2 text-blue-100">{new Date(a.followUp).toLocaleDateString()}</p>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <ConfirmDialog open={showCancel} onClose={() => setShowCancel(false)} onConfirm={cancelAppt}
        title="Cancel Appointment?" description="This will cancel the appointment. The patient will be notified." />

      <Modal open={showNotes} onClose={() => setShowNotes(false)} title="Clinical Notes" size="lg">
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6}
          className="w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20"
          placeholder="Add clinical notes, observations, or follow-up instructions..." />
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowNotes(false)}>Cancel</Button>
          <Button onClick={saveNotes}>Save Notes</Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AppointmentDetailsPage;
