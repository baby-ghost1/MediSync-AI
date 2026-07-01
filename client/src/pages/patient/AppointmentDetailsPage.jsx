import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays, Clock, Stethoscope, MapPin, MessageSquare,
  FileText, Phone, Mail, ArrowLeft, XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SectionLoader from "@/components/common/SectionLoader";
import ErrorState from "@/components/ui/ErrorState";
import appointmentService from "@/services/appointment.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import ROUTES from "@/routes/routeConstants";

const AppointmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason] = useState("");

  const { data: appointment, isLoading, error, refetch } = useApiQuery({
    queryKey: ["appointment", id],
    queryFn: () => appointmentService.getAppointment(id),
    enabled: !!id,
  });

  const { mutate: cancelAppointment, isPending: isCancelling } = useApiMutation({
    mutationFn: () => appointmentService.cancelAppointment(id, cancelReason || "Patient cancelled"),
    onSuccess: () => {
      setShowCancel(false);
      refetch();
      toast.success("Appointment cancelled");
    },
    successMessage: "Appointment cancelled",
  });

  if (isLoading) return <SectionLoader />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!appointment) return <ErrorState title="Appointment not found" description="This appointment does not exist" />;

  const a = appointment.appointment || appointment;
  const doctor = a.doctor || {};
  const patient = a.patient || {};

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-black md:text-4xl">Appointment Details</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">ID: {a._id?.slice(-8) || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {a.status === "confirmed" || a.status === "pending" ? (
            <Button variant="danger" leftIcon={<XCircle size={18} />} onClick={() => setShowCancel(true)}>
              Cancel
            </Button>
          ) : null}
          <StatusBadge status={a.status} size="md" />
        </div>
      </motion.div>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <Card>
            <CardHeader title="Appointment Information" />
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: CalendarDays, label: "Date", value: new Date(a.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
                { icon: Clock, label: "Time", value: a.time },
                { icon: Stethoscope, label: "Type", value: a.type || "In-Person Consultation" },
                { icon: MapPin, label: "Location", value: a.location || doctor.hospital || "Main Hospital" },
                { icon: FileText, label: "Reason", value: a.reason || "General consultation" },
                { icon: MessageSquare, label: "Notes", value: a.notes || "No additional notes" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-[var(--radius-lg)] bg-[var(--secondary)] p-4">
                  <div className="rounded-xl bg-[var(--primary-light)] p-3 text-[var(--primary)]">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">{item.label}</p>
                    <p className="mt-1 font-semibold text-[var(--foreground)]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {a.status === "completed" && a.followUp && (
            <Card variant="gradient" className="text-white">
              <h3 className="text-xl font-bold">Follow-Up Recommended</h3>
              <p className="mt-2 text-white/80">
                Your doctor has recommended a follow-up on {new Date(a.followUp).toLocaleDateString()}
              </p>
              <Link to={ROUTES.PATIENT.BOOK_APPOINTMENT}>
                <Button className="mt-4" variant="glass">Book Follow-Up</Button>
              </Link>
            </Card>
          )}
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader title="Doctor" />
            <div className="flex items-center gap-4">
              <Avatar name={doctor.name} src={doctor.avatar} size="lg" />
              <div>
                <h3 className="font-bold text-[var(--foreground)]">{doctor.name || "Dr."}</h3>
                <p className="text-sm text-[var(--primary)]">{doctor.specialization || "General"}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{doctor.email}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <Button fullWidth variant="secondary" leftIcon={<Phone size={16} />}>
                {doctor.phone || "Contact"}
              </Button>
              <Button fullWidth variant="outline" leftIcon={<Mail size={16} />}>
                Send Message
              </Button>
            </div>
          </Card>

          {patient.name && (
            <Card>
              <CardHeader title="Patient" />
              <div className="flex items-center gap-4">
                <Avatar name={patient.name} size="lg" />
                <div>
                  <h3 className="font-bold text-[var(--foreground)]">{patient.name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{patient.email}</p>
                </div>
              </div>
            </Card>
          )}

          {a.status === "cancelled" && a.cancellationReason && (
            <Card className="border-[var(--danger)]/30">
              <CardHeader title="Cancellation Reason" />
              <p className="text-sm leading-7 text-[var(--danger)]">{a.cancellationReason}</p>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={cancelAppointment}
        title="Cancel Appointment?"
        description="This action cannot be undone. Are you sure you want to cancel this appointment?"
        loading={isCancelling}
      />
    </div>
  );
};

export default AppointmentDetailsPage;
