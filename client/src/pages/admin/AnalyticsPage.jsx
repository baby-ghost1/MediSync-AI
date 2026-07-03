import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, UserCog, CalendarDays, BrainCircuit,
  Activity, DollarSign, HeartPulse, ArrowUpRight,
} from "lucide-react";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import PageHeader from "@/components/common/PageHeader";
import SectionLoader from "@/components/common/SectionLoader";
import adminService from "@/services/admin.service";
import { useApiQuery } from "@/hooks/useQuery";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const AnalyticsPage = () => {
  const [period, setPeriod] = useState("monthly");
  const { data, isLoading } = useApiQuery({
    queryKey: ["admin-analytics", period],
    queryFn: () => adminService.getAnalytics({ period }),
  });

  if (isLoading) return <SectionLoader />;

  const a = data?.analytics || data?.data || data || {};

  const metrics = [
    { title: "Total Users", value: a.totalUsers ?? "25,482", icon: Users, color: "text-[var(--primary)]", change: "+12.5%" },
    { title: "Active Doctors", value: a.totalDoctors ?? "862", icon: UserCog, color: "text-[var(--accent)]", change: "+8.3%" },
    { title: "Appointments", value: a.totalAppointments ?? "12,560", icon: CalendarDays, color: "text-[var(--warning)]", change: "+22.1%" },
    { title: "AI Analyses", value: a.aiAnalyses ?? "4,230", icon: BrainCircuit, color: "text-[var(--info)]", change: "+45.2%" },
    { title: "Revenue", value: a.revenue ?? "\u20B918.6L", icon: DollarSign, color: "text-[var(--success)]", change: "+18.4%" },
    { title: "Satisfaction", value: a.satisfaction ?? "98%", icon: HeartPulse, color: "text-[var(--accent)]", change: "+3.2%" },
  ];

  const chartData = a.chartData || a.monthlyData || [];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader title="Platform Analytics" description="Comprehensive platform metrics and insights">
          <div className="flex gap-2">
            {["weekly", "monthly", "yearly"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  period === p
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)]"
                    : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] bg-[var(--surface)]"
                }`}
              >{p.charAt(0).toUpperCase() + p.slice(1)}</button>
            ))}
          </div>
        </PageHeader>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title} whileHover={{ y: -4 }} className="h-full">
              <Card className="relative overflow-hidden h-full transition-all duration-300 hover:shadow-[var(--shadow-lg)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">{item.title}</p>
                    <h2 className="mt-3 text-4xl font-black text-[var(--text-primary)]">{item.value}</h2>
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[var(--success)]">
                      <ArrowUpRight size={16} />{item.change} this {period}
                    </div>
                  </div>
                  <div className={`rounded-2xl bg-[var(--primary-light)] p-4 text-[var(--primary)]`}>
                    <Icon size={28} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-8 xl:grid-cols-2">
        <Card>
          <CardHeader title="Monthly Trends" subtitle={`Platform activity - ${period} view`} />
          <div className="h-72">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-[var(--text-muted)]">
                <div className="text-center">
                  <TrendingUp size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Chart data will appear here</p>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-end gap-2 px-2">
                {chartData.map((item, i) => (
                  <div key={i} className="group relative flex flex-1 flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${item.value || item.count || 0}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-[var(--primary)] to-[var(--info)] transition-all duration-300 group-hover:opacity-80"
                      style={{ maxHeight: "100%", minHeight: "4%" }}
                    />
                    <span className="mt-2 text-[10px] text-[var(--text-muted)]">{item.label || item.month || ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Distribution" subtitle="Platform breakdown" />
          <div className="space-y-6">
            {(a.distribution || a.breakdown || [
              { label: "Patients", value: 65, color: "bg-[var(--primary)]" },
              { label: "Doctors", value: 20, color: "bg-[var(--accent)]" },
              { label: "Admin", value: 5, color: "bg-[var(--success)]" },
              { label: "Hospitals", value: 10, color: "bg-[var(--warning)]" },
            ]).map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--text-primary)]">{item.label}</span>
                  <span className="text-[var(--text-secondary)]">{item.value}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-off)]">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full rounded-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader title="Growth Metrics" subtitle="Key performance indicators" />
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { label: "User Growth", value: a.userGrowth ?? "+22%", icon: TrendingUp },
              { label: "Doctor Growth", value: a.doctorGrowth ?? "+15%", icon: UserCog },
              { label: "Appointment Growth", value: a.appointmentGrowth ?? "+32%", icon: CalendarDays },
              { label: "AI Usage Growth", value: a.aiGrowth ?? "+48%", icon: Activity },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -2 }}
                  className="rounded-[var(--radius-md)] bg-[var(--surface-off)] p-5 transition-all duration-300 hover:shadow-[var(--shadow-md)]"
                >
                  <Icon size={24} className="text-[var(--primary)]" />
                  <p className="mt-4 text-sm text-[var(--text-secondary)]">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--success)]">{item.value}</p>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsPage;
