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

const typeFilters = ["All", "appointment", "prescription", "report", "message", "reminder"];

const NotificationsPage = () => {
  const [typeFilter, setTypeFilter] = useState("All");
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({ type: typeFilter !== "All" ? typeFilter : undefined, page, limit }), [typeFilter, page, limit]);

  const { data, isLoading, refetch } = useApiQuery({
    queryKey: ["doctor-notifications", params],
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <PageHeader
        title="Notifications"
        description={`${unreadCount} unread`}
        actions={unreadCount > 0 ? <Button variant="secondary" leftIcon={<CheckCheck size={18} />} onClick={markAllRead} loading={isMarkingAll}>Mark All Read</Button> : undefined}
      />

      <Card paddingSize="lg">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-[var(--text-secondary)]">Filter:</span>
          {typeFilters.map((f) => (
            <button key={f} onClick={() => { setTypeFilter(f); setPage(1); }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${typeFilter === f ? "bg-[var(--primary)] text-white shadow-sm" : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"}`}
            >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </Card>

      {isLoading ? <SectionLoader /> : notifications.length === 0 ? (
        <EmptyState title="No notifications" description={typeFilter !== "All" ? "No notifications of this type" : "You're all caught up!"} icon={Bell} />
      ) : (
        <>
          <div className="space-y-2">
            {notifications.map((notif, i) => {
              const Icon = notificationIcons[notif.type] || Bell;
              return (
                <motion.div key={notif._id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`group flex items-start gap-4 rounded-[var(--radius-lg)] border p-5 transition-all duration-300 hover:shadow-[var(--shadow-md)] ${
                    notif.read ? "border-[var(--border)] bg-[var(--surface)]" : "border-[var(--primary)]/20 bg-[var(--primary)]/5"
                  }`}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-all duration-300 ${notif.read ? "bg-[var(--surface-off)] text-[var(--text-muted)]" : "bg-[var(--primary)]/10 text-[var(--primary)]"}`}>
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
                    {!notif.read && <Button variant="ghost" size="icon" onClick={() => markRead(notif._id)} className="transition-all duration-300 hover:bg-[var(--primary)]/10"><CheckCheck size={16} className="text-[var(--primary)]" /></Button>}
                    <Button variant="ghost" size="icon" onClick={() => deleteNotification(notif._id)} className="transition-all duration-300 hover:bg-[var(--danger)]/10"><Trash2 size={16} className="text-[var(--text-muted)] transition-colors duration-300 hover:text-[var(--danger)]" /></Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </>
      )}
    </motion.div>
  );
};

export default NotificationsPage;
