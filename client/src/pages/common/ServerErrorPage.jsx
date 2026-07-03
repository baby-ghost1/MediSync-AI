import { motion } from "framer-motion";
import { ServerCrash, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MotionLink = motion(Link);

const ServerErrorPage = () => {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6">
      <div className="absolute -left-48 -top-48 h-130 w-130 rounded-full bg-[var(--warning)]/10 blur-[180px]" />
      <div className="absolute -bottom-48 -right-48 h-130 w-130 rounded-full bg-[var(--accent)]/10 blur-[180px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl rounded-[36px] border border-[var(--border)]/70 bg-[var(--card)] p-[1.5px] shadow-[var(--shadow-2xl)]"
      >
        <div className="relative overflow-hidden rounded-[34px] bg-[var(--card)] p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute -right-28 -top-28 h-56 w-56 rounded-full bg-amber-500/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-36 -left-24 h-64 w-64 rounded-full bg-orange-500/8 blur-[120px]" />

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--warning)]/20 bg-[var(--warning-light)] px-4 py-1.5 text-xs font-medium text-[var(--warning)] shadow-sm"
          >
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--warning)]/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--warning)]" />
            </span>
            Server Error &bull; Error 500
          </motion.div>

          <div className="relative mt-10 flex items-center justify-center">
            <span aria-hidden="true" className="absolute select-none text-[140px] font-black leading-none tracking-tighter text-[var(--muted)] sm:text-[180px] lg:text-[240px]">
              500
            </span>
            <motion.h1
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="relative bg-[var(--warning)] bg-clip-text text-[100px] font-black leading-none tracking-tighter text-transparent sm:text-[120px] lg:text-[200px]"
            >
              500
            </motion.h1>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Server Error
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-3 max-w-xl text-base leading-7 text-[var(--muted-foreground)]"
          >
            Something went wrong on our end. Please try again later or contact
            support if the issue persists.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-12"
          >
            <MotionLink
              to="/"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-xl bg-[var(--warning)] px-8 text-base font-semibold text-[var(--warning-foreground)] shadow-lg transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              <span className="absolute inset-0 translate-x-[-200%] bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.15)_50%,transparent_100%)] transition-transform duration-500 group-hover:translate-x-[200%]" />
              <Home size={18} className="relative" />
              <span className="relative">Go Home</span>
            </MotionLink>

            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => window.location.reload()}
              className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)]/60 px-8 text-base font-semibold text-[var(--foreground)] shadow-sm backdrop-blur-xl transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--card)]/80 hover:shadow-md"
            >
              <RefreshCw size={18} />
              Try Again
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid gap-4 sm:grid-cols-3"
          >
            {[
              { icon: ServerCrash, value: "500", label: "Internal Error", color: "text-[var(--danger)]" },
              { icon: RefreshCw, value: "Auto", label: "Retry System", color: "text-[var(--warning)]" },
              { icon: Home, value: "Contact", label: "Support Team", color: "text-[var(--accent)]" },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -4 }}
                className="group cursor-default rounded-2xl border border-[var(--border)]/50 bg-gradient-to-br from-[var(--muted-foreground)]/[0.06] to-[var(--muted-foreground)]/[0.04] p-5 text-left backdrop-blur-sm transition-all duration-300 hover:shadow-lg sm:p-6"
              >
                <item.icon className={`mb-3 h-6 w-6 ${item.color}`} />
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{item.value}</h3>
                <p className="mt-0.5 text-sm font-medium text-[var(--muted-foreground)]">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
};

export default ServerErrorPage;
