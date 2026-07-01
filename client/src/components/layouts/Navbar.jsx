import { useState, useEffect, useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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
} from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import ThemeToggle from "@/components/ui/ThemeToggle";

import { useAuth } from "@/hooks/useAuth";
import SocketStatus from "@/components/common/SocketStatus";
import useAppStore from "@/store/appStore";

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const { mobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setMobileMenuOpen]);

  const navigation = useMemo(
    () => [
      { title: "Dashboard", path: "/patient/dashboard", icon: Home },
      { title: "Doctors", path: "/doctors", icon: Users },
      { title: "Appointments", path: "/appointments", icon: CalendarDays },
      { title: "Medical Records", path: "/records", icon: FileHeart },
      { title: "AI Assistant", path: "/assistant", icon: BrainCircuit },
    ],
    []
  );

  const profileItems = [
    { label: "Profile", onClick: () => {} },
    { label: "Settings", onClick: () => {} },
    { divider: true },
    { label: "Logout", onClick: logout },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-200 ${
          scrolled
            ? "bg-[var(--navbar)] backdrop-blur-xl border-[var(--navbar-border)] shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            : "bg-[var(--navbar)] backdrop-blur-xl border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden h-8 w-8"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={18} />
            </Button>

            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-white shadow-[var(--shadow-md)]">
                <Stethoscope size={16} />
              </div>
              <div className="hidden md:block">
                <h2 className="text-sm font-bold text-[var(--foreground)] leading-tight">
                  MediSync AI
                </h2>
                <p className="text-[10px] text-[var(--muted-foreground)] leading-tight">
                  Healthcare Platform
                </p>
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden lg:block w-full max-w-xl px-8">
            <div className="relative">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctors, patients, appointments..."
                leftIcon={<Search size={15} />}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)] pointer-events-none">
                <Command size={11} strokeWidth={1.5} />K
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-0.5">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowSearch(true)}
              className="lg:hidden h-8 w-8"
            >
              <Search size={18} />
            </Button>

            <SocketStatus />
            <ThemeToggle />

            <Button size="icon" variant="ghost" className="h-8 w-8">
              <MessageSquareMore size={18} />
            </Button>

            <Button size="icon" variant="ghost" className="relative h-8 w-8">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--danger)] ring-2 ring-[var(--navbar)]" />
            </Button>

            <Dropdown
              trigger={
                <button className="ml-1 flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-[var(--surface-hover)]">
                  <Avatar name={user?.name} src={user?.avatar} size="xs" />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-medium text-[var(--foreground)] leading-tight">
                      {user?.name || "Guest"}
                    </p>
                    <p className="text-[10px] capitalize text-[var(--muted-foreground)] leading-tight">
                      {user?.role || "Patient"}
                    </p>
                  </div>
                  <ChevronDown size={14} className="hidden lg:block text-[var(--muted-foreground)]" />
                </button>
              }
              items={profileItems}
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:block border-t border-[var(--border)]/80">
          <div className="mx-auto flex h-11 items-center gap-5 px-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1.5 py-2 text-xs font-medium transition-colors duration-150 ${
                      isActive
                        ? "text-[var(--primary)]"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                      {item.title}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            layoutId="navbar-indicator"
                            className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[var(--primary)]"
                          />
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </NavLink>
              );
            })}
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
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm p-4 lg:hidden"
          >
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl bg-[var(--card)] p-4 shadow-[var(--shadow-2xl)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  Search
                </h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowSearch(false)}
                  className="h-7 w-7"
                >
                  <X size={18} />
                </Button>
              </div>
              <Input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              transition={{ duration: 0.15 }}
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
              className="fixed left-0 top-0 z-[61] flex h-screen w-72 flex-col bg-[var(--card)] shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-white">
                    <Stethoscope size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[var(--foreground)]">
                      MediSync AI
                    </h2>
                    <p className="text-[10px] text-[var(--muted-foreground)]">
                      Healthcare
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-7 w-7"
                >
                  <X size={18} />
                </Button>
              </div>

              <nav className="flex-1 space-y-1 p-3">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                        active
                          ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                          : "text-[var(--muted-foreground)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      <Icon size={18} />
                      {item.title}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="border-t border-[var(--border)] p-4">
                <div className="flex items-center gap-2.5">
                  <Avatar name={user?.name} src={user?.avatar} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--foreground)]">
                      {user?.name}
                    </p>
                    <p className="text-xs capitalize text-[var(--muted-foreground)]">
                      {user?.role}
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
