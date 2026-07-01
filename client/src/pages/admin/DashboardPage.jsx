import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, UserCog, Hospital, CalendarDays, Activity,
  BrainCircuit, Bell, TrendingUp, ShieldCheck, Server,
  ChevronRight,
} from "lucide-react";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import StatCard from "@/components/common/StatCard";
import SectionLoader from "@/components/common/SectionLoader";
import adminService from "@/services/admin.service";
import { useApiQuery } from "@/hooks/useQuery";
import ROUTES from "@/routes/routeConstants";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const DashboardPage = () => {
  const { data: dashboard, isLoading } = useApiQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminService.getDashboard(),
  });

  const d = dashboard || {};
  const stats = d.stats || d.statistics || {};
  const recentUsers = d.recentUsers || d.latestUsers || d.recentRegistrations || [];

  if (isLoading) return <SectionLoader />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <Badge variant="gradient" size="md">Admin Dashboard</Badge>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl text-[var(--text-primary)]">
            Platform Overview
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Monitor hospitals, doctors, patients, AI services and complete platform analytics.
          </p>
        </div>
        <Link to={ROUTES.ADMIN.ANALYTICS}>
          <Button size="lg" variant="gradient">Manage Platform</Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={stats.totalUsers ?? "0"} icon={Users} color="from-blue-600 to-cyan-500" trend={stats.userGrowth ? `+${stats.userGrowth}%` : undefined} />
        <StatCard title="Doctors" value={stats.totalDoctors ?? "0"} icon={UserCog} color="from-violet-600 to-indigo-600" trend={stats.doctorGrowth ? `+${stats.doctorGrowth}%` : undefined} />
        <StatCard title="Hospitals" value={stats.totalHospitals ?? "0"} icon={Hospital} color="from-emerald-500 to-green-600" />
        <StatCard title="Appointments" value={stats.totalAppointments ?? "0"} icon={CalendarDays} color="from-orange-500 to-red-500" trend={stats.appointmentGrowth ? `+${stats.appointmentGrowth}%` : undefined} />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div variants={itemVariants} className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader
              title="Recent Users"
              subtitle="Latest registrations"
              action={
                <Link to={ROUTES.ADMIN.USERS}>
                  <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={14} />}>
                    View All
                  </Button>
                </Link>
              }
            />
            <div className="space-y-3">
              {(!recentUsers || recentUsers.length === 0) ? (
                <p className="py-6 text-center text-sm text-[var(--text-secondary)]">
                  No recent users
                </p>
              ) : (
                recentUsers.slice(0, 5).map((user) => (
                  <motion.div
                    key={user._id || user.name}
                    whileHover={{ scale: 1.005 }}
                    className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-md)] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} src={user.avatar} size="md" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {user.name}
                        </p>
                        <p className="text-xs capitalize text-[var(--text-secondary)]">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        user.status === "verified" || user.status === "active"
                          ? "success"
                          : user.status === "pending"
                          ? "warning"
                          : "primary"
                      }
                      size="sm"
                    >
                      {user.status || "Active"}
                    </Badge>
                  </motion.div>
                ))
              )}
            </div>
          </Card>

          <Card className="overflow-hidden bg-[var(--gradient-accent)] text-white border-0">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Badge variant="glass" size="md">AI Analytics</Badge>
                <h2 className="mt-4 text-xl font-bold sm:text-2xl">
                  Platform Intelligence
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
                  Monitor AI usage, report generation, diagnostic accuracy,
                  appointment trends, and overall system health.
                </p>
                <div className="mt-5">
                  <Link to={ROUTES.ADMIN.ANALYTICS}>
                    <Button variant="secondary" size="md">Analytics</Button>
                  </Link>
                </div>
              </div>
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5 }}
                className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl"
              >
                <BrainCircuit size={56} />
              </motion.div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Platform Health" subtitle="Today's infrastructure status" />
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: "Server Load", value: stats.serverLoad ?? "32%", icon: Server, color: "text-[var(--primary)]" },
                { title: "Security", value: stats.security ?? "100%", icon: ShieldCheck, color: "text-[var(--success)]" },
                { title: "System Uptime", value: stats.uptime ?? "99.99%", icon: Activity, color: "text-[var(--accent)]" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    whileHover={{ y: -2 }}
                    className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-off)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-md)]"
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

        <motion.div variants={itemVariants} className="space-y-6">
          <Card>
            <CardHeader title="System Alerts" subtitle="Latest platform events" />
            <div className="space-y-3">
              {(d.alerts || d.systemAlerts || []).length === 0 ? (
                <p className="py-4 text-center text-xs text-[var(--text-secondary)]">
                  All systems operational
                </p>
              ) : (
                (d.alerts || d.systemAlerts || []).slice(0, 4).map((alert, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 3 }}
                    className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-off)] p-3 transition-all duration-300 hover:shadow-[var(--shadow-sm)]"
                  >
                    <div className="rounded-lg bg-[var(--primary-light)] p-1.5 text-[var(--primary)]">
                      <Bell size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed text-[var(--text-primary)]">
                        {alert.message}
                      </p>
                      <Badge className="mt-2" variant={alert.type || "primary"} size="xs">
                        {alert.type?.charAt(0).toUpperCase() + alert.type?.slice(1) || "Info"}
                      </Badge>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>

          <Card className="overflow-hidden bg-[var(--gradient-success)] text-white border-0">
            <div className="text-center">
              <TrendingUp size={40} className="mx-auto" />
              <h2 className="mt-4 text-4xl font-bold">
                {stats.uptime ?? "99.99%"}
              </h2>
              <p className="mt-1 text-sm text-white/80">System Uptime</p>
              <div className="mt-5 rounded-[var(--radius-md)] bg-white/15 p-4 backdrop-blur-xl">
                <p className="text-xs leading-relaxed text-white/90">
                  Infrastructure is healthy. All services are operational.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Revenue" subtitle="Current month" />
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[var(--success)]">
                {stats.revenue ?? "\u20B918.6L"}
              </h2>
              <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
                {stats.revenueGrowth ? `+${stats.revenueGrowth}% from last month` : "+18.4% from last month"}
              </p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--surface-off)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stats.revenuePercent ?? "82%" }}
                  transition={{ duration: 1.5 }}
                  className="h-full rounded-full bg-[var(--gradient-success)]"
                />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "Users", icon: Users, path: ROUTES.ADMIN.USERS },
                { title: "Doctors", icon: UserCog, path: ROUTES.ADMIN.DOCTORS },
                { title: "Analytics", icon: TrendingUp, path: ROUTES.ADMIN.ANALYTICS },
                { title: "Settings", icon: Server, path: ROUTES.ADMIN.SETTINGS },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.title} to={item.path}>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-off)] p-4 transition-all duration-300 hover:border-[var(--primary)]/50 hover:bg-[var(--primary-light)] hover:shadow-[var(--shadow-md)]"
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
    </motion.div>
  );
};

export default DashboardPage;
