import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, Shield, Moon, Sun, Monitor, Trash2, Download,
  Eye, EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/common/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useTheme } from "@/theme/useTheme";
import notificationService from "@/services/notification.service";
import { useApiMutation, useApiQuery } from "@/hooks/useQuery";
import authService from "@/services/auth.service";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);

  const { data: preferences } = useApiQuery({
    queryKey: ["doctor-notification-preferences"],
    queryFn: () => notificationService.getPreferences(),
  });

  const { mutate: updatePreferences } = useApiMutation({
    mutationFn: (payload) => notificationService.updatePreferences(payload),
    onSuccess: () => toast.success("Preferences updated"),
    successMessage: "Preferences updated",
  });

  const { mutate: deleteAccount, isPending: isDeleting } = useApiMutation({
    mutationFn: () => authService.deleteAccount(),
    onSuccess: () => { setShowDeleteConfirm(false); toast.success("Account deleted successfully"); },
    errorMessage: "Failed to delete account",
  });

  const notifPrefs = preferences?.preferences || preferences || {};

  const notificationCategories = [
    { key: "appointmentReminders", label: "Appointment Reminders", description: "Get notified about upcoming appointments" },
    { key: "newPatients", label: "New Patients", description: "When new patients are assigned to you" },
    { key: "reportUpdates", label: "Report Updates", description: "When patients upload new reports" },
    { key: "prescriptionRefills", label: "Prescription Refills", description: "Alerts for prescription renewals" },
    { key: "aiInsights", label: "AI Insights", description: "Personalized AI diagnostic insights" },
    { key: "hospitalUpdates", label: "Hospital Updates", description: "Administrative and hospital notifications" },
  ];

  const themeOptions = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <PageHeader title="Settings" description="Manage your doctor account preferences" />
      </motion.div>

      <div className="grid gap-8 xl:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader title="Appearance" subtitle="Customize your viewing experience" />
            <div className="flex gap-3">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = theme === opt.value;
                return (
                  <button key={opt.value} onClick={() => setTheme(opt.value)}
                    className={`flex flex-1 flex-col items-center gap-3 rounded-[var(--radius-lg)] border-2 p-6 transition-all duration-300 ${isActive ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-[var(--border)] hover:border-[var(--primary)]/50"}`}
                  >
                    <div className={`rounded-[var(--radius-md)] p-3 transition-all duration-300 ${isActive ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm" : "bg-[var(--surface-off)] text-[var(--text-secondary)]"}`}>
                      <Icon size={24} />
                    </div>
                    <span className={`text-sm font-semibold transition-all duration-300 ${isActive ? "text-[var(--primary)]" : "text-[var(--text-secondary)]"}`}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader title="Security" subtitle="Manage your account security" />
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-[var(--radius-lg)] bg-[var(--surface-off)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-4">
                  <div className="rounded-[var(--radius-md)] bg-[var(--accent)]/10 p-3 text-[var(--accent)]"><Shield size={20} /></div>
                  <div><p className="font-semibold text-[var(--text-primary)]">Two-Factor Authentication</p><p className="text-sm text-[var(--text-secondary)]">Add an extra layer of security</p></div>
                </div>
                <button onClick={() => setTwoFactor(!twoFactor)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-all duration-300 ${twoFactor ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}
                ><div className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-[var(--card-foreground)] shadow transition-transform duration-300 ${twoFactor ? "translate-x-5" : ""}`} /></button>
              </div>
              <div className="flex items-center justify-between rounded-[var(--radius-lg)] bg-[var(--surface-off)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-4">
                  <div className="rounded-[var(--radius-md)] bg-[var(--warning)]/10 p-3 text-[var(--warning)]">{showSensitive ? <Eye size={20} /> : <EyeOff size={20} />}</div>
                  <div><p className="font-semibold text-[var(--text-primary)]">Show Sensitive Data</p><p className="text-sm text-[var(--text-secondary)]">Display patient medical details</p></div>
                </div>
                <button onClick={() => setShowSensitive(!showSensitive)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-all duration-300 ${showSensitive ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}
                ><div className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-[var(--card-foreground)] shadow transition-transform duration-300 ${showSensitive ? "translate-x-5" : ""}`} /></button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader title="Notification Preferences" subtitle="Choose which notifications you receive" />
          <div className="space-y-3">
            {notificationCategories.map((cat) => {
              const isEnabled = notifPrefs[cat.key] !== false;
              return (
                <div key={cat.key} className="flex items-center justify-between rounded-[var(--radius-lg)] bg-[var(--surface-off)] p-4 transition-all duration-300 hover:shadow-[var(--shadow-sm)]">
                  <div className="flex items-center gap-4">
                    <div className="rounded-[var(--radius-md)] bg-[var(--primary)]/10 p-3 text-[var(--primary)]"><Bell size={20} /></div>
                    <div><p className="font-semibold text-[var(--text-primary)]">{cat.label}</p><p className="text-xs text-[var(--text-secondary)]">{cat.description}</p></div>
                  </div>
                  <button onClick={() => updatePreferences({ [cat.key]: !isEnabled })}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition-all duration-300 ${isEnabled ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}
                  ><div className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-[var(--card-foreground)] shadow transition-transform duration-300 ${isEnabled ? "translate-x-5" : ""}`} /></button>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card variant="outline" className="border-[var(--danger)]/30">
          <CardHeader title="Danger Zone" subtitle="Irreversible actions" />
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" leftIcon={<Download size={18} />}>Download My Data</Button>
            <Button variant="danger" leftIcon={<Trash2 size={18} />} onClick={() => setShowDeleteConfirm(true)}>Delete Account</Button>
          </div>
        </Card>
      </motion.div>

      <ConfirmDialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}
        onConfirm={deleteAccount}
        title="Delete Account?" description="This action is permanent and cannot be undone. All your data will be deleted."
        confirmText="Delete Forever" loading={isDeleting} />
    </motion.div>
  );
};

export default SettingsPage;
