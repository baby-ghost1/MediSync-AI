import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bell, CheckCheck, Trash2, MessageSquare, FileText, Pill, Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination";
import SectionLoader from "@/components/common/SectionLoader";
import EmptyState from "@/components/ui/EmptyState";
import notificationService from "@/services/notification.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import { usePagination } from "@/hooks/usePagination";

const notificationIcons = {
  appointment: Calendar, prescription: Pill, report: FileText, message: MessageSquare, reminder: Bell, general: Bell,
};

const typeFilters = ["All", "appointment", "prescription", "report", "message", "reminder", "system"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

const NotificationsPage = () => {
  const [typeFilter, setTypeFilter] = useState("All");
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({ type: typeFilter !== "All" ? typeFilter : undefined, page, limit }), [typeFilter, page, limit]);

  const { data, isLoading, refetch } = useApiQuery({
    queryKey: ["admin-notifications", params],
    queryFn: () => notificationService.getNotifications(params),
  });

  const { mutate: markRead } = useApiMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => refetch(),
  });

  const { mutate: markAllRead, isPending: isMarkingAll } = useApiMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => { refetch(); toast.success("All marked as read"); },
  });

  const { mutate: deleteNotification } = useApiMutation({
    mutationFn: (id) => notificationService.deleteNotification(id),
    onSuccess: () => refetch(),
  });

  const notifications = data?.notifications || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || notifications.length;
  const unreadCount = data?.unreadCount || 0;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="System Notifications"
          description={`${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
          actions={unreadCount > 0 ? <Button variant="secondary" leftIcon={<CheckCheck size={18} />} onClick={markAllRead} loading={isMarkingAll}>Mark All Read</Button> : undefined}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card paddingSize="lg">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Filter:</span>
            {typeFilters.map((f) => (
              <button key={f} onClick={() => { setTypeFilter(f); setPage(1); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                  typeFilter === f
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                    : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] bg-[var(--surface)]"
                }`}
              >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
            ))}
          </div>
        </Card>
      </motion.div>

      {isLoading ? <SectionLoader /> : notifications.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyState title="No notifications" description={typeFilter !== "All" ? "No notifications of this type" : "All clear!"} icon={Bell} />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="space-y-2">
            {notifications.map((notif, i) => {
              const Icon = notificationIcons[notif.type] || Bell;
              return (
                <motion.div key={notif._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className={`group flex items-start gap-4 rounded-[var(--radius-md)] border p-5 transition-all duration-300 hover:shadow-[var(--shadow-md)] ${
                    notif.read
                      ? "border-[var(--border)] bg-[var(--surface)]"
                      : "border-[var(--primary)]/20 bg-[var(--primary-light)]"
                  }`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-all duration-300 ${
                    notif.read
                      ? "bg-[var(--surface-off)] text-[var(--text-secondary)]"
                      : "bg-[var(--primary)]/10 text-[var(--primary)]"
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className={`text-sm ${notif.read ? "font-medium text-[var(--text-primary)]" : "font-bold text-[var(--text-primary)]"}`}>{notif.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{notif.message}</p>
                      </div>
                      <span className="shrink-0 text-xs text-[var(--text-muted)]">{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {!notif.read && <Button variant="ghost" size="icon" onClick={() => markRead(notif._id)}><CheckCheck size={16} className="text-[var(--primary)]" /></Button>}
                    <Button variant="ghost" size="icon" onClick={() => deleteNotification(notif._id)}><Trash2 size={16} className="text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--danger)]" /></Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default NotificationsPage;
