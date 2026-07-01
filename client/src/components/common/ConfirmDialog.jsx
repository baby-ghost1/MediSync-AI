import { motion } from "framer-motion";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle, Info, AlertOctagon } from "lucide-react";

const variantConfig = {
  danger: {
    icon: AlertOctagon,
    bg: "bg-red-50 dark:bg-red-950/30",
    iconColor: "text-red-600 dark:text-red-400",
    ring: "ring-1 ring-red-200 dark:ring-red-900/50",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    ring: "ring-1 ring-amber-200 dark:ring-amber-900/50",
  },
  info: {
    icon: Info,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    ring: "ring-1 ring-blue-200 dark:ring-blue-900/50",
  },
};

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) => {
  const config = variantConfig[variant] || variantConfig.danger;
  const Icon = config.icon;

  return (
    <Modal open={open} onClose={onClose} size="sm" showCloseButton={false}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className="py-7 text-center"
      >
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${config.bg} ${config.ring}`}>
          <Icon size={28} className={config.iconColor} />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted-foreground)]">{description}</p>

        <div className="mt-7 flex items-center justify-center gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ConfirmDialog;
