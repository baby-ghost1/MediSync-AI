import { Heart, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-auto border-t border-[var(--border)]/60 bg-[var(--card)] shadow-[0_-1px_0_0_rgba(0,0,0,0.02)] dark:shadow-[0_-1px_0_0_rgba(255,255,255,0.03)]"
    >
      <div className="mx-auto flex flex-col items-center justify-between gap-5 px-8 py-6 md:flex-row md:gap-6 md:px-10 lg:px-12">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-white shadow-md shadow-[var(--primary)]/10">
            <Heart size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              MediSync AI
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Intelligent Healthcare Platform
            </p>
          </div>
        </div>

        {/* Center */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-[var(--muted-foreground)]">
          <a href="#" className="transition-all duration-200 hover:text-[var(--primary)]">
            Privacy Policy
          </a>
          <a href="#" className="transition-all duration-200 hover:text-[var(--primary)]">
            Terms
          </a>
          <a href="#" className="transition-all duration-200 hover:text-[var(--primary)]">
            Support
          </a>
          <a href="#" className="transition-all duration-200 hover:text-[var(--primary)]">
            Documentation
          </a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5 rounded-xl border border-[var(--success)]/20 bg-[var(--success-light)] px-4 py-2.5 shadow-sm shadow-[var(--success)]/5">
          <ShieldCheck size={16} className="text-[var(--success)]" />
          <div>
            <p className="text-xs font-semibold text-[var(--foreground)]">
              Secure Platform
            </p>
            <p className="text-[10px] text-[var(--muted-foreground)]">
              HIPAA Ready
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)]/50 py-4 text-center text-xs text-[var(--muted-foreground)]">
        &copy; {new Date().getFullYear()} MediSync AI. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
