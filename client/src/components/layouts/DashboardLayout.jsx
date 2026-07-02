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
    <div
      className="
        min-h-screen
        bg-[var(--background)]
        text-[var(--foreground)]
      "
    >
      {/* Desktop sidebar always visible; mobile sidebar shown as overlay */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <Sidebar
              collapsed={false}
              setCollapsed={() => {}}
            />
          </div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        transition={{
          duration: 0.32,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`
          min-h-screen
          transition-all duration-300

          ${
            collapsed
              ? "lg:ml-[78px]"
              : "lg:ml-[280px]"
          }
        `}
      >
        <Navbar />

        <SocketReconnecting />

        <main
          className="
            relative
            min-h-screen
            px-4
            pt-[118px]
            pb-10

            sm:px-6
            lg:px-8
            xl:px-10
            2xl:px-12
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              mx-auto
              w-full
              max-w-[1700px]
            "
          >
            <Outlet />
          </motion.div>
        </main>

        <Footer />
      </motion.div>
    </div>
  );
};

export default DashboardLayout;