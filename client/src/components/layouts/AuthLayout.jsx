import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)]">
      {/* Background blurs */}
      <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-[var(--primary)]/15 blur-[180px]" />
      <div className="absolute -right-48 -bottom-48 h-[600px] w-[600px] rounded-full bg-[var(--accent)]/15 blur-[180px]" />
      <div className="absolute left-1/3 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[var(--primary)]/5 blur-[140px]" />

      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,var(--primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--primary)_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* Page */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
