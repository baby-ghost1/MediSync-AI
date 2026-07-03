import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Home,
  Search,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MotionLink = motion(Link);

const floatingIcons = [
  { Icon: HeartPulse, top: "10%", left: "12%", delay: 0 },
  { Icon: Search, top: "22%", right: "10%", delay: 0.5 },
  { Icon: Stethoscope, bottom: "18%", left: "18%", delay: 1 },
];

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6">
      {/* Background glows */}
      <div className="absolute -left-48 -top-48 h-130 w-130 rounded-full bg-[var(--primary)]/15 blur-[180px]" />
      <div className="absolute -bottom-48 -right-48 h-130 w-130 rounded-full bg-[var(--accent)]/15 blur-[180px]" />

      {/* Floating Icons – decorative only */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {floatingIcons.map(({ Icon, delay, ...style }, index) => (
          <motion.div
            key={index}
            animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5, delay }}
            style={style}
            className="absolute flex h-16 w-16 items-center justify-center rounded-3xl border border-[var(--border)]/20 bg-[var(--card)]/50 backdrop-blur-2xl md:h-20 md:w-20"
          >
            <Icon size={34} className="text-[var(--primary)]" />
          </motion.div>
        ))}
      </div>

      {/* Card container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl rounded-[36px] border border-[var(--border)]/70 bg-[var(--card)] p-[1.5px] shadow-[var(--shadow-2xl)]"
      >
        <div className="relative overflow-hidden rounded-[34px] bg-[var(--card)] p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_0_rgba(0,0,0,0.04)] sm:p-12">
          {/* Decorative blobs & accents */}
          <div className="pointer-events-none absolute -right-28 -top-28 h-56 w-56 rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-36 -left-24 h-64 w-64 rounded-full bg-cyan-500/8 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-12 right-1/3 h-32 w-32 rounded-full bg-violet-500/8 blur-[80px]" />
          <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-br-[34px] bg-gradient-to-bl from-[var(--primary)]/[0.04] to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 rounded-tl-[34px] bg-gradient-to-tr from-[var(--accent)]/[0.04] to-transparent" />
          <div className="pointer-events-none absolute right-12 top-12 h-px w-20 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
          <div className="pointer-events-none absolute bottom-12 left-12 h-px w-20 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--warning)]/20 bg-[var(--warning-light)] px-4 py-1.5 text-xs font-medium text-[var(--warning)] shadow-sm backdrop-blur-2xl"
          >
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--warning)]/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--warning)]" />
            </span>
            Medical AI &bull; Error 404
          </motion.div>

          {/* 404 Hero */}
          <div className="relative mt-10 flex items-center justify-center sm:mt-12">
            {/* Decorative background 404 – hidden from screen readers */}
            <span
              aria-hidden="true"
              className="absolute select-none text-[140px] font-black leading-none tracking-tighter text-[var(--muted)] sm:text-[180px] lg:text-[240px]"
              style={{ transform: "translate(4px, 4px)" }}
            >
              404
            </span>
            <motion.h1
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="relative bg-[var(--gradient-primary)] bg-clip-text text-[100px] font-black leading-none tracking-tighter text-transparent sm:text-[120px] lg:text-[200px]"
              style={{
                textShadow:
                  "0 0 80px rgba(37,99,235,0.15), 0 0 40px rgba(99,102,241,0.1)",
              }}
            >
              404
            </motion.h1>
          </div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Page Not Found
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-3 max-w-xl text-base leading-7 text-[var(--muted-foreground)] sm:mt-4"
          >
            The page you're looking for doesn't exist, may have been moved, or
            the URL is incorrect.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-12"
          >
            {/* Go Home – using MotionLink (valid HTML, accessible) */}
            <MotionLink
              to="/"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-xl bg-[var(--gradient-primary)] px-8 text-base font-semibold text-[var(--primary-foreground)] shadow-lg transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <span className="absolute inset-0 translate-x-[-200%] bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] transition-transform duration-500 group-hover:translate-x-[200%]" />
              <Home size={18} className="relative" />
              <span className="relative">Go Home</span>
            </MotionLink>

            {/* Go Back – with focus ring */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(-1)}
              className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)]/60 px-8 text-base font-semibold text-[var(--foreground)] shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--card)]/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <ArrowLeft size={18} />
              Go Back
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid gap-4 sm:grid-cols-3"
          >
            {[
              {
                icon: Bot,
                value: "24×7",
                label: "AI Assistance",
                gradient: "from-[var(--primary)]/[0.06] to-[var(--primary)]/[0.04]",
                iconColor: "text-[var(--primary)]",
                border: "border-[var(--primary)]/20",
              },
              {
                icon: Stethoscope,
                value: "850+",
                label: "Verified Doctors",
                gradient: "from-[var(--success)]/[0.06] to-[var(--success)]/[0.04]",
                iconColor: "text-[var(--success)]",
                border: "border-[var(--success)]/20",
              },
              {
                icon: HeartPulse,
                value: "25K+",
                label: "Happy Patients",
                gradient: "from-[var(--primary)]/[0.06] to-[var(--primary)]/[0.04]",
                iconColor: "text-[var(--primary)]",
                border: "border-[var(--primary)]/20",
              },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 40px -8px rgba(0,0,0,0.08)",
                }}
                className={`group cursor-default rounded-2xl border ${item.border} bg-gradient-to-br ${item.gradient} p-5 text-left backdrop-blur-sm transition-all duration-300 hover:shadow-lg sm:p-6`}
              >
                <item.icon className={`mb-3 h-6 w-6 ${item.iconColor}`} />
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {item.value}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-[var(--muted-foreground)]">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
};

export default NotFoundPage;