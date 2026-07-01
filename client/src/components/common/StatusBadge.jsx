import Badge from "@/components/ui/Badge";

const statusMap = {
  confirmed: { variant: "primary", label: "Confirmed" },
  pending: { variant: "warning", label: "Pending" },
  cancelled: { variant: "danger", label: "Cancelled" },
  completed: { variant: "success", label: "Completed" },
  "in-progress": { variant: "info", label: "In Progress" },
  dispensed: { variant: "success", label: "Dispensed" },
  active: { variant: "success", label: "Active" },
  inactive: { variant: "secondary", label: "Inactive" },
  read: { variant: "secondary", label: "Read" },
  unread: { variant: "primary", label: "Unread" },
  today: { variant: "gradient", label: "Today" },
  tomorrow: { variant: "info", label: "Tomorrow" },
  upcoming: { variant: "primary", label: "Upcoming" },
  verified: { variant: "success", label: "Verified" },
};

const StatusBadge = ({ status, label, ...props }) => {
  const config = statusMap[status?.toLowerCase()] || { variant: "secondary", label: label || status };
  return <Badge variant={config.variant} {...props}>{config.label}</Badge>;
};

export default StatusBadge;
