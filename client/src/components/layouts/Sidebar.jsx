import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserRound,
  BrainCircuit,
  FileHeart,
  Bell,
  ClipboardList,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HeartPulse,
  Hospital,
  Stethoscope,
  Pill,
  Activity,
  Lightbulb,
  FileText,
} from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import useAppStore from "@/store/appStore";
import useFocusTrap from "@/hooks/useFocusTrap";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const { mobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const focusTrapRef = useFocusTrap(mobileMenuOpen);
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  const menu = useMemo(() => {
    const isDoctor = user?.role === "doctor";
    const prefix = isDoctor ? "/doctor" : "/patient";

    return [
      {
        title: "MAIN",
        items: [
          { title: "Dashboard", icon: LayoutDashboard, path: `${prefix}/dashboard` },
          { title: "Appointments", icon: CalendarDays, path: `${prefix}/appointments` },
          ...(!isDoctor ? [{ title: "Doctors", icon: Stethoscope, path: `${prefix}/doctors` }] : []),
          { title: "Patients", icon: Users, path: `${prefix}/patients` },
        ],
      },
      {
        title: "HEALTHCARE",
        items: [
          { title: isDoctor ? "Reports" : "Medical Records", icon: FileHeart, path: `${prefix}/reports` },
          { title: "Prescriptions", icon: ClipboardList, path: `${prefix}/prescriptions` },
          { title: isDoctor ? "AI Analysis" : "AI Assistant", icon: BrainCircuit, path: isDoctor ? `${prefix}/ai-analysis` : `${prefix}/ai-assistant`, badge: "AI" },
        ],
      },
      {
        title: "AI TOOLS",
        items: [
          { title: "Symptom Checker", icon: Stethoscope, path: `${prefix}/ai/symptom-checker` },
          { title: "Medicine Info", icon: Pill, path: `${prefix}/ai/medicine-info` },
          { title: isDoctor ? "Health Tips" : "Health Score", icon: Activity, path: isDoctor ? `${prefix}/ai/health-tips` : `${prefix}/ai/health-score` },
          ...(!isDoctor ? [{ title: "Health Tips", icon: Lightbulb, path: `${prefix}/ai/health-tips` }] : []),
          ...(!isDoctor ? [{ title: "Report Summary", icon: FileText, path: `${prefix}/ai/report-summary` }] : []),
        ],
      },
      {
        title: "SYSTEM",
        items: [
          { title: "Notifications", icon: Bell, path: `${prefix}/notifications` },
          { title: "Profile", icon: UserRound, path: `${prefix}/profile` },
          { title: "Settings", icon: Settings, path: `${prefix}/settings` },
          { title: "Help Center", icon: HelpCircle, path: "/help" },
        ],
      },
    ];
  }, [user?.role]);

  return (
    <>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <motion.aside
        ref={focusTrapRef}
        animate={{
          width: collapsed ? 72 : 260,
          x: mobileMenuOpen ? 0 : -280,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Main navigation"
        className="fixed left-0 top-0 z-40 flex h-screen flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--sidebar)] shadow-[0_20px_50px_rgba(15,23,42,0.08)] lg:static"
      >
        {/* Logo */}
        <div className="relative flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
          <motion.div layout className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-white shadow-[var(--shadow-md)]"
            >
              <HeartPulse size={18} />
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                >
                  <h2 className="text-sm font-bold tracking-tight text-[var(--foreground)] leading-tight">
                    MediSync
                  </h2>
                  <p className="text-[10px] text-[var(--muted-foreground)] leading-tight">
                    AI Healthcare
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-7 w-7 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </Button>
        </div>

        {/* User */}
        <div className="px-3 py-3">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl border border-[var(--border)]/70 bg-[var(--surface-off)]/70 p-2.5"
          >
            <div className="flex items-center gap-2.5">
              <Avatar src={user?.avatar} name={user?.name} size="sm" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate text-sm font-medium text-[var(--foreground)] leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-[11px] capitalize text-[var(--muted-foreground)] leading-tight">
                      {user?.role}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
          {menu.map((section) => (
            <div key={section.title}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-1.5 px-3 text-[10px] font-semibold tracking-widest text-[var(--muted-foreground)]"
                  >
                    {section.title}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;

                  return (
                    <div
                      key={item.path}
                      className="relative"
                      onMouseEnter={() => setHovered(item.path)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <NavLink
                        to={item.path}
                        className={`relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                          active
                            ? "bg-[var(--primary)]/10 text-[var(--primary)] shadow-[0_8px_20px_rgba(37,99,235,0.08)]"
                            : "text-[var(--muted-foreground)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        <Icon size={18} className="shrink-0" />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.div
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -6 }}
                              className="flex flex-1 items-center justify-between"
                            >
                              <span>{item.title}</span>
                              {item.badge &&
                                (typeof item.badge === "number" ? (
                                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--danger)] px-1.5 text-[10px] font-bold text-white">
                                    {item.badge}
                                  </span>
                                ) : (
                                  <Badge variant="primary" size="xs">
                                    {item.badge}
                                  </Badge>
                                ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </NavLink>

                      {collapsed && hovered === item.path && (
                        <motion.div
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[var(--foreground)] px-2.5 py-1.5 text-xs font-medium text-[var(--background)] shadow-lg ring-1 ring-[var(--border)]"
                        >
                          {item.title}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[var(--border)] p-3 space-y-2">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-2xl bg-gradient-to-br from-[var(--primary)]/95 to-[var(--accent)]/90 p-3 text-white shadow-[var(--shadow-md)]"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <Hospital size={16} />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-xs font-semibold">Premium</p>
                    <p className="text-[10px] text-white/70">AI Health Suite</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <Button
            fullWidth={!collapsed}
            variant="ghost"
            className={`justify-start text-[var(--muted-foreground)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] ${collapsed ? "px-0" : ""}`}
            onClick={logout}
          >
            <LogOut size={18} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
