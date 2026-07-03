import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  Rocket,
  BrainCircuit,
  User,
  Stethoscope,
  Building2,
  HelpCircle,
  ExternalLink,
  Search,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const sections = [
  {
    icon: Rocket,
    title: "Getting Started",
    color: "primary",
    items: [
      "Create your account in under 2 minutes",
      "Choose your role: Patient, Doctor, or Admin",
      "Complete your profile and verify your email",
      "Explore the dashboard and available features",
      "Configure your preferences and notifications",
    ],
  },
  {
    icon: BrainCircuit,
    title: "Features Overview",
    color: "accent",
    items: [
      "AI-powered symptom checker and health analysis",
      "Smart appointment scheduling with reminders",
      "Secure medical records and document management",
      "Real-time chat with healthcare providers",
      "Health score tracking and personalized insights",
    ],
  },
  {
    icon: User,
    title: "Patient Guide",
    color: "success",
    items: [
      "Book and manage appointments with specialists",
      "Access your medical records and prescriptions",
      "Use AI assistant for health-related questions",
      "Track your health metrics and progress",
      "Receive reminders and health notifications",
    ],
  },
  {
    icon: Stethoscope,
    title: "Doctor Guide",
    color: "warning",
    items: [
      "Manage patient appointments and schedules",
      "Review patient medical history and reports",
      "Leverage AI for report analysis and insights",
      "Create and manage digital prescriptions",
      "Communicate with patients securely",
    ],
  },
  {
    icon: Building2,
    title: "Admin Guide",
    color: "info",
    items: [
      "Manage users, doctors, and patients",
      "Oversee platform analytics and reports",
      "Configure system settings and permissions",
      "Monitor appointments and platform activity",
      "Handle support tickets and escalations",
    ],
  },
  {
    icon: HelpCircle,
    title: "AI Features",
    color: "primary",
    items: [
      "Symptom Checker: AI-powered preliminary analysis",
      "Medicine Info: Comprehensive drug information",
      "Health Score: Calculate your overall health index",
      "Health Tips: Personalized wellness recommendations",
      "Report Summary: AI-generated report summaries",
    ],
  },
];

const sidebarLinks = [
  { label: "Getting Started", href: "#getting-started" },
  { label: "Features Overview", href: "#features-overview" },
  { label: "Patient Guide", href: "#patient-guide" },
  { label: "Doctor Guide", href: "#doctor-guide" },
  { label: "Admin Guide", href: "#admin-guide" },
  { label: "AI Features", href: "#ai-features" },
  { label: "FAQ", href: "#faq" },
];

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[160px]" />
          <div className="absolute right-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-[var(--accent)]/8 blur-[140px]" />
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
              <BookOpen size={32} className="text-[var(--primary)]" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-text">Documentation</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
              Everything you need to know about MediSync AI. From getting
              started to advanced features, guides, and best practices.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-10 max-w-xl"
          >
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] py-3.5 pl-11 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] shadow-[var(--shadow-sm)] transition-all duration-200 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link to="/" className="transition-colors hover:text-[var(--primary)]">
            Home
          </Link>
          <ChevronRight size={10} />
          <span className="text-[var(--foreground)]">Documentation</span>
        </nav>
      </div>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-10 lg:gap-16">
            {/* Sidebar */}
            <aside className="hidden w-56 shrink-0 lg:block">
              <nav className="sticky top-28 space-y-1">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  On this page
                </h4>
                {sidebarLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(
                        link.href.replace("#", "")
                      );
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="block rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] transition-all duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileSidebar(true)}
                className="mb-6 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-sm)] transition-all duration-200 hover:bg-[var(--secondary)]"
              >
                <Menu size={16} />
                Sections
              </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
              {mobileSidebar && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileSidebar(false)}
                    className="fixed inset-0 z-50 bg-[var(--foreground)]/40 backdrop-blur-sm lg:hidden"
                  />
                  <motion.aside
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed left-0 top-0 z-[60] flex h-full w-[280px] flex-col border-r border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-xl)] lg:hidden"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-[var(--foreground)]">
                        Sections
                      </h3>
                      <button
                        onClick={() => setMobileSidebar(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <nav className="space-y-1">
                      {sidebarLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          onClick={(e) => {
                            e.preventDefault();
                            setMobileSidebar(false);
                            const el = document.getElementById(
                              link.href.replace("#", "")
                            );
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="block rounded-lg px-3 py-2.5 text-sm text-[var(--muted-foreground)] transition-all duration-200 hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                        >
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="min-w-0 flex-1">
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="space-y-10"
              >
                {sections.map((section, idx) => {
                  const isOpen = activeSection === idx;

                  return (
                    <motion.div
                      key={section.title}
                      id={section.title.toLowerCase().replace(/\s+/g, "-")}
                      variants={fadeInUp}
                    >
                      <button
                        onClick={() =>
                          setActiveSection(isOpen ? null : idx)
                        }
                        className="group flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-md)] sm:p-8"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-[var(${
                              section.color === "primary"
                                ? "--primary-light"
                                : section.color === "accent"
                                ? "--accent-light"
                                : section.color === "success"
                                ? "--success-light"
                                : section.color === "warning"
                                ? "--warning-light"
                                : "--info-light"
                            })] transition-transform duration-300 group-hover:scale-110`}
                          >
                            <section.icon
                              size={22}
                              className={`text-[var(--${section.color})]`}
                            />
                          </div>
                          <div className="text-left">
                            <h2 className="text-lg font-semibold text-[var(--foreground)]">
                              {section.title}
                            </h2>
                            <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                              {section.items.length} topics
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-[var(--muted-foreground)] transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="mt-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
                          <ul className="space-y-3">
                            {section.items.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-sm text-[var(--muted-foreground)]"
                              >
                                <div
                                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--${section.color})]`}
                                />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* FAQ Section */}
              <motion.div
                id="faq"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="mt-12 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-light)] p-8 text-center"
              >
                <HelpCircle
                  size={32}
                  className="mx-auto text-[var(--primary)]"
                />
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
                  Still Have Questions?
                </h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Our support team is ready to help you with any questions or
                  issues.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <Link
                    to="/support"
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] shadow-[0_4px_16px_rgba(79,70,229,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(79,70,229,0.25)] active:translate-y-0"
                  >
                    Visit Support Center
                    <ExternalLink size={14} />
                  </Link>
                  <a
                    href="mailto:support@medisync.ai"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition-all duration-300 hover:bg-[var(--secondary)]"
                  >
                    Email Support
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DocumentationPage;
