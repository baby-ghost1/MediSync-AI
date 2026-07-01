import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = ({
  collapsed = false,
  size = "md",
}) => {
  const logoSize = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
    xl: "h-16 w-16",
  };

  const iconSize = {
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  };

  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-4"
    >
      <motion.div
        whileHover={{
          rotate: 360,
          scale: 1.05,
        }}
        transition={{
          duration: 0.8,
        }}
        className={`
relative

${logoSize[size]}

flex

items-center
justify-center

overflow-hidden

rounded-2xl

bg-gradient-to-br

from-sky-500

via-blue-600

to-indigo-700

shadow-[0_15px_40px_rgba(37,99,235,0.35)]
`}
      >
        {/* Glow */}

        <div
          className="
absolute

inset-0

bg-gradient-to-br

from-white/30

to-transparent
"
        />

        {/* Animated Blur */}

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          }}
          className="
absolute

-left-8

top-0

h-20

w-6

rotate-12

bg-white/20

blur-lg
"
        />

        <HeartPulse
          size={iconSize[size]}
          className="relative z-10 text-white drop-shadow-sm"
        />
      </motion.div>

      {!collapsed && (
        <motion.div
          initial={{
            opacity: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <h2
            className="
text-2xl

font-bold

tracking-tight

bg-gradient-to-r

from-blue-700

via-cyan-600

to-indigo-700

bg-clip-text

text-transparent

dark:from-blue-400

dark:via-cyan-300

dark:to-indigo-300
"
          >
            MediSync
          </h2>

          <p
            className="
text-xs

font-semibold

tracking-[0.2em]

uppercase

text-slate-400

dark:text-slate-500
"
          >
            AI HEALTHCARE
          </p>
        </motion.div>
      )}
    </Link>
  );
};

export default Logo;
