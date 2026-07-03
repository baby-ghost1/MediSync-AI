import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CalendarCheck2,
  ShieldCheck,
  Star,
  HeartPulse,
  PlayCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Zap,
  Users,
  Building2,
  Mail,
  Sparkles,
  Activity,
  BarChart3,
  Clock,
  MessageCircle,
  FileText,
  LoaderCircle,
  Stethoscope,
  Bot,
  Search,
  Smartphone,
  TrendingUp,
  Award,
  ChevronUp,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const floatAnim = {
  animate: {
    y: [0, -12, 0],
    transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
  },
};

const Typewriter = ({ text, className }) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="inline-block w-[3px] h-[1em] bg-[var(--primary)] ml-0.5 animate-pulse align-middle" />}
    </span>
  );
};

const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const handleLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ perspective: "1000px" }}
      className={className}
    >
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.x === 0 ? "transform 0.5s ease" : "transform 0.08s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const BorderGlowCard = ({ children, className = "", active = false }) => (
  <div className={`relative ${className}`}>
    {active && (
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] bg-[length:200%_100%] animate-[gradientMove_3s_linear_infinite] -z-10 opacity-70" />
    )}
    {children}
  </div>
);

const GlowDot = ({ index }) => (
  <div
    className="absolute rounded-full bg-[var(--primary)]/20 blur-sm"
    style={{
      width: `${4 + (index % 3) * 3}px`,
      height: `${4 + (index % 3) * 3}px`,
      left: `${15 + (index * 23) % 70}%`,
      top: `${10 + (index * 17) % 80}%`,
      animation: `floatGlow ${3 + (index % 4) * 2}s ease-in-out infinite`,
      animationDelay: `${index * 0.7}s`,
    }}
  />
);

const statItems = [
  { value: 25000, label: "Active Patients", suffix: "+", icon: Users },
  { value: 850, label: "Certified Doctors", suffix: "+", icon: Stethoscope },
  { value: 150, label: "Partner Hospitals", suffix: "+", icon: Building2 },
  { value: 98, label: "Satisfaction Rate", suffix: "%", icon: Award },
];

const partners = [
  "Apollo Hospitals", "Mayo Clinic", "Cleveland Clinic", "Johns Hopkins",
  "Mount Sinai", "Stanford Health", "Kaiser Permanente", "Mass General",
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for individuals starting their health journey",
    features: ["Basic AI health assistant", "Book appointments", "View medical records", "Email reminders", "Basic health score"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For patients who want advanced health insights",
    features: ["Everything in Starter", "Advanced AI diagnosis", "Lab report analysis", "Medicine interaction check", "Health trend analytics", "Priority support", "Family account (up to 5)"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For hospitals and large practices",
    features: ["Everything in Professional", "Unlimited family members", "API access", "Custom integrations", "Dedicated account manager", "SLA guarantee", "White-label options", "Advanced analytics dashboard"],
    cta: "Contact Sales",
    popular: false,
  },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Patient",
    review: "The AI assistant saved me hours. Booking appointments has never been easier. The health score feature helped me track my fitness goals.",
  },
  {
    name: "Priya Singh",
    role: "Patient",
    review: "Medical records are organized beautifully. Everything feels premium and secure. I love how I can access all my reports in one place.",
  },
  {
    name: "Dr. Amit Kumar",
    role: "Cardiologist",
    review: "Excellent dashboard for managing patients and appointments. The AI report analysis saves me at least 2 hours every day.",
  },
  {
    name: "Neha Patel",
    role: "Patient",
    review: "Finally a healthcare app that actually understands what patients need. The medicine reminder and AI symptom checker are game changers.",
  },
  {
    name: "Dr. Sneha Reddy",
    role: "Dermatologist",
    review: "The telemedicine integration is seamless. My patients love the easy booking system and automated reminders have reduced no-shows by 60%.",
  },
];

const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const startTime = performance.now();
          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const FlashCard = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`rounded-2xl border border-[var(--border)]/50 bg-[var(--card)]/80 p-5 shadow-[var(--shadow-xl)] ring-1 ring-[var(--border)]/30 backdrop-blur-sm ${className}`}
  >
    {children}
  </motion.div>
);

