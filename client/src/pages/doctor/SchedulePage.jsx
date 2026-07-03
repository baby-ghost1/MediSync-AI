import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Save } from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/common/PageHeader";
import SectionLoader from "@/components/common/SectionLoader";
import doctorService from "@/services/doctor.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import useAuth from "@/hooks/useAuth";

const DAYS = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
];

const DEFAULT_AVAILABILITY = DAYS.map((day) => ({
  day,
  startTime: day === "sunday" ? "" : "09:00",
  endTime: day === "sunday" ? "" : "17:00",
  isAvailable: day !== "sunday",
}));

const DAY_LABELS = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
  thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

const SchedulePage = () => {
  const { user } = useAuth();
  const doctorId = user?.doctorId;

  const { data, isLoading, refetch } = useApiQuery({
    queryKey: ["doctor-profile", doctorId],
    queryFn: () => doctorService.getProfile(),
  });

  const doctor = data?.data || {};

  const availability = useMemo(() => {
    if (doctor.availability?.length > 0) return doctor.availability;
    return DEFAULT_AVAILABILITY;
  }, [doctor.availability]);

  // Use local state for edits without mutating server data
  const [localAvailability, setLocalAvailability] = useState(null);
  const activeAvailability = localAvailability ?? availability;

  const { mutate: saveSchedule, isLoading: saving } = useApiMutation({
    mutationFn: (avail) => doctorService.updateSchedule(doctorId, avail),
    onSuccess: () => { refetch(); toast.success("Schedule saved"); },
  });

  const updateSlot = (idx, field, value) => {
    setLocalAvailability((prev) => {
      const base = prev ?? availability;
      const updated = [...base];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <PageHeader
        title="Availability Schedule"
        description="Set your weekly consultation hours"
        action={
          <Button onClick={() => saveSchedule(activeAvailability)} loading={saving}>
            <Save size={16} /> Save Schedule
          </Button>
        }
      />

      {isLoading ? <SectionLoader /> : (
        <Card paddingSize="lg">
          <CardHeader title="Weekly Hours" description="Define your available time slots for each day" />
          <div className="mt-6 space-y-4">
            {activeAvailability.map((slot, idx) => (
              <div key={slot.day} className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex w-28 items-center gap-3">
                  <input
                    type="checkbox"
                    checked={slot.isAvailable}
                    onChange={(e) => updateSlot(idx, "isAvailable", e.target.checked)}
                    className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <label className="text-sm font-semibold text-[var(--foreground)]">{DAY_LABELS[slot.day]}</label>
                </div>
                {slot.isAvailable && (
                  <>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[var(--muted-foreground)]" />
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateSlot(idx, "startTime", e.target.value)}
                        className="w-28"
                      />
                    </div>
                    <span className="text-[var(--muted-foreground)]">to</span>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[var(--muted-foreground)]" />
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateSlot(idx, "endTime", e.target.value)}
                        className="w-28"
                      />
                    </div>
                  </>
                )}
                {!slot.isAvailable && (
                  <span className="text-sm text-[var(--muted-foreground)]">Unavailable</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default SchedulePage;
