import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HeartPulse,
  ShieldCheck,
  ArrowRight,
  Mail,
  Clock,
  MapPin,
  Globe,
  MessageCircle,
  ChevronRight,
  Stethoscope,
  CalendarCheck,
  Building2,
  HeadphonesIcon,
  BookOpen,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const socialLinks = [
  {
    icon: Globe,
    href: "#",
    label: "GitHub",
    render: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    icon: MessageCircle,
    href: "#",
    label: "Twitter",
    render: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    icon: Globe,
    href: "#",
    label: "LinkedIn",
    render: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    icon: MessageCircle,
    href: "#",
    label: "YouTube",
    render: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "AI Assistant", href: "/#ai" },
  { label: "Appointments", href: "/#appointments" },
  { label: "Medical Records", href: "/#records" },
  { label: "Health Reports", href: "/#reports" },
  { label: "Pricing", href: "#" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Careers", href: "#", suffix: "Coming Soon" },
  { label: "Blog", href: "#", suffix: "Future" },
];

const resourceLinks = [
  { label: "Help Center", href: "#" },
  { label: "Documentation", href: "/documentation" },
  { label: "FAQs", href: "#" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-auto">
      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-50%] h-[400px] w-[400px] rounded-full bg-[var(--primary)]/10 blur-[140px]" />
          <div className="absolute bottom-[-50%] right-[-10%] h-[400px] w-[400px] rounded-full bg-[var(--accent)]/8 blur-[140px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-5xl px-4 pb-8 pt-16 sm:px-6 sm:pb-12 sm:pt-20 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-3xl bg-[var(--gradient-primary)] px-8 py-12 text-center text-[var(--primary-foreground)] shadow-[var(--shadow-xl)] sm:px-16 sm:py-14 lg:px-20">
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-[-20%] top-[-20%] h-[250px] w-[250px] rounded-full bg-[var(--primary-foreground)]/10 blur-[100px]" />
              <div className="absolute bottom-[-20%] right-[-20%] h-[250px] w-[250px] rounded-full bg-[var(--primary-foreground)]/10 blur-[100px]" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Ready to Transform Your Healthcare Experience?
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--primary-foreground)]/80 sm:text-base">
              Join thousands of patients and doctors using AI-powered healthcare
              platform.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary-foreground)] px-6 py-3 text-sm font-semibold text-[var(--primary)] shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--primary-foreground)]/30 bg-[var(--primary-foreground)]/10 px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] backdrop-blur-sm transition-all duration-300 hover:bg-[var(--primary-foreground)]/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                Book Appointment
                <CalendarCheck size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-[var(--border)]/60 bg-[var(--card)]">
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16"
        >
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Brand */}
            <motion.div
              variants={itemVariants}
              className="sm:col-span-2 lg:col-span-4"
            >
              <Link to="/" className="group inline-flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[var(--gradient-primary)] shadow-[var(--shadow-lg)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-foreground)]/30 to-transparent" />
                  <HeartPulse
                    size={20}
                    className="relative z-10 text-[var(--primary-foreground)] drop-shadow-sm"
                  />
                </div>
                <div>
                  <h3 className="bg-[var(--gradient-primary)] bg-clip-text text-lg font-bold tracking-tight text-transparent">
                    MediSync AI
                  </h3>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                    AI Healthcare
                  </p>
                </div>
              </Link>

              <p className="mt-5 text-sm leading-relaxed text-[var(--muted-foreground)]">
                The intelligent healthcare platform connecting patients,
                doctors, and hospitals with AI-powered automation, secure
                records, and seamless care coordination.
              </p>

              {/* Trust Indicators */}
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--success)]/20 bg-[var(--success-light)] px-3 py-1.5 text-xs font-medium text-[var(--success)]">
                  <ShieldCheck size={13} />
                  HIPAA Ready
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--info)]/20 bg-[var(--info-light)] px-3 py-1.5 text-xs font-medium text-[var(--info)]">
                  <ShieldCheck size={13} />
                  AES-256 Encrypted
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="group/social flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] transition-all duration-300 hover:border-[var(--primary)]/30 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] hover:shadow-[0_4px_12px_rgba(79,70,229,0.12)]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="transition-transform duration-300 group-hover/social:scale-110">
                      {social.render()}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Product */}
            <motion.div
              variants={itemVariants}
              className="sm:col-span-1 lg:col-span-2"
            >
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--foreground)]">
                <Stethoscope size={14} className="text-[var(--primary)]" />
                Product
              </h4>
              <ul className="mt-5 space-y-3">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="group/link inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] transition-all duration-200 hover:text-[var(--primary)]"
                    >
                      <ChevronRight
                        size={10}
                        className="opacity-0 -ml-4 transition-all duration-200 group-hover/link:opacity-100 group-hover/link:ml-0"
                      />
                      <span className="relative">
                        {link.label}
                        <span className="absolute bottom-0 left-0 h-px w-0 bg-[var(--primary)] transition-all duration-300 group-hover/link:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div
              variants={itemVariants}
              className="sm:col-span-1 lg:col-span-2"
            >
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--foreground)]">
                <Building2 size={14} className="text-[var(--primary)]" />
                Company
              </h4>
              <ul className="mt-5 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="group/link inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-all duration-200 hover:text-[var(--primary)]"
                    >
                      <ChevronRight
                        size={10}
                        className="opacity-0 -ml-4 transition-all duration-200 group-hover/link:opacity-100 group-hover/link:ml-0"
                      />
                      <span className="relative">
                        {link.label}
                        <span className="absolute bottom-0 left-0 h-px w-0 bg-[var(--primary)] transition-all duration-300 group-hover/link:w-full" />
                      </span>
                      {link.suffix && (
                        <span className="rounded-md border border-[var(--border)] bg-[var(--surface-subtle)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)]">
                          {link.suffix}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              variants={itemVariants}
              className="sm:col-span-1 lg:col-span-2"
            >
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--foreground)]">
                <BookOpen size={14} className="text-[var(--primary)]" />
                Resources
              </h4>
              <ul className="mt-5 space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="group/link inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] transition-all duration-200 hover:text-[var(--primary)]"
                    >
                      <ChevronRight
                        size={10}
                        className="opacity-0 -ml-4 transition-all duration-200 group-hover/link:opacity-100 group-hover/link:ml-0"
                      />
                      <span className="relative">
                        {link.label}
                        <span className="absolute bottom-0 left-0 h-px w-0 bg-[var(--primary)] transition-all duration-300 group-hover/link:w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              variants={itemVariants}
              className="sm:col-span-2 lg:col-span-2"
            >
              <h4 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--foreground)]">
                <Mail size={14} className="text-[var(--primary)]" />
                Contact
              </h4>
              <ul className="mt-5 space-y-4">
                <li>
                  <Link
                    to="mailto:support@medisync.ai"
                    className="group/link inline-flex items-center gap-2.5 text-sm text-[var(--muted-foreground)] transition-all duration-200 hover:text-[var(--primary)]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] transition-colors duration-200 group-hover/link:border-[var(--primary)]/30 group-hover/link:bg-[var(--primary-light)]">
                      <Mail size={13} className="text-[var(--primary)]" />
                    </div>
                    <span className="relative">
                      support@medisync.ai
                      <span className="absolute bottom-0 left-0 h-px w-0 bg-[var(--primary)] transition-all duration-300 group-hover/link:w-full" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className="group/link inline-flex items-center gap-2.5 text-sm text-[var(--muted-foreground)] transition-all duration-200 hover:text-[var(--primary)]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] transition-colors duration-200 group-hover/link:border-[var(--primary)]/30 group-hover/link:bg-[var(--primary-light)]">
                      <HeadphonesIcon size={13} className="text-[var(--primary)]" />
                    </div>
                    <span className="relative">
                      Help Center
                      <span className="absolute bottom-0 left-0 h-px w-0 bg-[var(--primary)] transition-all duration-300 group-hover/link:w-full" />
                    </span>
                  </Link>
                </li>
                <li>
                  <div className="inline-flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]">
                      <Clock size={13} className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        Mon - Fri, 9 AM - 6 PM
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Weekends: 10 AM - 2 PM
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="inline-flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)]">
                      <MapPin size={13} className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        San Francisco, CA
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        United States
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        </div>

        {/* Bottom Bar */}
        <div className="mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <p className="text-xs text-[var(--muted-foreground)]">
              &copy; {new Date().getFullYear()} MediSync AI. All rights reserved.
            </p>
            <span className="hidden h-3 w-px bg-[var(--border)] sm:block" />
            <p className="text-xs text-[var(--muted-foreground)]">
              Made with{" "}
              <span className="text-[var(--danger)]">&#9829;</span> for modern
              healthcare
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--muted-foreground)]">
              v2.0.0
            </span>
            <Link
              to="/privacy-policy"
              className="text-xs text-[var(--muted-foreground)] transition-colors duration-200 hover:text-[var(--primary)]"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-[var(--muted-foreground)] transition-colors duration-200 hover:text-[var(--primary)]"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-24 left-6 z-40 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_8px_24px_rgba(79,70,229,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(79,70,229,0.35)] active:translate-y-0"
        >
          <ChevronUp size={18} />
        </motion.button>
      )}
    </footer>
  );
};

export default Footer;
