import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, CalendarDays, Activity, Heart,
  Droplet, Ruler, Weight, FileText, Pill, Stethoscope,
  ArrowLeft, ChevronRight, Plus, Thermometer,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import StatusBadge from "@/components/common/StatusBadge";
import Modal from "@/components/ui/Modal";
import SectionLoader from "@/components/common/SectionLoader";
import ErrorState from "@/components/ui/ErrorState";
import doctorService from "@/services/doctor.service";
import appointmentService from "@/services/appointment.service";
import reportService from "@/services/report.service";
import prescriptionService from "@/services/prescription.service";
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

const PatientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showVitals, setShowVitals] = useState(false);

  const { data: patientData, isLoading, error, refetch } = useApiQuery({
    queryKey: ["doctor-patient", id],
    queryFn: () => doctorService.getPatientDetails(id),
    enabled: !!id,
  });

  const { data: appointments } = useApiQuery({
    queryKey: ["doctor-patient-appointments", id],
    queryFn: () => appointmentService.getByPatient(id, { limit: 5 }),
    enabled: !!id,
  });

  const { data: reports } = useApiQuery({
    queryKey: ["doctor-patient-reports", id],
    queryFn: () => reportService.getPatientReports(id, { limit: 5 }),
    enabled: !!id,
  });

  const { data: prescriptions } = useApiQuery({
    queryKey: ["doctor-patient-prescriptions", id],
    queryFn: () => prescriptionService.getPatientPrescriptions(id, { limit: 5 }),
    enabled: !!id,
  });

  const { mutate: addVitals } = useApiMutation({
    mutationFn: (data) => doctorService.updatePatient(id, { vitals: data }),
    onSuccess: () => { setShowVitals(false); refetch(); toast.success("Vitals updated"); },
    successMessage: "Vitals updated",
  });

  if (isLoading) return <SectionLoader />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!patientData) return <ErrorState title="Patient not found" />;

  const patient = patientData.patient || patientData;
  const vitals = patient.vitals || {};
  const apptsList = appointments?.appointments || appointments?.data || [];
  const reportsList = reports?.reports || reports?.data || [];
  const prescriptionsList = prescriptions?.prescriptions || prescriptions?.data || [];

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
          <Avatar name={patient.name} src={patient.avatar} size="xl" />
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)]">{patient.name}</h1>
            <p className="flex items-center gap-2 text-[var(--text-secondary)]">
              {patient.email} {patient.phone && `· ${patient.phone}`}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Plus size={16} />} onClick={() => setShowVitals(true)}>Add Vitals</Button>
          <Link to={ROUTES.DOCTOR.APPOINTMENTS}>
            <Button variant="gradient" leftIcon={<CalendarDays size={16} />}>Book Appointment</Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          {vitals && Object.keys(vitals).length > 0 && (
            <motion.div variants={fadeSlide}>
              <Card>
                <CardHeader title="Vitals" subtitle="Latest recorded vitals" />
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    { icon: Activity, label: "Blood Pressure", value: vitals.bloodPressure || "N/A", unit: "mmHg" },
                    { icon: Heart, label: "Heart Rate", value: vitals.heartRate || "N/A", unit: "bpm" },
                    { icon: Droplet, label: "Blood Sugar", value: vitals.bloodSugar || "N/A", unit: "mg/dL" },
                    { icon: Ruler, label: "Height", value: vitals.height || "N/A", unit: "cm" },
                    { icon: Weight, label: "Weight", value: vitals.weight || "N/A", unit: "kg" },
                    { icon: Thermometer, label: "Temperature", value: vitals.temperature || "N/A", unit: "°F" },
                  ].map((v) => {
                    const Icon = v.icon;
                    return (
                      <div key={v.label} className="rounded-[var(--radius-lg)] bg-[var(--surface-off)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-sm)]">
                        <Icon size={20} className="text-[var(--primary)]" />
                        <p className="mt-3 text-xs text-[var(--text-secondary)]">{v.label}</p>
                        <p className="mt-1 text-xl font-bold text-[var(--text-primary)]">{v.value} <span className="text-xs font-normal text-[var(--text-muted)]">{v.unit}</span></p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          <motion.div variants={fadeSlide}>
            <Card>
              <CardHeader
                title="Recent Appointments"
                action={<Link to={ROUTES.DOCTOR.APPOINTMENTS}><Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>View All</Button></Link>}
              />
              {apptsList.length === 0 ? <p className="py-4 text-center text-[var(--text-muted)]">No appointments yet</p> : (
                <div className="space-y-3">
                  {apptsList.map((apt, i) => (
                    <Link key={apt._id} to={`${ROUTES.DOCTOR.APPOINTMENTS}/${apt._id}`}>
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:border-[var(--border-hover)]"
                      >
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{apt.reason || "Consultation"}</p>
                          <p className="text-sm text-[var(--text-secondary)]">{new Date(apt.date).toLocaleDateString()} · {apt.time}</p>
                        </div>
                        <StatusBadge status={apt.status} />
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div variants={fadeSlide}>
            <Card>
              <CardHeader title="Recent Reports" action={<Link to={ROUTES.DOCTOR.REPORTS}><Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>View All</Button></Link>} />
              {reportsList.length === 0 ? <p className="py-4 text-center text-[var(--text-muted)]">No reports yet</p> : (
                <div className="space-y-3">
                  {reportsList.map((report, i) => (
                    <motion.div
                      key={report._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-md)]"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-[var(--primary)]" />
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{report.title || "Report"}</p>
                          <p className="text-xs text-[var(--text-muted)]">{new Date(report.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <StatusBadge status={report.status || "completed"} />
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div variants={fadeSlide}>
            <Card>
              <CardHeader title="Prescriptions" action={<Link to={ROUTES.DOCTOR.PRESCRIPTIONS}><Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>View All</Button></Link>} />
              {prescriptionsList.length === 0 ? <p className="py-4 text-center text-[var(--text-muted)]">No prescriptions yet</p> : (
                <div className="space-y-3">
                  {prescriptionsList.map((pres, i) => (
                    <motion.div
                      key={pres._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-md)]"
                    >
                      <div className="flex items-center gap-3">
                        <Pill size={18} className="text-[var(--success)]" />
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{pres.title || "Prescription"}</p>
                          <p className="text-xs text-[var(--text-muted)]">{new Date(pres.createdAt).toLocaleDateString()} · {pres.medications?.length || 0} medications</p>
                        </div>
                      </div>
                      <StatusBadge status={pres.status || "active"} />
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div variants={fadeSlide}>
            <Card>
              <CardHeader title="Patient Info" />
              <div className="space-y-4">
                {[
                  { icon: User, label: "Age", value: patient.age ? `${patient.age} years` : "N/A" },
                  { icon: User, label: "Gender", value: patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : "N/A" },
                  { icon: Droplet, label: "Blood Group", value: patient.bloodGroup || "N/A" },
                  { icon: CalendarDays, label: "Registered", value: patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "N/A" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center justify-between rounded-[var(--radius-lg)] bg-[var(--surface-off)] px-4 py-3 transition-all duration-300">
                      <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><Icon size={14} />{item.label}</span>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {patient.medicalHistory?.length > 0 && (
            <motion.div variants={fadeSlide}>
              <Card>
                <CardHeader title="Medical History" />
                <div className="space-y-3">
                  {patient.medicalHistory.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="rounded-[var(--radius-lg)] border-l-4 border-l-[var(--primary)] bg-[var(--surface-off)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-sm)]"
                    >
                      <p className="font-semibold text-[var(--text-primary)]">{h.condition || h.title}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{new Date(h.date || h.diagnosedDate).toLocaleDateString()}</p>
                      {h.notes && <p className="mt-1 text-sm text-[var(--text-secondary)]">{h.notes}</p>}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          <motion.div variants={fadeSlide}>
            <Link to={`${ROUTES.DOCTOR.PRESCRIPTIONS}?patient=${id}`}>
              <Button fullWidth variant="outline" leftIcon={<Stethoscope size={16} />}>Create Prescription</Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <Modal open={showVitals} onClose={() => setShowVitals(false)} title="Add Vitals" size="md">
        <form onSubmit={(e) => { e.preventDefault(); const form = new FormData(e.target); addVitals(Object.fromEntries(form)); }} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "bloodPressure", label: "Blood Pressure", placeholder: "120/80", unit: "mmHg" },
              { name: "heartRate", label: "Heart Rate", placeholder: "72", unit: "bpm" },
              { name: "bloodSugar", label: "Blood Sugar", placeholder: "100", unit: "mg/dL" },
              { name: "temperature", label: "Temperature", placeholder: "98.6", unit: "°F" },
              { name: "weight", label: "Weight", placeholder: "70", unit: "kg" },
              { name: "height", label: "Height", placeholder: "170", unit: "cm" },
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-1 block text-sm font-medium text-[var(--text-primary)]">{field.label} ({field.unit})</label>
                <input name={field.name} placeholder={field.placeholder}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20" />
              </div>
            ))}
          </div>
          <Button type="submit" fullWidth>Save Vitals</Button>
        </form>
      </Modal>
    </motion.div>
  );
};

export default PatientDetailsPage;
