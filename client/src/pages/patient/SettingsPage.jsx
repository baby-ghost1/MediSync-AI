import { useState } from "react";
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

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);

  const { data: preferences } = useApiQuery({
    queryKey: ["notification-preferences"],
    queryFn: () => notificationService.getPreferences(),
  });

  const { mutate: deleteAccount, isPending: isDeleting } = useApiMutation({
    mutationFn: () => authService.deleteAccount(),
    onSuccess: () => { setShowDeleteConfirm(false); toast.success("Account deleted successfully"); },
    errorMessage: "Failed to delete account",
  });

  const { mutate: updatePreferences } = useApiMutation({
    mutationFn: (payload) => notificationService.updatePreferences(payload),
    onSuccess: () => toast.success("Preferences updated"),
    successMessage: "Preferences updated",
  });

  const notifPrefs = preferences?.preferences || preferences || {};

  const notificationCategories = [
    { key: "appointmentReminders", label: "Appointment Reminders", description: "Get notified about upcoming appointments" },
    { key: "prescriptionRefills", label: "Prescription Refills", description: "Alerts when prescriptions are due for refill" },
    { key: "reportUpdates", label: "Report Updates", description: "When new medical reports are available" },
    { key: "healthTips", label: "Health Tips", description: "Daily health tips and wellness advice" },
    { key: "aiInsights", label: "AI Insights", description: "Personalized health insights from AI analysis" },
    { key: "promotional", label: "Promotional", description: "Updates about new features and offers" },
  ];

  const themeOptions = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Manage your account preferences" />

      <Card paddingSize="lg" className="overflow-hidden border-0 bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-white shadow-[var(--shadow-lg)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">Personal preferences</p>
            <h2 className="mt-2 text-xl font-semibold">Fine-tune your experience and privacy settings</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/75">Adjust notifications, appearance and account security in one place.</p>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-white/15 px-4 py-3 backdrop-blur-xl">
            <p className="text-sm font-semibold">Secure and personalized</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-8 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Appearance"
            subtitle="Customize your viewing experience"
          />
          <div className="flex gap-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isActive = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={`flex flex-1 flex-col items-center gap-3 rounded-[var(--radius-lg)] border-2 p-6 transition-all duration-300 ${
                    isActive
                      ? "border-[var(--primary)] bg-[var(--primary-light)]"
                      : "border-[var(--border)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  <div className={`rounded-xl p-3 ${isActive ? "bg-[var(--primary)] text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"}`}>
                    <Icon size={24} />
                  </div>
                  <span className={`text-sm font-semibold ${isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Security"
            subtitle="Manage your account security"
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-[var(--radius-lg)] bg-[var(--secondary)] p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[var(--accent-light)] p-3 text-[var(--accent)]">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Two-Factor Authentication</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Add an extra layer of security</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className={`relative h-7 w-12 rounded-full transition-all duration-300 ${
                  twoFactor ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                }`}
              >
                <div
                  className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-[var(--shadow-sm)] transition-transform duration-300 ${
                    twoFactor ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-[var(--radius-lg)] bg-[var(--secondary)] p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[var(--warning-light)] p-3 text-[var(--warning)]">
                  {showSensitive ? <Eye size={20} /> : <EyeOff size={20} />}
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Show Sensitive Data</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Display medical details on dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setShowSensitive(!showSensitive)}
                className={`relative h-7 w-12 rounded-full transition-all duration-300 ${
                  showSensitive ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                }`}
              >
                <div
                  className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-[var(--shadow-sm)] transition-transform duration-300 ${
                    showSensitive ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Notification Preferences"
          subtitle="Choose which notifications you receive"
        />
        <div className="space-y-3">
          {notificationCategories.map((cat) => {
            const isEnabled = notifPrefs[cat.key] !== false;
            return (
              <div
                key={cat.key}
                className="flex items-center justify-between rounded-[var(--radius-lg)] bg-[var(--secondary)] p-4 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-[var(--primary-light)] p-3 text-[var(--primary)]">
                    <Bell size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">{cat.label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{cat.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreferences({ [cat.key]: !isEnabled })}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-all duration-300 ${
                    isEnabled ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                  }`}
                >
                  <div
                    className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-[var(--shadow-sm)] transition-transform duration-300 ${
                      isEnabled ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card variant="outline" className="border-[var(--danger)]/30">
        <CardHeader
          title="Danger Zone"
          subtitle="Irreversible actions"
        />
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" leftIcon={<Download size={18} />}>
            Download My Data
          </Button>
          <Button variant="danger" leftIcon={<Trash2 size={18} />} onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={deleteAccount}
        title="Delete Account?"
        description="This action is permanent and cannot be undone. All your data will be deleted."
        confirmText="Delete Forever"
        loading={isDeleting}
      />
    </div>
  );
};

export default SettingsPage;
