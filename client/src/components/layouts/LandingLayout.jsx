import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

const LandingLayout = () => {
  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 pt-20"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
