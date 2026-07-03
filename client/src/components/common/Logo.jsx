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

bg-[var(--gradient-primary)]

shadow-[var(--shadow-lg)]
`}
      >
        {/* Glow */}

        <div
          className="
absolute

inset-0

bg-gradient-to-br

from-[var(--primary-foreground)]/30

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

bg-[var(--primary-foreground)]/20

blur-lg
"
        />

        <HeartPulse
          size={iconSize[size]}
          className="relative z-10 text-[var(--primary-foreground)] drop-shadow-sm"
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

bg-[var(--gradient-primary)]

bg-clip-text

text-transparent
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

text-[var(--muted-foreground)]
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
