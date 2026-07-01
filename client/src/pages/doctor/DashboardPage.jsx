import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays, Users, BrainCircuit, Activity, Clock3, Bell,
  Stethoscope, ChevronRight, HeartPulse, FileText,
} from "lucide-react";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import StatCard from "@/components/common/StatCard";
import SectionLoader from "@/components/common/SectionLoader";
import doctorService from "@/services/doctor.service";
import appointmentService from "@/services/appointment.service";
import notificationService from "@/services/notification.service";
import { useApiQuery } from "@/hooks/useQuery";
import ROUTES from "@/routes/routeConstants";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const DashboardPage = () => {
  const { data: dashboard, isLoading } = useApiQuery({
    queryKey: ["doctor-dashboard"],
    queryFn: () => doctorService.getDashboard(),
  });

  const { data: todayAppts } = useApiQuery({
    queryKey: ["doctor-today-appointments"],
    queryFn: () => appointmentService.getToday(),
  });

  const { data: notifs } = useApiQuery({
    queryKey: ["doctor-notifications"],
    queryFn: () => notificationService.getNotifications({ limit: 5 }),
  });

  if (isLoading) return <SectionLoader />;

  const d = dashboard || {};
  const stats = d.stats || d.statistics || {};
  const appointments = todayAppts?.appointments || todayAppts?.data || d.todayAppointments || [];
  const notifications = notifs?.notifications || notifs?.data || [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <Badge variant="gradient" size="md">Doctor Dashboard</Badge>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {greeting} Doctor
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage patients, appointments and AI-assisted diagnosis from one place.
          </p>
        </div>
        <Link to={ROUTES.DOCTOR.APPOINTMENTS}>
          <Button size="lg" variant="gradient">View Schedule</Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Today's Patients" value={stats.todayPatients ?? 0} icon={Users} color="from-blue-600 to-cyan-500" />
        <StatCard title="Appointments" value={stats.totalAppointments ?? 0} icon={CalendarDays} color="from-emerald-500 to-green-600" />
        <StatCard title="AI Reports" value={stats.aiReports ?? 0} icon={BrainCircuit} color="from-violet-500 to-indigo-600" />
        <StatCard title="Success Rate" value={stats.successRate ?? "98%"} icon={HeartPulse} color="from-pink-500 to-rose-500" />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader
                title="Today's Patient Queue"
                subtitle="Manage scheduled consultations"
                action={
                  <Link to={ROUTES.DOCTOR.APPOINTMENTS}>
                    <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={14} />}>
                      View All
                    </Button>
                  </Link>
                }
              />
              <div className="space-y-3">
                {appointments.length === 0 ? (
                  <p className="py-6 text-center text-sm text-[var(--text-secondary)]">
                    No appointments today
                  </p>
                ) : (
                  appointments.map((apt, i) => {
                    const patient = apt.patient || {};
                    return (
                      <Link key={apt._id} to={`${ROUTES.DOCTOR.APPOINTMENTS}/${apt._id}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ scale: 1.005, y: -1 }}
                          className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-md)] sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar name={patient.name} size="md" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[var(--text-primary)]">
                                {patient.name || "Patient"}
                              </p>
                              <p className="text-xs text-[var(--text-secondary)]">
                                {patient.age ? `Age ${patient.age} · ` : ""}
                                {apt.reason || apt.type || "Consultation"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" size="sm">
                              <Clock3 size={12} className="mr-1 inline" />
                              {apt.time || "N/A"}
                            </Badge>
                            <Badge
                              variant={
                                apt.status === "confirmed"
                                  ? "success"
                                  : apt.status === "pending"
                                  ? "warning"
                                  : "primary"
                              }
                              size="sm"
                            >
                              {apt.status || "scheduled"}
                            </Badge>
                            <Button size="sm" variant="gradient">
                              Open
                            </Button>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-[var(--gradient-accent)] text-white border-0">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <Badge variant="glass" size="md">AI Clinical Assistant</Badge>
                  <h2 className="mt-4 text-xl font-bold sm:text-2xl">
                    AI Assisted Diagnosis
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
                    Upload reports, compare previous history and generate preliminary
                    diagnosis with evidence-backed AI recommendations.
                  </p>
                  <div className="mt-5 flex gap-3">
                    <Link to={ROUTES.DOCTOR.AI_ANALYSIS}>
                      <Button variant="secondary" size="md">Open AI</Button>
                    </Link>
                    <Link to={ROUTES.DOCTOR.REPORTS}>
                      <Button variant="glass">Upload Report</Button>
                    </Link>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: [0, 4, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                  className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl"
                >
                  <BrainCircuit size={56} />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader title="Today's Analytics" subtitle="Quick performance overview" />
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { title: "Patients Seen", value: stats.patientsSeen ?? stats.todayPatients ?? "0", icon: Users, color: "text-[var(--primary)]" },
                  { title: "Pending Reports", value: stats.pendingReports ?? "0", icon: FileText, color: "text-[var(--warning)]" },
                  { title: "Diagnosis Accuracy", value: stats.diagnosisAccuracy ?? stats.successRate ?? "98%", icon: Activity, color: "text-[var(--success)]" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      whileHover={{ y: -3 }}
                      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-off)] p-5 transition-all duration-300 hover:shadow-[var(--shadow-md)]"
                    >
                      <Icon size={24} className={item.color} />
                      <p className="mt-3 text-xs text-[var(--text-secondary)]">
                        {item.title}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
                        {item.value}
                      </h3>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader title="Today's Schedule" subtitle="Remaining consultations" />
              <div className="space-y-3">
                {appointments.slice(0, 4).map((apt, i) => {
                  const patient = apt.patient || {};
                  return (
                    <motion.div
                      key={apt._id || apt.time}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border)] p-3 transition-all duration-300 hover:bg-[var(--surface-off)]"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                          {patient.name || "Patient"}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {apt.time || "N/A"}
                        </p>
                      </div>
                      <Badge variant={apt.status === "confirmed" ? "success" : "primary"} size="sm">
                        {apt.status || "scheduled"}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader title="Notifications" subtitle="Recent activity" />
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-xs text-[var(--text-secondary)]">
                    No new notifications
                  </p>
                ) : (
                  notifications.slice(0, 4).map((notif, i) => (
                    <motion.div
                      key={notif._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                      className="flex gap-2.5 rounded-[var(--radius-lg)] bg-[var(--surface-off)] p-3 transition-all duration-300"
                    >
                      <div className="rounded-lg bg-[var(--primary)]/10 p-1.5 text-[var(--primary)]">
                        <Bell size={14} />
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                        {notif.message}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden bg-[var(--gradient-success)] text-white border-0">
              <div className="text-center">
                <HeartPulse size={40} className="mx-auto" />
                <h2 className="mt-4 text-4xl font-bold">
                  {stats.satisfactionRate ?? stats.successRate ?? "98%"}
                </h2>
                <p className="mt-1 text-sm text-white/80">Patient Satisfaction</p>
                <div className="mt-5 rounded-[var(--radius-lg)] bg-white/15 p-4 backdrop-blur-xl">
                  <p className="text-xs leading-relaxed text-white/90">
                    {stats.satisfactionMessage || "Your patient satisfaction score has improved by 6% compared to last month."}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader title="Quick Actions" />
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: "Patients", icon: Users, path: ROUTES.DOCTOR.PATIENTS },
                  { title: "Reports", icon: FileText, path: ROUTES.DOCTOR.REPORTS },
                  { title: "AI", icon: BrainCircuit, path: ROUTES.DOCTOR.AI_ANALYSIS },
                  { title: "Schedule", icon: CalendarDays, path: ROUTES.DOCTOR.APPOINTMENTS },
                  { title: "Vitals", icon: Activity, path: ROUTES.DOCTOR.PATIENTS },
                  { title: "Profile", icon: Stethoscope, path: ROUTES.DOCTOR.PROFILE },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.title} to={item.path}>
                      <motion.button
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-off)] p-[18px] transition-all duration-300 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 hover:shadow-[var(--shadow-sm)]"
                      >
                        <Icon size={22} className="mx-auto text-[var(--primary)]" />
                        <p className="mt-2 text-xs font-semibold text-[var(--text-primary)]">
                          {item.title}
                        </p>
                      </motion.button>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