const HomePage = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(false);
  const autoRef = useRef(null);

  useEffect(() => {
    document.title = "MediSync AI — Healthcare Reimagined with AI";
  }, []);

  useEffect(() => {
    autoRef.current = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(autoRef.current);
  }, []);

  const nextTestimonial = useCallback(() => {
    clearInterval(autoRef.current);
    setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    clearInterval(autoRef.current);
    setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setNewsletterLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setNewsletterLoading(false);
    setNewsletterDone(true);
    setEmail("");
    setTimeout(() => setNewsletterDone(false), 3000);
  };

  const allFeatures = [
    {
      icon: BrainCircuit,
      title: "AI Medical Assistant",
      description: "Get intelligent symptom analysis, medicine guidance and healthcare recommendations powered by AI.",
      link: "/features/ai",
    },
    {
      icon: CalendarCheck2,
      title: "Smart Appointment Booking",
      description: "Book appointments instantly with real-time slot availability and automated reminders.",
      link: "/features/appointments",
    },
    {
      icon: ShieldCheck,
      title: "Secure Health Records",
      description: "HIPAA-ready encrypted medical records with complete patient privacy and data control.",
      link: "/features/records",
    },
    {
      icon: Activity,
      title: "Health Score & Analytics",
      description: "Track your overall health index with AI-powered analytics and personalized recommendations.",
      link: "/features/analytics",
    },
    {
      icon: MessageCircle,
      title: "24/7 AI Chat Support",
      description: "Round-the-clock AI chat assistance for health queries, medication reminders, and guidance.",
      link: "/features/chat",
    },
    {
      icon: FileText,
      title: "Lab Report Interpretation",
      description: "Upload lab reports and get instant AI-powered interpretations with reference ranges.",
      link: "/features/lab",
    },
  ];

  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <main className="overflow-x-hidden scroll-smooth">

      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 z-[300] h-[3px] origin-left bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
      />

      {/* Custom keyframes */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatGlow {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.8; }
        }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* SEO Meta */}
      <meta name="description" content="MediSync AI — Healthcare Reimagined with AI. Manage appointments, medical records, prescriptions and AI consultations from one intelligent platform." />
      <meta name="keywords" content="healthcare, AI, medical, appointments, telemedicine, health records" />

      {/* HERO */}
      <section id="hero" className="relative min-h-[90vh] flex items-center">
        {/* Animated BG */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" style={{
            backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }} />
          <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[var(--primary)]/12 blur-[160px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[var(--accent)]/12 blur-[160px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-[var(--primary)]/8 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
          {Array.from({ length: 8 }).map((_, i) => <GlowDot key={i} index={i} />)}
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-col justify-center gap-16 px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          {/* Left */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >
            <Badge variant="primary" size="md">
              <Sparkles size={12} className="mr-1" />
              AI Powered Healthcare Platform
            </Badge>

            <h1 className="mt-6 text-4xl font-bold tracking-tight leading-[1.08] sm:text-5xl lg:text-6xl">
              Healthcare
              <br />
              <Typewriter text="Reimagined with AI." className="gradient-text" />
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
              Manage appointments, medical records, prescriptions and AI
              consultations from one intelligent healthcare platform built for
              patients, doctors and hospitals.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" variant="gradient" rightIcon={<ArrowRight size={16} />}>
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
              <Button
                size="lg"
                variant="ghost"
                leftIcon={<PlayCircle size={16} />}
                onClick={() => setDemoOpen(true)}
              >
                <span className="flex items-center gap-2 group">
                  <PlayCircle size={16} className="transition-transform group-hover:scale-110" />
                  Watch Demo
                </span>
              </Button>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
            className="relative flex-1"
          >
            <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-[var(--shadow-xl)] ring-1 ring-[var(--border)]/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-[var(--primary-foreground)] shadow-md">
                  <HeartPulse size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    AI Health Score
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Updated Just Now
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-[var(--gradient-primary)] p-6 text-[var(--primary-foreground)] shadow-lg">
                <h2 className="text-5xl font-bold tracking-tight sm:text-6xl">96%</h2>
                <p className="mt-2 text-sm text-[var(--primary-foreground)]/80">Overall Health Index</p>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { label: "AI Disease Prediction", icon: BrainCircuit },
                  { label: "Medical Record Sync", icon: BarChart3 },
                  { label: "Appointment Reminder", icon: Clock },
                ].map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="group flex items-center justify-between rounded-xl bg-[var(--secondary)] px-4 py-3 transition-all duration-300 hover:bg-[var(--secondary)]/80 hover:pl-5"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                      <Icon size={14} className="text-[var(--primary)]" />
                      {label}
                    </span>
                    <Star size={16} className="text-[var(--warning)]" fill="currentColor" />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-3 -right-3 z-10 rounded-xl bg-[var(--success)] px-3 py-1.5 text-xs font-bold text-white shadow-lg"
            >
              LIVE
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="relative -mt-16 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--border)]/50 bg-[var(--border)]/50 shadow-[var(--shadow-xl)] md:grid-cols-4"
          >
            {statItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex flex-col items-center justify-center gap-3 bg-[var(--card)] px-6 py-10 text-center transition-colors duration-300 hover:bg-[var(--secondary)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-[var(--primary-foreground)] shadow-md transition-transform duration-300 group-hover:scale-110">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-[var(--foreground)] tabular-nums sm:text-4xl">
                      <CountUp end={item.value} suffix={item.suffix} />
                    </h3>
                    <p className="mt-1 text-xs font-medium text-[var(--muted-foreground)]">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* PARTNER LOGOS */}
      <section className="relative py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10 text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)]"
          >
            Trusted by leading healthcare institutions
          </motion.p>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--background)] to-transparent" />
            <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--background)] to-transparent" />
            <motion.div
              className="flex gap-12"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            >
              {[...partners, ...partners].map((name, i) => (
                <div
                  key={i}
                  className="flex shrink-0 items-center gap-3 rounded-2xl border border-[var(--border)]/40 bg-[var(--card)]/50 px-6 py-4 backdrop-blur-sm"
                >
                  <Building2 size={20} className="text-[var(--primary)]/60" />
                  <span className="whitespace-nowrap text-sm font-semibold text-[var(--muted-foreground)]">
                    {name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-24 lg:py-28">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-[var(--primary)]/6 blur-[140px]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto max-w-2xl text-center"
          >
            <Badge variant="primary" size="md">Platform Features</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Everything You Need For
              <span className="gradient-text"> Modern Healthcare</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
              Built for patients, doctors and hospitals with AI automation,
              secure medical records and seamless appointment management.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {allFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <TiltCard key={feature.title}>
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{ y: -4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-[var(--primary)]/30 hover:shadow-[0_0_30px_rgba(79,70,229,0.08)]"
                  >
                    <div className="absolute right-[-30px] top-[-30px] h-36 w-36 rounded-full bg-[var(--primary)]/8 blur-3xl transition-all duration-500 group-hover:bg-[var(--primary)]/15 group-hover:blur-2xl" />
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-[var(--primary-foreground)] shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[var(--primary)]/25">
                        <Icon size={22} />
                      </div>
                      <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--success)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {feature.description}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] transition-all group-hover:gap-2.5">
                      Learn More <ArrowRight size={14} className="transition-all group-hover:translate-x-1" />
                    </div>
                  </motion.div>
                </TiltCard>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* AI SHOWCASE */}
      <section id="ai" className="relative py-20 lg:py-28">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[var(--accent)]/6 blur-[160px]" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <Badge variant="primary" size="md">AI Assistant</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Your Personal
              <span className="gradient-text"> Medical AI</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
              Ask health questions, upload reports, understand prescriptions
              and receive AI-powered recommendations instantly.
            </p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-8 space-y-4"
            >
              {[
                { icon: BrainCircuit, text: "Disease Prediction" },
                { icon: Zap, text: "Medicine Recommendation" },
                { icon: FileText, text: "Health Report Analysis" },
                { icon: Users, text: "Doctor Recommendation" },
                { icon: MessageCircle, text: "24/7 AI Healthcare Chat" },
              ].map(({ icon: Icon, text }) => (
                <motion.div key={text} variants={fadeInUp} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-light)]">
                    <Icon size={16} className="text-[var(--primary)]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)]">{text}</span>
                </motion.div>
              ))}
            </motion.div>

            <Link to="/register">
              <Button className="mt-8" size="lg" variant="gradient" rightIcon={<Sparkles size={16} />}>
                Try AI Assistant
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative"
          >
            <FlashCard className="absolute left-0 top-8 z-20 !w-40">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">Heart Rate</p>
              <h3 className="mt-1 text-3xl font-bold text-[var(--primary)]">72</h3>
              <p className="flex items-center gap-1 text-xs font-medium text-[var(--success)]">
                <Activity size={12} />
                Normal
              </p>
            </FlashCard>

            <FlashCard className="absolute bottom-8 right-0 z-20 !w-40">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">AI Prediction</p>
              <h3 className="mt-1 text-3xl font-bold text-[var(--success)]">Low Risk</h3>
              <p className="text-xs font-medium text-[var(--muted-foreground)]">95% confidence</p>
            </FlashCard>

            <div className="rounded-3xl bg-[var(--gradient-primary)] p-8 shadow-[var(--shadow-xl)]">
              <div className="space-y-4">
                {[
                  { label: "Symptom Analysis", width: "w-full" },
                  { label: "Medicine Check", width: "w-3/4" },
                  { label: "Health Score", width: "w-1/2" },
                  { label: "Lab Results", width: "w-5/6" },
                ].map(({ label, width }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`h-14 rounded-xl bg-[var(--primary-foreground)]/15 backdrop-blur-md flex items-center px-4 ${width}`}>
                      <span className="text-xs font-medium text-[var(--primary-foreground)]/80">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DOCTORS */}
      <section id="doctors" className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center"
          >
            <Badge variant="primary" size="md">Our Specialists</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Consult Top Doctors
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
              Experienced specialists available online and offline with
              instant appointment booking.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {[
              { name: "Dr. Sarah Johnson", dept: "Cardiologist", exp: "15 years", rating: 4.9 },
              { name: "Dr. James Wilson", dept: "Neurologist", exp: "12 years", rating: 4.8 },
              { name: "Dr. Emma Davis", dept: "Dermatologist", exp: "10 years", rating: 4.9 },
              { name: "Dr. Robert Brown", dept: "Orthopedic", exp: "18 years", rating: 4.7 },
              { name: "Dr. Lisa Chen", dept: "Pediatrician", exp: "14 years", rating: 4.9 },
              { name: "Dr. Michael Lee", dept: "Ophthalmologist", exp: "11 years", rating: 4.8 },
              { name: "Dr. Sarah Ahmed", dept: "Gynecologist", exp: "16 years", rating: 4.9 },
              { name: "Dr. David Kim", dept: "Psychiatrist", exp: "9 years", rating: 4.7 },
            ].map((doctor) => (
              <motion.div
                key={doctor.name}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-card-hover)] text-center"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--gradient-primary)] text-2xl font-bold text-[var(--primary-foreground)] shadow-md transition-transform duration-300 group-hover:scale-105">
                  {doctor.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <h3 className="mt-5 text-sm font-semibold text-[var(--foreground)]">{doctor.name}</h3>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{doctor.dept}</p>
                <div className="mt-2 flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1"><Star size={11} className="text-[var(--warning)]" fill="currentColor" />{doctor.rating}</span>
                  <span>|</span>
                  <span>{doctor.exp}</span>
                </div>
                <Link to="/register" className="mt-5 block">
                  <Button fullWidth size="sm">
                    Book Appointment
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="relative py-20 lg:py-28">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[var(--primary)]/5 blur-[140px]" />
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center"
          >
            <Badge variant="primary" size="md">Testimonials</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Loved By Thousands
            </h2>
          </motion.div>

          <div className="relative mt-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-xl)] sm:p-12"
              >
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} fill="var(--warning)" className="text-[var(--warning)]" />
                  ))}
                </div>
                <p className="mt-8 text-lg leading-relaxed text-[var(--muted-foreground)] italic sm:text-xl">
                  &ldquo;{testimonials[testimonialIdx].review}&rdquo;
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gradient-primary)] text-sm font-bold text-[var(--primary-foreground)]">
                    {testimonials[testimonialIdx].name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">{testimonials[testimonialIdx].name}</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">{testimonials[testimonialIdx].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] shadow-lg transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-xl"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] shadow-lg transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-xl"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === testimonialIdx ? "w-8 bg-[var(--primary)]" : "w-2 bg-[var(--border)] hover:bg-[var(--border-hover)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative py-20 lg:py-28">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute right-0 top-1/2 h-[500px] w-[500px] rounded-full bg-[var(--accent)]/6 blur-[160px]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center"
          >
            <Badge variant="primary" size="md">Pricing</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
              Choose the plan that works best for you. No hidden fees. Cancel anytime.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-6"
          >
            {pricingPlans.map((plan) => (
              <BorderGlowCard key={plan.name} active={plan.popular}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  className={`relative rounded-2xl border p-8 shadow-[var(--shadow-card)] transition-all duration-300 ${
                    plan.popular
                      ? "border-transparent bg-[var(--card)] shadow-[var(--shadow-xl)]"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-card-hover)]"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--gradient-primary)] px-5 py-1 text-xs font-bold text-[var(--primary-foreground)] shadow-lg whitespace-nowrap">
                      <Sparkles size={10} className="inline mr-1 -mt-0.5" />
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-[var(--foreground)]">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[var(--foreground)]">{plan.price}</span>
                    <span className="text-sm text-[var(--muted-foreground)]">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">{plan.description}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]">
                        <Check size={15} className="mt-0.5 shrink-0 text-[var(--success)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={plan.name === "Enterprise" ? "/contact" : "/register"} className="mt-8 block">
                    <Button fullWidth variant={plan.popular ? "gradient" : "outline"} size="sm">
                      {plan.cta}
                    </Button>
                  </Link>
                </motion.div>
              </BorderGlowCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ROLE-BASED CTA */}
      <section id="roles" className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center"
          >
            <Badge variant="primary" size="md">For Everyone</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Choose Your <span className="gradient-text">Role</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
              Select how you want to use MediSync AI and get started instantly.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-14 grid gap-8 md:grid-cols-2"
          >
            {[
              {
                title: "For Patients",
                icon: HeartPulse,
                description: "Manage appointments, medical records, prescriptions, and get AI-powered health insights.",
                features: ["Book appointments", "Track health records", "AI health assistant", "Lab interpretation"],
                link: "/register",
                gradient: "from-[var(--primary)] to-[var(--accent)]",
              },
              {
                title: "For Doctors",
                icon: Stethoscope,
                description: "Manage patients, appointments, reports, and leverage AI for better diagnosis.",
                features: ["Patient management", "AI report analysis", "Digital prescriptions", "Consultation notes"],
                link: "/register",
                gradient: "from-[var(--primary)] to-[var(--primary-hover)]",
              },
            ].map((role) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.title}
                  variants={fadeInUp}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                  className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-card-hover)]"
                >
                  <div className={`absolute right-[-30px] top-[-30px] h-36 w-36 rounded-full bg-gradient-to-br ${role.gradient} opacity-10 blur-3xl`} />
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-[var(--primary-foreground)] shadow-md">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[var(--foreground)]">{role.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{role.description}</p>
                  <ul className="mt-6 space-y-2">
                    {role.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${role.gradient}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={role.link} className="mt-6 block">
                    <Button fullWidth variant="gradient" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="relative py-20 lg:py-24">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/3 top-0 h-[400px] w-[400px] rounded-full bg-[var(--primary)]/5 blur-[140px]" />
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] px-8 py-14 text-center shadow-[var(--shadow-xl)] sm:px-16 sm:py-16"
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-[-10%] top-[-30%] h-[250px] w-[250px] rounded-full bg-[var(--primary)]/8 blur-[100px]" />
              <div className="absolute bottom-[-30%] right-[-10%] h-[250px] w-[250px] rounded-full bg-[var(--accent)]/8 blur-[100px]" />
            </div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-[var(--primary-foreground)] shadow-md">
              <Mail size={24} />
            </div>
            <h2 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Stay Updated
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
              Get the latest health tips, product updates, and AI healthcare insights delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletter} className="mx-auto mt-8 flex max-w-md gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                />
              </div>
              <Button type="submit" variant="gradient" disabled={newsletterLoading || newsletterDone}>
                {newsletterLoading ? <LoaderCircle size={16} className="animate-spin" /> : newsletterDone ? <Check size={16} /> : "Subscribe"}
              </Button>
            </form>
            {newsletterDone && (
              <p className="mt-3 text-xs font-medium text-[var(--success)]">Thanks for subscribing! Check your inbox.</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative overflow-hidden rounded-3xl bg-[var(--gradient-primary)] px-8 py-16 text-center text-[var(--primary-foreground)] shadow-[var(--shadow-xl)] sm:px-16 sm:py-20 lg:px-24"
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute left-[-20%] top-[-20%] h-[300px] w-[300px] rounded-full bg-[var(--primary-foreground)]/10 blur-[100px]" />
              <div className="absolute bottom-[-20%] right-[-20%] h-[300px] w-[300px] rounded-full bg-[var(--primary-foreground)]/10 blur-[100px]" />
            </div>
            <Badge variant="glass" size="md">Start Today</Badge>
            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Join The Future Of Digital Healthcare
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--primary-foreground)]/80 sm:text-base">
              One intelligent platform for hospitals, doctors and patients with
              AI at its core.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="glass" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DEMO MODAL */}
      <AnimatePresence>
        {demoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setDemoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-[var(--card)] shadow-[0_40px_80px_rgba(0,0,0,0.3)]"
            >
              <button
                onClick={() => setDemoOpen(false)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <X size={18} />
              </button>
              <div className="aspect-video bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)]/20 backdrop-blur-sm">
                    <PlayCircle size={40} className="text-[var(--primary)]" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-[var(--muted-foreground)]">Product Demo — Coming Soon</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]/60">Experience MediSync AI in action</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
};

export default HomePage;
