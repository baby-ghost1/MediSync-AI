import { motion } from "framer-motion";
import { ShieldCheck, ChevronRight, Lock, Database, Cookie, FileCheck } from "lucide-react";
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
    transition: { staggerChildren: 0.08 },
  },
};

const sections = [
  {
    icon: Database,
    title: "Data We Collect",
    content:
      "We collect information you provide directly, such as your name, email address, phone number, medical history, health records, and appointment details. We also automatically collect technical data including IP address, browser type, device information, and usage patterns to improve our service.",
  },
  {
    icon: FileCheck,
    title: "How We Use Your Data",
    content:
      "Your data is used to provide and improve our healthcare platform, process appointments, generate AI-powered health insights, send important notifications, and comply with legal obligations. We never sell your personal information to third parties.",
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking",
    content:
      "We use essential cookies for authentication and security, functional cookies for preferences, and analytics cookies to understand platform usage. You can control cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality.",
  },
  {
    icon: Lock,
    title: "Data Security",
    content:
      "We implement industry-standard security measures including AES-256 encryption at rest, TLS 1.3 in transit, regular security audits, and strict access controls. Our infrastructure is hosted on SOC 2 compliant cloud providers with 24/7 monitoring.",
  },
  {
    icon: ShieldCheck,
    title: "Your Rights",
    content:
      "You have the right to access, correct, or delete your personal data at any time. You can export your data, withdraw consent for processing, and request restriction of data processing. Contact our support team to exercise these rights.",
  },
  {
    icon: Database,
    title: "Data Retention",
    content:
      "We retain your personal data only as long as necessary to provide services and comply with legal obligations. Medical records are retained as required by healthcare regulations. You can request early deletion of your data at any time.",
  },
  {
    icon: ChevronRight,
    title: "Third-Party Services",
    content:
      "We may share data with trusted third-party service providers who assist in operating our platform, including cloud hosting, AI processing, analytics, and communication services. All providers are contractually bound to maintain data confidentiality and security.",
  },
  {
    icon: ShieldCheck,
    title: "Contact Us",
    content:
      "For privacy-related inquiries, data requests, or concerns, contact our Data Protection Officer at privacy@medisync.ai or write to us at MediSync AI, 123 Healthcare Avenue, San Francisco, CA 94105, United States.",
  },
];

const PrivacyPolicyPage = () => {
  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[160px]" />
          <div className="absolute right-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-[var(--accent)]/8 blur-[140px]" />
        </div>
        <div className="mx-auto max-w-4xl px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary-light)]">
              <ShieldCheck size={32} className="text-[var(--primary)]" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
              Your privacy matters. We are committed to protecting your personal
              health information with the highest standards of security and
              transparency.
            </p>
            <p className="mt-3 text-xs text-[var(--muted-foreground)]">
              Last updated: July 1, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Link to="/" className="transition-colors hover:text-[var(--primary)]">
            Home
          </Link>
          <ChevronRight size={10} />
          <span className="text-[var(--foreground)]">Privacy Policy</span>
        </nav>
      </div>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-8"
          >
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  variants={fadeInUp}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-md)] sm:p-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-light)] transition-transform duration-300 group-hover:scale-110">
                      <Icon size={18} className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--foreground)]">
                        {section.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Contact Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-light)] p-6 text-center sm:p-8"
          >
            <h3 className="text-base font-semibold text-[var(--primary)]">
              Questions About Your Privacy?
            </h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Reach out to our Data Protection Officer at{" "}
              <a
                href="mailto:privacy@medisync.ai"
                className="font-medium text-[var(--primary)] underline underline-offset-2 transition-colors hover:text-[var(--primary-hover)]"
              >
                privacy@medisync.ai
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
