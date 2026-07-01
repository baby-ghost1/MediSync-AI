import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/hooks/useSocket";
import useSocketStore from "@/store/socketStore";

const toastStyles = { duration: 4000, style: { borderRadius: "12px", padding: "12px 16px", fontSize: "14px" } };

export const useSocketEvents = () => {
  const { isConnected, on } = useSocket();
  const queryClient = useQueryClient();
  const { setLastEvent } = useSocketStore();

  const showNotification = useCallback((notification) => {
    const { type, title, message } = notification;
    const iconMap = { appointment: "\uD83D\uDCC5", report: "\uD83D\uDCCB", prescription: "\uD83D\uDC8A", message: "\uD83D\uDCAC", system: "\uD83D\uDD14", alert: "\u26A0\uFE0F" };
    const icon = iconMap[type] || "\uD83D\uDD14";
    toast(`${icon} ${title || message || "New notification"}`, { ...toastStyles, id: `notif-${notification?._id || Date.now()}` });
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    const unsubs = [];

    unsubs.push(on("notification", (notification) => {
      setLastEvent({ type: "notification", timestamp: Date.now() });
      showNotification(notification);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
    }));

    unsubs.push(on("appointment:created", () => {
      setLastEvent({ type: "appointment:created", timestamp: Date.now() });
      toast.success("New appointment scheduled", toastStyles);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["patient", "dashboard"] });
    }));

    unsubs.push(on("appointment:updated", (data) => {
      setLastEvent({ type: "appointment:updated", timestamp: Date.now() });
      toast(`\uD83D\uDCC5 ${data?.status ? `Appointment ${data.status}` : "Appointment updated"}`, toastStyles);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["patient", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    }));

    unsubs.push(on("appointment:cancelled", () => {
      setLastEvent({ type: "appointment:cancelled", timestamp: Date.now() });
      toast.error("Appointment cancelled", toastStyles);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["patient", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", "dashboard"] });
    }));

    unsubs.push(on("doctor:status", () => {
      setLastEvent({ type: "doctor:status", timestamp: Date.now() });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor"] });
    }));

    unsubs.push(on("doctor:availability", () => {
      setLastEvent({ type: "doctor:availability", timestamp: Date.now() });
      queryClient.invalidateQueries({ queryKey: ["doctors", "available"] });
    }));

    unsubs.push(on("patient:updated", (data) => {
      setLastEvent({ type: "patient:updated", timestamp: Date.now() });
      if (data?.patientId) queryClient.invalidateQueries({ queryKey: ["patients", data.patientId] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    }));

    unsubs.push(on("dashboard:update", () => {
      setLastEvent({ type: "dashboard:update", timestamp: Date.now() });
      queryClient.invalidateQueries({ queryKey: ["patient", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    }));

    unsubs.push(on("prescription:created", () => {
      setLastEvent({ type: "prescription:created", timestamp: Date.now() });
      toast("\uD83D\uDC8A New prescription issued", toastStyles);
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    }));

    unsubs.push(on("report:uploaded", () => {
      setLastEvent({ type: "report:uploaded", timestamp: Date.now() });
      toast("\uD83D\uDCCB New report uploaded", toastStyles);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    }));

    unsubs.push(on("reconnect", () => {
      toast.success("Reconnected to server", { duration: 2000, ...toastStyles });
    }));

    return () => { unsubs.forEach((u) => u?.()); };
  }, [isConnected, on, queryClient, setLastEvent, showNotification]);
};

export default useSocketEvents;
