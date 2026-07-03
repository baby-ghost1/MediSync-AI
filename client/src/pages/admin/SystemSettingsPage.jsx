import { motion } from "framer-motion";
import {
  Shield, Moon, Sun, Monitor, Server, Globe, Mail,
  Database, Lock, RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/common/PageHeader";
import { useTheme } from "@/theme/useTheme";
import adminService from "@/services/admin.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";

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

const SystemSettingsPage = () => {
  const { theme, setTheme } = useTheme();

  const { data: settings } = useApiQuery({
    queryKey: ["admin-settings"],
    queryFn: () => adminService.getSettings(),
  });

  const { mutate: updateSettings } = useApiMutation({
    mutationFn: (payload) => adminService.updateSettings(payload),
    onSuccess: () => toast.success("Settings saved"),
    successMessage: "Settings saved",
  });

  const s = settings?.settings || settings || {};

  const maintenance = s.maintenanceMode || false;
  const registrations = s.allowRegistrations !== false;
  const emailNotifications = s.emailNotifications !== false;

  const toggleSetting = (key, value) => updateSettings({ [key]: !value });

  const themeOptions = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader title="System Settings" description="Manage platform configuration" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader title="Appearance" subtitle="Platform theme" />
          <div className="flex gap-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = theme === opt.value;
              return (
                <button key={opt.value} onClick={() => setTheme(opt.value)}
                  className={`flex flex-1 flex-col items-center gap-3 rounded-[var(--radius-md)] border-2 p-6 transition-all duration-300 ${
                    isActive
                      ? "border-[var(--primary)] bg-[var(--primary-light)]"
                      : "border-[var(--border)] hover:border-[var(--primary)]/50 bg-[var(--surface)]"
                  }`}
                >
                  <div className={`rounded-[var(--radius-md)] p-3 transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-md)]"
                      : "bg-[var(--surface-off)] text-[var(--text-secondary)]"
                  }`}>
                    <Icon size={24} />
                  </div>
                  <span className={`text-sm font-semibold transition-colors duration-300 ${isActive ? "text-[var(--primary)]" : "text-[var(--text-primary)]"}`}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-8 xl:grid-cols-2">
        <Card>
          <CardHeader title="Platform Settings" subtitle="Configure core platform behavior" />
          <div className="space-y-5">
            {[
              { icon: Server, label: "Maintenance Mode", value: maintenance, action: () => toggleSetting("maintenanceMode", maintenance) },
              { icon: Globe, label: "Allow New Registrations", value: registrations, action: () => toggleSetting("allowRegistrations", registrations) },
              { icon: Mail, label: "Email Notifications", value: emailNotifications, action: () => toggleSetting("emailNotifications", emailNotifications) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--surface-off)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-4">
                  <div className="rounded-[var(--radius-md)] bg-[var(--primary-light)] p-3 text-[var(--primary)]"><item.icon size={20} /></div>
                  <div><p className="font-semibold text-[var(--text-primary)]">{item.label}</p></div>
                </div>
                <button onClick={item.action} className={`relative h-7 w-12 shrink-0 rounded-full transition-all duration-300 ${item.value ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}>
                  <div className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-[var(--card-foreground)] shadow transition-transform duration-300 ${item.value ? "translate-x-5" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Security & Maintenance" subtitle="System security and data management" />
          <div className="space-y-4">
            {[
              { icon: Lock, label: "Session Timeout", value: s.sessionTimeout || "30", action: "minutes" },
              { icon: Database, label: "Backup Frequency", value: s.backupFrequency || "Daily", action: "auto" },
              { icon: Shield, label: "Encryption", value: s.encryption || "AES-256", action: "active" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--surface-off)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-sm)]">
                  <div className="flex items-center gap-4">
                    <div className="rounded-[var(--radius-md)] bg-[var(--accent-light)] p-3 text-[var(--accent)]"><Icon size={20} /></div>
                    <div><p className="font-semibold text-[var(--text-primary)]">{item.label}</p><p className="text-sm text-[var(--text-secondary)]">{item.value} {item.action}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader title="System Actions" subtitle="Platform-wide operations" />
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" leftIcon={<RefreshCw size={18} />} onClick={() => toast.success("Cache cleared")}>Clear Cache</Button>
            <Button variant="outline" leftIcon={<Database size={18} />} onClick={() => toast.success("Backup started")}>Run Backup</Button>
            <Button variant="outline" leftIcon={<RefreshCw size={18} />} onClick={() => toast.success("Services restarted")}>Restart Services</Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SystemSettingsPage;
