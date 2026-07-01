import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Pill,
  BrainCircuit,
  HeartPulse,
  Clock3,
  Bell,
  Stethoscope,
  Activity,
  ChevronRight,
} from "lucide-react";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import StatCard from "@/components/common/StatCard";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";
import patientService from "@/services/patient.service";
import { useApiQuery } from "@/hooks/useQuery";
import ROUTES from "@/routes/routeConstants";

const DashboardPage = () => {
  const { data, isLoading, error } = useApiQuery({
    queryKey: ["patient", "dashboard"],
    queryFn: () => patientService.getDashboard(),
  });

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-[var(--danger)]">Failed to load dashboard</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const appointments = data?.upcomingAppointments || [];
  const healthScore = data?.healthScore || 96;
  const notifications = data?.recentNotifications || [];
  const medicines = data?.todayMedicines || [];

  const statItems = [
    { title: "Upcoming Appointments", value: stats.upcomingAppointments ?? 8, icon: CalendarDays, color: "from-[var(--primary)] to-[var(--info)]", trend: 12 },
    { title: "Medicines", value: stats.medicines ?? 12, icon: Pill, color: "from-[var(--success)] to-[#059669]", trend: 8 },
    { title: "AI Reports", value: stats.aiReports ?? 27, icon: BrainCircuit, color: "from-[var(--accent)] to-[var(--primary)]", trend: 24 },
    { title: "Health Score", value: `${healthScore}%`, icon: HeartPulse, color: "from-pink-500 to-rose-500", trend: 5 },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 rounded-[28px] border border-[var(--border)]/70 bg-[var(--card)]/80 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm lg:flex-row lg:items-center"
      >
        <div>
          <Badge variant="primary" size="md">Welcome Back</Badge>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Patient Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Monitor your health, appointments, medicines and AI reports.
          </p>
        </div>
        <Link to={ROUTES.PATIENT.BOOK_APPOINTMENT}>
          <Button size="lg" variant="gradient">
            Book Appointment
          </Button>
        </Link>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item, i) => (
          <StatCard key={item.title} index={i} {...item} trendLabel="this month" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader
              title="Upcoming Appointments"
              subtitle="Your scheduled consultations"
              action={
                <Link to={ROUTES.PATIENT.APPOINTMENTS}>
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={14} />}>
                    View All
                  </Button>
                </Link>
              }
            />
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <p className="py-6 text-center text-sm text-[var(--muted-foreground)]">
                  No upcoming appointments
                </p>
              ) : (
                appointments.map((apt) => (
                  <Link key={apt._id} to={`${ROUTES.PATIENT.APPOINTMENTS}/${apt._id}`}>
                    <motion.div
                      whileHover={{ scale: 1.005 }}
                      className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={apt.doctor?.name || "Dr."} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--foreground)]">
                            {apt.doctor?.name || "Doctor"}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {apt.doctor?.specialization || "General"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" size="sm">
                          <Clock3 size={12} className="mr-1 inline" />
                          {new Date(apt.date).toLocaleDateString()} {apt.time}
                        </Badge>
                        <Badge variant={apt.status === "confirmed" ? "primary" : "warning"} size="sm">
                          {apt.status}
                        </Badge>
                      </div>
                    </motion.div>
                  </Link>
                ))
              )}
            </div>
          </Card>

          <Card className="overflow-hidden border-0 bg-[var(--gradient-primary)] text-white">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Badge variant="glass" size="md">AI Assistant</Badge>
                <h2 className="mt-4 text-xl font-bold leading-tight sm:text-2xl">
                  Your Personal AI Doctor
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
                  Describe your symptoms, upload reports and receive AI-powered
                  insights before visiting a doctor.
                </p>
                <Link to={ROUTES.PATIENT.AI_ASSISTANT}>
                  <Button className="mt-5" variant="secondary" size="md">
                    Chat With AI
                  </Button>
                </Link>
              </div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl"
              >
                <BrainCircuit size={56} />
              </motion.div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Today's Health Summary" subtitle="AI generated overview" />
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: "Heart Rate", value: stats.heartRate || "72 bpm", icon: HeartPulse, color: "text-[var(--danger)]" },
                { title: "Blood Pressure", value: stats.bloodPressure || "120/80", icon: Activity, color: "text-[var(--primary)]" },
                { title: "Activity", value: stats.activity || "9,450 Steps", icon: CalendarDays, color: "text-[var(--success)]" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4"
                  >
                    <Icon size={24} className={item.color} />
                    <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                      {item.title}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-[var(--foreground)]">
                      {item.value}
                    </h3>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Today's Medicines" subtitle="Medication Reminder" />
            <div className="space-y-3">
              {medicines.length === 0 ? (
                <p className="py-6 text-center text-sm text-[var(--muted-foreground)]">
                  No medicines scheduled today
                </p>
              ) : (
                medicines.map((med, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 3 }}
                    className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
                        <Pill size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {med.name}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {med.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant={med.taken ? "success" : "warning"} size="sm">
                      {med.taken ? "Taken" : "Pending"}
                    </Badge>
                  </motion.div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Notifications" subtitle="Latest updates" />
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="py-6 text-center text-sm text-[var(--muted-foreground)]">
                  No notifications
                </p>
              ) : (
                notifications.map((note, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-start gap-2.5 rounded-2xl border border-[var(--border)]/60 bg-[var(--secondary)] p-3"
                  >
                    <div className="rounded-lg bg-[var(--primary-light)] p-1.5 text-[var(--primary)]">
                      <Bell size={14} />
                    </div>
                    <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                      {note.message}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </Card>

          <Card className="overflow-hidden bg-[var(--gradient-success)] text-white border-0">
            <div className="text-center">
              <HeartPulse size={40} className="mx-auto" />
              <h2 className="mt-4 text-4xl font-bold">{healthScore}%</h2>
              <p className="mt-1 text-sm text-white/80">Overall Health Score</p>
              <div className="mt-5 rounded-xl bg-white/15 p-4 backdrop-blur-xl">
                <p className="text-xs leading-relaxed text-white/90">
                  {data?.healthMessage || "Your health indicators are excellent. Continue following your current routine."}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "Book", icon: CalendarDays, to: ROUTES.PATIENT.BOOK_APPOINTMENT },
                { title: "Doctors", icon: Stethoscope, to: ROUTES.PATIENT.APPOINTMENTS },
                { title: "AI Chat", icon: BrainCircuit, to: ROUTES.PATIENT.AI_ASSISTANT },
                { title: "Reports", icon: Activity, to: ROUTES.PATIENT.REPORTS },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} to={action.to}>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/50 hover:bg-[var(--primary-light)]"
                    >
                      <Icon size={22} className="mx-auto text-[var(--primary)]" />
                      <p className="mt-2 text-xs font-semibold text-[var(--foreground)]">
                        {action.title}
                      </p>
                    </motion.button>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
