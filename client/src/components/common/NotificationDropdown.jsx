import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, CalendarDays, FileText, Pill, Info, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/utils/cn";
import notificationService from "@/services/notification.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import useAuth from "@/hooks/useAuth";

const typeIcons = {
  appointment: CalendarDays,
  report: FileText,
  prescription: Pill,
  system: Info,
  chat: Info,
};

const typeColors = {
  appointment: "text-[var(--primary)] bg-[var(--primary)]/10",
  report: "text-[var(--warning)] bg-[var(--warning)]/10",
  prescription: "text-[var(--success)] bg-[var(--success)]/10",
  system: "text-[var(--muted-foreground)] bg-[var(--muted)]",
  chat: "text-[var(--info)] bg-[var(--info)]/10",
};

const NotificationDropdown = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = useCallback((e) => {
    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  const { data, refetch } = useApiQuery({
    queryKey: ["notification-dropdown"],
    queryFn: () => notificationService.getNotifications({ limit: 5, page: 1 }),
    refetchInterval: 30000,
  });

  const { data: unreadData, refetch: refetchUnread } = useApiQuery({
    queryKey: ["notification-count"],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30000,
  });

  const { mutate: markRead } = useApiMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => { refetch(); refetchUnread(); },
  });

  const { mutate: markAllRead } = useApiMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => { refetch(); refetchUnread(); },
  });

  const notifications = data?.notifications || data?.data || [];
  const unreadCount = unreadData?.count || unreadData?.data?.count || 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition-all duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-bold leading-none text-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-80 origin-top-right overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-lg)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <span className="text-sm font-bold text-[var(--foreground)]">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead()}
                  className="flex items-center gap-1 text-xs font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary)]/80"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                  <Bell size={24} className="text-[var(--muted-foreground)]" />
                  <p className="text-sm text-[var(--muted-foreground)]">No new notifications</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const Icon = typeIcons[notif.type] || Info;
                  return (
                    <button
                      key={notif._id}
                      onClick={() => {
                        if (!notif.read && !notif.isRead) markRead(notif._id);
                      }}
                      className={cn(
                        "flex w-full items-start gap-3 border-b border-[var(--border)] px-4 py-3 text-left transition-colors last:border-0 hover:bg-[var(--secondary)]",
                        (!notif.read && !notif.isRead) ? "bg-[var(--primary)]/5" : ""
                      )}
                    >
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", typeColors[notif.type] || typeColors.system)}>
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm leading-tight", !notif.read && !notif.isRead ? "font-semibold text-[var(--foreground)]" : "text-[var(--foreground)]")}>
                          {notif.title}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)] line-clamp-2">{notif.message}</p>
                        <p className="mt-1 text-[11px] text-[var(--muted-foreground)]">
                          {new Date(notif.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                        </p>
                      </div>
                      {(!notif.read && !notif.isRead) && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <Link
              to={`/${user?.role}/notifications`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 border-t border-[var(--border)] px-4 py-3 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[var(--secondary)]"
            >
              View all notifications <ExternalLink size={12} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
