
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
  TrendingUp,
  Shield,
} from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import useAppStore from "@/store/appStore";
import useFocusTrap from "@/hooks/useFocusTrap";
import authService from "@/services/auth.service";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const { mobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const focusTrapRef = useFocusTrap(mobileMenuOpen);
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  const menu = useMemo(() => {
    const role = user?.role || "patient";
    const isDoctor = role === "doctor";
    const isAdmin = role === "admin";
    const prefix = isDoctor ? "/doctor" : isAdmin ? "/admin" : "/patient";

    if (isAdmin) {
      return [
        {
          title: "MAIN",
          items: [
            { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
            { title: "Users", icon: Users, path: "/admin/users" },
            { title: "Doctors", icon: Stethoscope, path: "/admin/doctors" },
            { title: "Patients", icon: UserRound, path: "/admin/patients" },
            { title: "Appointments", icon: CalendarDays, path: "/admin/appointments" },
          ],
        },
        {
          title: "MONITORING",
          items: [
            { title: "Reports", icon: FileHeart, path: "/admin/reports" },
            { title: "Prescriptions", icon: ClipboardList, path: "/admin/prescriptions" },
            { title: "Analytics", icon: TrendingUp, path: "/admin/analytics" },
          ],
        },
        {
          title: "SYSTEM",
          items: [
            { title: "Notifications", icon: Bell, path: "/admin/notifications" },
            { title: "Settings", icon: Settings, path: "/admin/settings" },
          ],
        },
      ];
    }

    return [
      {
        title: "MAIN",
        items: [
          { title: "Dashboard", icon: LayoutDashboard, path: `${prefix}/dashboard` },
          { title: "Appointments", icon: CalendarDays, path: `${prefix}/appointments` },
          ...(!isDoctor ? [{ title: "Doctors", icon: Stethoscope, path: `${prefix}/doctors` }] : []),
          { title: isDoctor ? "Patients" : "My Patients", icon: Users, path: `${prefix}/patients` },
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
          // { title: "Help Center", icon: HelpCircle, path: "/help" },
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
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <motion.aside
        ref={focusTrapRef}
        animate={{
          width: collapsed ? 78 : 280,
          x: mobileMenuOpen ? 0 : -300,
        }}
        transition={{
          duration: 0.28,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`
          fixed left-0 top-0 z-50
          flex h-screen flex-col
          overflow-hidden
          border-r border-[var(--border)]
          bg-[var(--sidebar)]
          shadow-[0_8px_40px_rgba(15,23,42,.08)]
          lg:static
        `}
      >
        {/* Logo */}

        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-5">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 8 }}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-2xl
                bg-[var(--primary)]
                text-white
                shadow-[0_8px_24px_rgba(37,99,235,.18)]
              "
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
                  <h2 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
                    MediSync AI
                  </h2>

                  <p className="text-xs text-[var(--muted-foreground)]">
                    Smart Healthcare
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight size={15} />
            ) : (
              <ChevronLeft size={15} />
            )}
          </Button>
        </div>

        {/* User Card */}

        <div className="px-4 py-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3">
            <div className="flex items-center gap-3">
              <Avatar
                src={user?.avatar?.url}
                name={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || ""}
                size="md"
              />

              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate font-semibold text-[var(--foreground)]">
                      {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || "User"}
                    </p>

                    <p className="capitalize text-xs text-[var(--muted-foreground)]">
                      {user?.role}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
                {/* Navigation */}

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {menu.map((section) => (
            <div key={section.title} className="mb-6">
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]"
                  >
                    {section.title}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    location.pathname === item.path;

                  return (
                    <div
                      key={item.path}
                      className="relative"
                      onMouseEnter={() =>
                        setHovered(item.path)
                      }
                      onMouseLeave={() =>
                        setHovered(null)
                      }
                    >
                      <NavLink
                        to={item.path}
                        className={`
                          group
                          flex items-center gap-3
                          rounded-2xl
                          px-3 py-3
                          transition-all duration-200

                          ${
                            active
                              ? `
                                  border border-[var(--primary)]/10
                                  bg-[var(--primary)]/8
                                  text-[var(--primary)]
                                  shadow-[0_6px_20px_rgba(37,99,235,.08)]
                                `
                              : `
                                  text-[var(--muted-foreground)]
                                  hover:bg-[var(--secondary)]
                                  hover:text-[var(--foreground)]
                                `
                          }
                        `}
                      >
                        <Icon
                          size={19}
                          className="shrink-0"
                        />

                        <AnimatePresence>
                          {!collapsed && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                x: -6,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                              }}
                              exit={{
                                opacity: 0,
                                x: -6,
                              }}
                              className="flex flex-1 items-center justify-between"
                            >
                              <span className="truncate text-sm font-medium">
                                {item.title}
                              </span>

                              {item.badge &&
                                (typeof item.badge ===
                                "number" ? (
                                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--danger)] px-1.5 text-[10px] font-bold text-white">
                                    {item.badge}
                                  </span>
                                ) : (
                                  <Badge
                                    variant="primary"
                                    size="xs"
                                  >
                                    {item.badge}
                                  </Badge>
                                ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </NavLink>

                      {collapsed &&
                        hovered === item.path && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              x: -6,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            exit={{
                              opacity: 0,
                              x: -6,
                            }}
                            className="absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 rounded-xl bg-[var(--foreground)] px-3 py-2 text-xs font-medium whitespace-nowrap text-[var(--background)] shadow-xl"
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
                {/* Bottom Section */}

        <div className="border-t border-[var(--border)] p-4">
          <div className="space-y-3">
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-[0_8px_20px_rgba(37,99,235,.18)]">
                      <Hospital size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        Premium AI
                      </p>

                      <p className="text-xs text-[var(--muted-foreground)]">
                        Healthcare Suite
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="ghost"
              onClick={async () => {
                try {
                  await authService.logout();
                } catch {
                  // proceed with client-side logout
                }
                logout();
              }}
              fullWidth={!collapsed}
              className={`
                justify-start
                rounded-2xl
                text-[var(--muted-foreground)]
                hover:bg-[var(--danger)]/8
                hover:text-[var(--danger)]
                ${collapsed ? "px-0" : ""}
              `}
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
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;




