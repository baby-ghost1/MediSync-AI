import { useState } from "react";
import { motion } from "framer-motion";
import {
  HeadphonesIcon,
  ChevronRight,
  Mail,
  MessageSquare,
  Clock,
  HelpCircle,
  ChevronDown,
  Send,
  CheckCircle2,
  BookOpen,
  FileText,
  ExternalLink,
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

const faqs = [
  {
    question: "How do I book an appointment?",
    answer:
      "Login to your patient account, navigate to the Appointments section, select your preferred doctor, choose an available time slot, and confirm your booking. You will receive an email confirmation immediately.",
  },
  {
    question: "Is my medical data secure?",
    answer:
      "Yes. We use AES-256 encryption at rest and TLS 1.3 in transit. Our platform is HIPAA-ready with strict access controls, regular security audits, and SOC 2 compliant infrastructure.",
  },
  {
    question: "How accurate is the AI health assistant?",
    answer:
      "Our AI models are trained on extensive medical datasets and achieve high accuracy, but they are designed to assist, not replace, professional medical advice. Always consult a healthcare provider for medical decisions.",
  },
  {
    question: "Can I access my medical records anytime?",
    answer:
      "Yes. Your medical records, reports, and prescriptions are available 24/7 through your patient dashboard. You can download, print, or share them with your healthcare providers.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Click on 'Forgot Password' on the login page, enter your registered email, and follow the instructions sent to your inbox. The password reset link expires in 1 hour for security.",
  },
  {
    question: "What should I do in a medical emergency?",
    answer:
      "MediSync AI is not for emergencies. If you are experiencing a medical emergency, please call your local emergency services immediately (911 in the US) or go to the nearest emergency room.",
  },
];

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
              <HeadphonesIcon size={32} className="text-[var(--primary)]" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="gradient-text">Support</span> Center
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
              We are here to help. Reach out through any of our support channels
              and our team will get back to you promptly.
            </p>
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
          <span className="text-[var(--foreground)]">Support</span>
        </nav>
      </div>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-6 md:grid-cols-3"
          >
            <motion.div
              variants={fadeInUp}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-light)] transition-transform duration-300 group-hover:scale-110">
                <Mail size={22} className="text-[var(--primary)]" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
                Email Support
              </h3>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                Get a response within 24 hours
              </p>
              <a
                href="mailto:support@medisync.ai"
                className="mt-3 inline-block text-sm font-medium text-[var(--primary)] underline underline-offset-2 transition-colors hover:text-[var(--primary-hover)]"
              >
                support@medisync.ai
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-light)] transition-transform duration-300 group-hover:scale-110">
                <Clock size={22} className="text-[var(--primary)]" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
                Business Hours
              </h3>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                Mon - Fri: 9 AM - 6 PM PST
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Weekends: 10 AM - 2 PM PST
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-light)] transition-transform duration-300 group-hover:scale-110">
                <MessageSquare size={22} className="text-[var(--primary)]" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
                Live Chat
              </h3>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                Coming soon
              </p>
              <span className="mt-3 inline-block rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                Under Development
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form + FAQ */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                Send Us a Message
              </h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Fill out the form below and our team will get back to you
                shortly.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 rounded-2xl border border-[var(--success)]/20 bg-[var(--success-light)] p-8 text-center"
                >
                  <CheckCircle2
                    size={40}
                    className="mx-auto text-[var(--success)]"
                  />
                  <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
                    Message Sent!
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    Thank you for reaching out. Our support team will respond
                    within 24 hours. This is a demo placeholder and does not
                    submit real data.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--secondary)]"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--input)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors duration-200 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--input)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors duration-200 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)]">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--input)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors duration-200 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)]">
                      Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your issue or question..."
                      className="mt-1.5 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--input)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors duration-200 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--primary-foreground)] shadow-[0_4px_16px_rgba(79,70,229,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(79,70,229,0.25)] active:translate-y-0"
                  >
                    <Send size={15} />
                    Send Message
                  </button>
                  <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                    This form is a demo placeholder. Backend integration is
                    coming soon.
                  </p>
                </form>
              )}
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--foreground)]">
                <HelpCircle size={20} className="text-[var(--primary)]" />
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Quick answers to common questions.
              </p>

              <div className="mt-8 space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-xl border border-[var(--border)] bg-[var(--card)] transition-all duration-200"
                  >
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === faq.question ? null : faq.question)
                      }
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-[var(--foreground)] transition-colors duration-200 hover:text-[var(--primary)]"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 text-[var(--muted-foreground)] transition-transform duration-300 ${
                          openFaq === faq.question ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openFaq === faq.question
                          ? "max-h-48 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-t border-[var(--border)] px-5 py-4">
                        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Help Resources */}
      <section className="border-t border-[var(--border)]/60 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              Additional Resources
            </h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Explore our documentation and guides for detailed information.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div
              variants={fadeInUp}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-light)] transition-transform duration-300 group-hover:scale-110">
                <BookOpen size={18} className="text-[var(--primary)]" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
                Documentation
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                Comprehensive guides for getting started, features, and best
                practices.
              </p>
              <Link
                to="/documentation"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
              >
                View Documentation
                <ExternalLink size={12} />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--success-light)] transition-transform duration-300 group-hover:scale-110">
                <FileText size={18} className="text-[var(--success)]" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
                Privacy Policy
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                Learn how we handle and protect your personal health
                information.
              </p>
              <Link
                to="/privacy-policy"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--success)] transition-colors hover:text-[var(--success-light)]"
              >
                View Policy
                <ExternalLink size={12} />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--warning-light)] transition-transform duration-300 group-hover:scale-110">
                <HelpCircle size={18} className="text-[var(--warning)]" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
                Terms of Service
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
                Read the terms governing your use of the MediSync AI platform.
              </p>
              <Link
                to="/terms"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--warning)] transition-colors hover:text-[var(--warning-light)]"
              >
                View Terms
                <ExternalLink size={12} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default SupportPage;
