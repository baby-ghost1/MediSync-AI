import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CalendarDays, Stethoscope, MessageSquare, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/common/PageHeader";
import SectionLoader from "@/components/common/SectionLoader";
import appointmentService from "@/services/appointment.service";
import doctorService from "@/services/doctor.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import ROUTES from "@/routes/routeConstants";

const schema = z.object({
  doctorId: z.string().min(1, "Please select a doctor"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  reason: z.string().min(10, "Please provide a brief reason (at least 10 characters)"),
  notes: z.string().optional().or(z.literal("")),
});

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDoctor = searchParams.get("doctor");

  const [selectedDoctor, setSelectedDoctor] = useState(preselectedDoctor || "");
  const [step, setStep] = useState(preselectedDoctor ? 2 : 1);

  const { data: doctorsData, isLoading: loadingDoctors } = useApiQuery({
    queryKey: ["doctors", "available"],
    queryFn: () => doctorService.getAvailableDoctors(),
  });

  const doctors = doctorsData?.doctors || doctorsData?.data || [];

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { doctorId: preselectedDoctor || "", date: "", time: "", reason: "", notes: "" },
  });

  const { mutate: bookAppointment, isPending } = useApiMutation({
    mutationFn: (data) => appointmentService.createAppointment(data),
    onSuccess: () => {
      toast.success("Appointment booked successfully");
      navigate(ROUTES.PATIENT.APPOINTMENTS);
    },
    successMessage: "Appointment confirmed",
  });

  const handleSelectDoctor = (id) => {
    setSelectedDoctor(id);
    setValue("doctorId", id, { shouldValidate: true });
    setStep(2);
  };

  const selectedDoctorData = doctors.find((d) => d._id === selectedDoctor);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Book Appointment"
        description="Schedule a consultation with a healthcare professional"
        actions={
          step > 1 && (
            <Button variant="ghost" onClick={() => setStep(1)} leftIcon={<ArrowLeft size={18} />}>
              Back
            </Button>
          )
        }
      />

      {loadingDoctors ? <SectionLoader /> : (
        <div className="grid gap-8 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-3">
            <Card paddingSize="lg" className="overflow-hidden border-0 bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-[var(--primary-foreground)] shadow-[var(--shadow-lg)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--primary-foreground)]/70">Appointment flow</p>
                  <h2 className="mt-2 text-xl font-semibold">Book care in a few guided steps</h2>
                  <p className="mt-2 max-w-2xl text-sm text-[var(--primary-foreground)]/75">Choose a specialist, confirm a time and share the reason for your visit with confidence.</p>
                </div>
                <div className="rounded-[var(--radius-lg)] bg-[var(--primary-foreground)]/15 px-4 py-3 backdrop-blur-xl">
                  <p className="text-sm font-semibold">Step {step} of 2</p>
                </div>
              </div>
            </Card>
          </div>
          <div className="space-y-6 xl:col-span-2">
            {step === 1 ? (
              <>
                <Card>
                  <CardHeader title="Select a Doctor" subtitle="Choose from available healthcare professionals" />
                  <div className="grid gap-4 md:grid-cols-2">
                    {doctors.length === 0 ? (
                      <p className="col-span-2 py-10 text-center text-[var(--muted-foreground)]">No doctors available at the moment</p>
                    ) : (
                      doctors.map((doctor) => (
                        <motion.div
                          key={doctor._id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleSelectDoctor(doctor._id)}
                          className={`cursor-pointer rounded-[var(--radius-xl)] border-2 p-5 shadow-[var(--shadow-sm)] transition-all duration-300 ${
                            selectedDoctor === doctor._id
                              ? "border-[var(--primary)] bg-[var(--primary-light)]"
                              : "border-[var(--border)] bg-[linear-gradient(135deg,var(--surface),var(--surface-off))] hover:border-[var(--primary)]/50"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <Avatar name={doctor.name} src={doctor.avatar} size="lg" />
                            <div>
                              <h3 className="font-bold">{doctor.name}</h3>
                              <p className="text-sm text-[var(--primary)]">{doctor.specialization}</p>
                              <p className="mt-1 text-xs text-[var(--muted-foreground)]">{doctor.experience || 5}+ years</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <Badge variant={doctor.available ? "success" : "secondary"}>
                              {doctor.available ? "Available Today" : "Next: Tomorrow"}
                            </Badge>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <form onSubmit={handleSubmit((d) => bookAppointment(d))} className="space-y-6">
                {selectedDoctorData && (
                  <Card>
                    <CardHeader title="Selected Doctor" />
                    <div className="flex items-center gap-5">
                      <Avatar name={selectedDoctorData.name} src={selectedDoctorData.avatar} size="lg" />
                      <div>
                        <h3 className="text-lg font-bold">{selectedDoctorData.name}</h3>
                        <p className="text-sm text-[var(--primary)]">{selectedDoctorData.specialization}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="ml-auto">
                        Change
                      </Button>
                    </div>
                  </Card>
                )}

                <Card>
                  <CardHeader title="Appointment Details" />
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Date"
                      type="date"
                      leftIcon={<CalendarDays size={18} />}
                      min={new Date().toISOString().split("T")[0]}
                      error={errors.date?.message}
                      {...register("date")}
                    />
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Time Slot</label>
                      <select
                        {...register("time")}
                        className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-3 text-sm text-[var(--foreground)] transition-all duration-300 focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {errors.time && <p className="mt-2 text-sm text-[var(--danger)]">{errors.time.message}</p>}
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader title="Reason for Visit" />
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Reason</label>
                      <textarea
                        {...register("reason")}
                        rows={3}
                        placeholder="Describe your symptoms or reason for consultation..."
                        className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--foreground)] transition-all duration-300 focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20"
                      />
                      {errors.reason && <p className="mt-2 text-sm text-[var(--danger)]">{errors.reason.message}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Additional Notes (Optional)</label>
                      <textarea
                        {...register("notes")}
                        rows={2}
                        placeholder="Any additional information..."
                        className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--foreground)] transition-all duration-300 focus:border-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20"
                      />
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => navigate(ROUTES.PATIENT.APPOINTMENTS)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={isPending} variant="gradient" size="lg">
                    {isPending ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <Card variant="gradient" className="text-[var(--primary-foreground)]">
              <Stethoscope size={36} />
              <h3 className="mt-4 text-xl font-bold">Appointment Tips</h3>
              <ul className="mt-4 space-y-3 text-sm text-[var(--primary-foreground)]/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--card-foreground)]" />
                  Arrive 15 minutes early
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--card-foreground)]" />
                  Bring previous medical records
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--card-foreground)]" />
                  List your symptoms clearly
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--card-foreground)]" />
                  24-hour cancellation policy
                </li>
              </ul>
            </Card>

            <Card>
              <CardHeader title="Need Help?" />
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                Contact our support team for assistance with booking or rescheduling appointments.
              </p>
              <Button variant="outline" className="mt-4" fullWidth leftIcon={<MessageSquare size={18} />}>
                Contact Support
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointmentPage;
