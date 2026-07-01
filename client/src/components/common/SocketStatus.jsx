import { motion } from "framer-motion";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { cn } from "@/utils/cn";
import useSocketStore from "@/store/socketStore";

const SocketStatus = ({ className }) => {
  const { isConnected } = useSocketStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300",
        isConnected
          ? "bg-[var(--success)]/10 text-[var(--success)] ring-1 ring-[var(--success)]/20"
          : "bg-[var(--danger)]/10 text-[var(--danger)] ring-1 ring-[var(--danger)]/20",
        className
      )}
    >
      {isConnected ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
          </span>
          <span>Live</span>
        </>
      ) : (
        <>
          <WifiOff size={12} className="text-[var(--danger)]" />
          <span>Disconnected</span>
        </>
      )}
    </motion.div>
  );
};

const SocketReconnecting = ({ className }) => {
  const { isConnected, connectionAttempts } = useSocketStore();

  if (isConnected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "fixed left-1/2 top-4 z-[9999] -translate-x-1/2",
        "flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 shadow-lg ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/50",
        className
      )}
    >
      <RefreshCw size={14} className="animate-spin" />
      <span>Reconnecting{connectionAttempts > 0 ? ` (attempt ${connectionAttempts})` : ""}...</span>
    </motion.div>
  );
};

export { SocketStatus, SocketReconnecting };
export default SocketStatus;
