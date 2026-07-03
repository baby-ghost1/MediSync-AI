import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CalendarCheck2,
  ShieldCheck,
  Star,
  HeartPulse,
  PlayCircle,
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

const stats = [
  { value: "25K+", label: "Patients" },
  { value: "850+", label: "Doctors" },
  { value: "150+", label: "Hospitals" },
  { value: "99.9%", label: "Uptime" },
];

const features = [
  {
    icon: BrainCircuit,
    title: "AI Medical Assistant",
    description:
      "Get intelligent symptom analysis, medicine guidance and healthcare recommendations powered by AI.",
  },
  {
    icon: CalendarCheck2,
    title: "Smart Appointment Booking",
    description:
      "Book appointments instantly with real-time slot availability and automated reminders.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Health Records",
    description:
      "HIPAA-ready encrypted medical records with complete patient privacy.",
  },
];

const HomePage = () => {
  return (
    <main className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[var(--primary)]/12 blur-[160px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[var(--accent)]/12 blur-[160px]" />
          <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-[var(--primary)]/8 blur-[120px]" />
        </div>

        <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center gap-16 px-4 py-24 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          {/* Left */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            animate="visible"
            className="flex-1"
          >
            <Badge variant="primary" size="md">
              AI Powered Healthcare Platform
            </Badge>

            <h1 className="mt-6 text-4xl font-bold tracking-tight leading-[1.08] sm:text-5xl lg:text-6xl">
              Healthcare
              <br />
              <span className="gradient-text">Reimagined</span>
              {" "}with AI.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
              Manage appointments, medical records, prescriptions and AI
              consultations from one intelligent healthcare platform built for
              patients, doctors and hospitals.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" variant="gradient" rightIcon={<ArrowRight size={16} />}>
                  Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Login
                </Button>
              </Link>
              <Button size="lg" variant="ghost" leftIcon={<PlayCircle size={16} />}>
                Watch Demo
              </Button>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
            >
              {stats.map((item) => (
                <motion.div key={item.label} variants={fadeInUp}>
                  <h3 className="text-2xl font-bold text-[var(--primary)] sm:text-3xl">
                    {item.value}
                  </h3>
                  <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
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
                {["AI Disease Prediction", "Medical Record Sync", "Appointment Reminder"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-xl bg-[var(--secondary)] px-4 py-3 transition-colors hover:bg-[var(--secondary)]/80"
                    >
                      <span className="text-sm font-medium text-[var(--foreground)]">{item}</span>
                      <Star size={16} className="text-[var(--warning)]" fill="currentColor" />
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-24 lg:py-28">
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
            className="mt-16 grid gap-6 lg:grid-cols-3"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-card-hover)]"
                >
                  <div className="absolute right-[-30px] top-[-30px] h-36 w-36 rounded-full bg-[var(--primary)]/8 blur-3xl transition-all duration-500 group-hover:bg-[var(--primary)]/15 group-hover:blur-2xl" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-[var(--primary-foreground)] shadow-md transition-transform duration-300 group-hover:scale-110">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {feature.description}
                  </p>
                  <Link
                    to="/#ai"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] transition-all hover:text-[var(--primary-hover)]"
                  >
                    Learn More <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* AI SHOWCASE */}
      <section className="relative py-20 lg:py-28">
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
                "Disease Prediction",
                "Medicine Recommendation",
                "Health Report Analysis",
                "Doctor Recommendation",
                "24/7 AI Healthcare Chat",
              ].map((item) => (
                <motion.div key={item} variants={fadeInUp} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-light)]">
                    <ShieldCheck size={16} className="text-[var(--primary)]" />
                  </div>
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <Link to="/register">
              <Button className="mt-8" size="lg" variant="gradient">
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
            {/* Floating Card 1 */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute left-0 top-8 z-20 rounded-2xl bg-[var(--card)] p-5 shadow-[var(--shadow-xl)] ring-1 ring-[var(--border)]/50 backdrop-blur-sm"
            >
              <p className="text-xs font-medium text-[var(--muted-foreground)]">Heart Rate</p>
              <h3 className="mt-1 text-3xl font-bold text-[var(--primary)]">72</h3>
              <p className="text-xs font-medium text-[var(--success)]">Normal</p>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={{ y: [0, 18, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute bottom-8 right-0 z-20 rounded-2xl bg-[var(--card)] p-5 shadow-[var(--shadow-xl)] ring-1 ring-[var(--border)]/50 backdrop-blur-sm"
            >
              <p className="text-xs font-medium text-[var(--muted-foreground)]">AI Prediction</p>
              <h3 className="mt-1 text-3xl font-bold text-[var(--success)]">Low Risk</h3>
            </motion.div>

            {/* Dashboard Mockup */}
            <div className="rounded-3xl bg-[var(--gradient-primary)] p-8 shadow-[var(--shadow-xl)]">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-14 rounded-xl bg-[var(--primary-foreground)]/15 backdrop-blur-md"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="relative py-20 lg:py-28">
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
              { name: "Dr. Sarah Johnson", dept: "Cardiologist" },
              { name: "Dr. James Wilson", dept: "Neurologist" },
              { name: "Dr. Emma Davis", dept: "Dermatologist" },
              { name: "Dr. Robert Brown", dept: "Orthopedic" },
            ].map((doctor) => (
              <motion.div
                key={doctor.name}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-card-hover)] text-center"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--gradient-primary)] text-2xl font-bold text-[var(--primary-foreground)] shadow-md">
                  {doctor.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <h3 className="mt-5 text-sm font-semibold text-[var(--foreground)]">
                  {doctor.name}
                </h3>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {doctor.dept}
                </p>
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
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[var(--primary)]/5 blur-[140px]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-14 grid gap-6 lg:grid-cols-3"
          >
            {[
              {
                name: "Rahul Sharma",
                review: "The AI assistant saved me hours. Booking appointments has never been easier.",
              },
              {
                name: "Priya Singh",
                review: "Medical records are organized beautifully. Everything feels premium.",
              },
              {
                name: "Dr. Amit Kumar",
                review: "Excellent dashboard for managing patients and appointments.",
              },
            ].map((item) => (
              <motion.div
                key={item.name}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} fill="var(--warning)" className="text-[var(--warning)]" />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[var(--muted-foreground)] italic">
                  &ldquo;{item.review}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-[var(--border)] pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gradient-primary)] text-[10px] font-bold text-[var(--primary-foreground)]">
                    {item.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    {item.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
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

      {/* Role-based CTA */}
      <section className="py-20 lg:py-24">
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
                title: "Patient",
                description: "Manage appointments, medical records, prescriptions, and get AI-powered health insights.",
                features: ["Book appointments", "Track health records", "AI health assistant"],
                link: "/register",
                gradient: "from-[var(--primary)] to-[var(--accent)]",
              },
              {
                title: "Doctor",
                description: "Manage patients, appointments, reports, and leverage AI for better diagnosis.",
                features: ["Patient management", "AI report analysis", "Digital prescriptions"],
                link: "/register",
                gradient: "from-[var(--primary)] to-[var(--primary-hover)]",
              },
            ].map((role) => (
              <motion.div
                key={role.title}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className={`absolute right-[-30px] top-[-30px] h-36 w-36 rounded-full bg-gradient-to-br ${role.gradient} opacity-10 blur-3xl`} />
                <h3 className="text-xl font-bold text-[var(--foreground)]">{role.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {role.description}
                </p>
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
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
