import { useState, useEffect, useMemo } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import {
  Bell,
  Menu,
  Search,
  X,
  Command,
  MessageSquareMore,
  ChevronDown,
  Home,
  Users,
  CalendarDays,
  FileHeart,
  BrainCircuit,
  Stethoscope,
  User,
  Settings,
} from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import ThemeToggle from "@/components/ui/ThemeToggle";

import { useAuth } from "@/hooks/useAuth";
import SocketStatus from "@/components/common/SocketStatus";
import useAppStore from "@/store/appStore";
import authService from "@/services/auth.service";
import notificationService from "@/services/notification.service";
import ROUTES from "@/routes/routeConstants";
import { useApiQuery } from "@/hooks/useQuery";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();

  const [search, setSearch] = useState("");

  const [showSearch, setShowSearch] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const { mobileMenuOpen, setMobileMenuOpen } =
    useAppStore();

  useEffect(() => {
    const handleScroll = () =>
      setScrolled(window.scrollY > 8);

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        setShowSearch(true);
      }

      if (e.key === "Escape") {
        setShowSearch(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [setMobileMenuOpen]);

  // Navigation items for mobile drawer (role-aware)
  const navigation = useMemo(() => {
    const role = user?.role || "patient";
    const prefix = role === "doctor" ? "/doctor" : role === "admin" ? "/admin" : "/patient";

    const items = [
      {
        title: "Dashboard",
        path: `${prefix}/dashboard`,
        icon: Home,
      },
    ];

    if (role === "admin") {
      items.push(
        { title: "Users", path: "/admin/users", icon: Users },
        { title: "Doctors", path: "/admin/doctors", icon: Stethoscope },
        { title: "Patients", path: "/admin/patients", icon: Users },
        { title: "Appointments", path: "/admin/appointments", icon: CalendarDays },
        { title: "Reports", path: "/admin/reports", icon: FileHeart },
        { title: "Analytics", path: "/admin/analytics", icon: BrainCircuit }
      );
    } else {
      items.push(
        { title: "Appointments", path: `${prefix}/appointments`, icon: CalendarDays },
        { title: role === "doctor" ? "Patients" : "Doctors", path: role === "doctor" ? `${prefix}/patients` : `${prefix}/doctors`, icon: Users },
        { title: role === "doctor" ? "Reports" : "Medical Records", path: `${prefix}/reports`, icon: FileHeart },
        { title: role === "doctor" ? "AI Analysis" : "AI Assistant", path: role === "doctor" ? `${prefix}/ai-analysis` : `${prefix}/ai-assistant`, icon: BrainCircuit }
      );
    }

    return items;
  }, [user?.role]);

  // Get profile and settings routes based on user role
  const getProfileRoute = () => {
    if (!user?.role) return ROUTES.LOGIN;
    const roleKey = user.role.toUpperCase();
    const profileRoute = ROUTES[roleKey]?.PROFILE;
    // If profile doesn't exist (e.g., for admin), use settings instead
    return profileRoute || ROUTES[roleKey]?.SETTINGS || ROUTES.LOGIN;
  };

  const getSettingsRoute = () => {
    if (!user?.role) return ROUTES.LOGIN;
    const roleKey = user.role.toUpperCase();
    return ROUTES[roleKey]?.SETTINGS || ROUTES.LOGIN;
  };

  const { data: unreadCount } = useApiQuery({
    queryKey: ["notification-count"],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const notificationCount = unreadCount?.data?.unread || unreadCount?.unread || 0;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // proceed with client-side logout even if API fails
    }
    logout(true);
  };

  // Compute user full name from firstName and lastName
  const userFullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.name || "Guest";

  const userRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Patient";

  const profileItems = [
    {
      label: "Profile",
      icon: User,
      onClick: () => {
        navigate(getProfileRoute());
        setMobileMenuOpen(false);
      },
    },
    {
      label: "Settings",
      icon: Settings,
      onClick: () => {
        navigate(getSettingsRoute());
        setMobileMenuOpen(false);
      },
    },
    {
      divider: true,
    },
    {
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -70 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.28,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`fixed inset-x-0 top-1 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "border-[var(--border)] bg-[var(--navbar)]/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(15,23,42,.06)]"
            : "border-transparent bg-[var(--navbar)]/75 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left */}

          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9"
              onClick={() =>
                setMobileMenuOpen(true)
              }
            >
              <Menu size={25} />
            </Button>

           

            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_10px_24px_rgba(37,99,235,.18)]">
                <Stethoscope size={17} />
              </div>

              <div className="hidden md:block">
                <h2 className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
                  MediSync AI
                </h2>

                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Healthcare Platform
                </p>
              </div>
            </Link>
          </div>


           {/* 
           <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9"
              onClick={() => navigate(`/`)}
            >
              <Home size={20} />
            </Button>
            */}

            
             {/* Search */}
          <div className="hidden w-full max-w-2xl px-8 lg:block">
            <div className="relative">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctors, patients, appointments, reports..."
                leftIcon={<Search size={16} />}
                className="bg-[var(--card)]"
              />

              <div
                className="
                  pointer-events-none
                  absolute right-3 top-1/2
                  flex -translate-y-1/2 items-center gap-1
                  rounded-lg
                  border border-[var(--border)]
                  bg-[var(--secondary)]
                  px-2 py-1
                  text-[10px]
                  font-medium
                  text-[var(--muted-foreground)]
                "
              >
                <Command size={11} />
                K
              </div>
            </div>
          </div>

          {/* Right */}

          <div className="flex items-center gap-1">

            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 lg:hidden"
                  onClick={() => setShowSearch(true)}
                >
                  <Search size={18} />
                </Button>

                <SocketStatus />

                <ThemeToggle />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                >
                  <MessageSquareMore size={18} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-9 w-9"
                  onClick={() => navigate(`/${user?.role}/notifications`)}
                >
                  <Bell size={18} />

                  {notificationCount > 0 && (
                    <span
                      className="
                        absolute -right-1 -top-1
                        flex h-5 min-w-[20px] items-center justify-center
                        rounded-full
                        bg-[var(--danger)]
                        px-1
                        text-[10px]
                        font-bold
                        text-[var(--primary-foreground)]
                        ring-2
                        ring-[var(--navbar)]
                      "
                    >
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </Button>

                <Dropdown
                  trigger={
                    <button
                      className="
                        ml-2
                        flex items-center gap-2
                        rounded-2xl
                        border border-transparent
                        px-2 py-1.5
                        transition-all duration-200
                        hover:border-[var(--border)]
                        hover:bg-[var(--secondary)]
                      "
                    >
                      <Avatar
                        src={user?.avatar?.url}
                        name={userFullName}
                        size="xs"
                      />

                      <div className="hidden text-left lg:block">
                        <p className="text-xs font-semibold text-[var(--foreground)]">
                          {userFullName}
                        </p>

                        <p className="text-[10px] capitalize text-[var(--muted-foreground)]">
                          {userRole}
                        </p>
                      </div>

                      <ChevronDown
                        size={15}
                        className="hidden text-[var(--muted-foreground)] lg:block"
                      />
                    </button>
                  }
                  items={profileItems}
                />
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="gradient" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile Search */}

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed inset-0 z-[70]
              bg-[var(--foreground)]/40
              backdrop-blur-sm
              p-4
              lg:hidden
            "
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                rounded-3xl
                border border-[var(--border)]
                bg-[var(--card)]
                p-5
                shadow-[0_20px_60px_rgba(15,23,42,.12)]
              "
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  Search
                </h3>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setShowSearch(false)}
                >
                  <X size={18} />
                </Button>
              </div>

              <Input
                autoFocus
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                leftIcon={<Search size={16} />}
                placeholder="Search..."
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
            {/* Mobile Drawer */}

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-[var(--foreground)]/40 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 30,
              }}
              className="
                fixed left-0 top-0 z-[61]
                flex h-screen w-[290px] flex-col
                border-r border-[var(--border)]
                bg-[var(--card)]
                shadow-[0_20px_60px_rgba(15,23,42,.14)]
              "
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_10px_24px_rgba(37,99,235,.18)]">
                    <Stethoscope size={17} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-[var(--foreground)]">
                      MediSync AI
                    </h2>

                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      Healthcare Platform
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={18} />
                </Button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  const active =
                    location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() =>
                        setMobileMenuOpen(false)
                      }
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/10"
                          : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <Icon size={18} />
                      {item.title}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="border-t border-[var(--border)] p-4">
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3">
                  <Avatar
                    src={user?.avatar?.url || user?.avatar}
                    name={userFullName}
                    size="sm"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                      {userFullName}
                    </p>

                    <p className="text-xs capitalize text-[var(--muted-foreground)]">
                      {userRole}
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
