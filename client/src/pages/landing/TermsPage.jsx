import { motion } from "framer-motion";
import {
  Scale,
  ChevronRight,
  Gavel,
  UserCheck,
  AlertTriangle,
  ShieldOff,
  FileJson,
  Globe,
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
    transition: { staggerChildren: 0.08 },
  },
};

const sections = [
  {
    icon: UserCheck,
    title: "User Responsibilities",
    content:
      "You agree to provide accurate, current, and complete information during registration and use. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.",
  },
  {
    icon: Globe,
    title: "Platform Usage",
    content:
      "MediSync AI provides a platform for healthcare management, AI-powered health insights, appointment scheduling, and medical record storage. You agree to use the platform only for lawful purposes and in accordance with these terms. Prohibited uses include unauthorized access, data scraping, and disruptive behavior.",
  },
  {
    icon: AlertTriangle,
    title: "Medical Disclaimer",
    content:
      "MediSync AI is a healthcare management platform that provides AI-powered insights and recommendations. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions. In case of emergency, call your local emergency services immediately.",
  },
  {
    icon: Gavel,
    title: "AI Disclaimer",
    content:
      "AI-generated insights, predictions, and recommendations are for informational purposes only. They are based on available data and machine learning algorithms that may not be 100% accurate. MediSync AI is not liable for decisions made based on AI-generated content. Clinical decisions must be made by licensed healthcare professionals.",
  },
  {
    icon: ShieldOff,
    title: "Limitation of Liability",
    content:
      "MediSync AI and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. This includes but is not limited to data loss, service interruption, or damages resulting from reliance on platform content. Our total liability shall not exceed the amount paid by you in the past 12 months.",
  },
  {
    icon: FileJson,
    title: "Intellectual Property",
    content:
      "All content, features, and functionality of MediSync AI, including software, design, text, graphics, logos, and AI models, are owned by MediSync AI or its licensors and are protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our explicit written consent.",
  },
  {
    icon: Scale,
    title: "Account Termination",
    content:
      "We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a security risk. You may terminate your account at any time through your settings. Upon termination, your data will be handled according to our Privacy Policy and applicable regulations.",
  },
  {
    icon: Gavel,
    title: "Governing Law",
    content:
      "These terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved through binding arbitration in San Francisco, California.",
  },
];

const TermsPage = () => {
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
              <Scale size={32} className="text-[var(--primary)]" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Terms & <span className="gradient-text">Conditions</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
              Please read these terms carefully before using the MediSync AI
              platform. By using our services, you agree to be bound by these
              terms.
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
          <span className="text-[var(--foreground)]">Terms & Conditions</span>
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
              Have Questions About Our Terms?
            </h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Contact our legal team at{" "}
              <a
                href="mailto:legal@medisync.ai"
                className="font-medium text-[var(--primary)] underline underline-offset-2 transition-colors hover:text-[var(--primary-hover)]"
              >
                legal@medisync.ai
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default TermsPage;
