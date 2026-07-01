import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/layouts/Navbar";
import Sidebar from "@/components/layouts/Sidebar";
import Footer from "@/components/layouts/Footer";
import { SocketReconnecting } from "@/components/common/SocketStatus";
import useAppStore from "@/store/appStore";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { mobileMenuOpen } = useAppStore();
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AnimatePresence>
        {(!mobileMenuOpen || window.innerWidth >= 1024) && (
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        )}
      </AnimatePresence>
      <div className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
      }`}>
        <Navbar />
        <SocketReconnecting />
        <main className="min-h-screen px-4 pb-8 pt-[112px] sm:px-6 md:px-8 xl:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[1600px]"
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
export default DashboardLayout;
