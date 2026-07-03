import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "@/components/layouts/Navbar";
import Sidebar from "@/components/layouts/Sidebar";
import { SocketReconnecting } from "@/components/common/SocketStatus";
import useAppStore from "@/store/appStore";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const { mobileMenuOpen } = useAppStore();

  return (
    <div
      className="
        min-h-dvh
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
            min-h-[calc(100dvh-4rem)]
            pt-20
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-7xl
              px-4
              pb-8
              lg:px-6
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
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;