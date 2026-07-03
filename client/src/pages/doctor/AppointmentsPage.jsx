import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Clock, ChevronRight, Filter } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/components/common/StatusBadge";
import { ListSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import appointmentService from "@/services/appointment.service";
import { useApiQuery } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import ROUTES from "@/routes/routeConstants";

const statusFilters = ["All", "pending", "confirmed", "completed", "cancelled"];

const AppointmentsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({
    search: debouncedSearch || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
    page, limit,
  }), [debouncedSearch, statusFilter, page, limit]);

  const { data, isLoading } = useApiQuery({
    queryKey: ["doctor-appointments", params],
    queryFn: () => appointmentService.getAppointments(params),
  });

  const appointments = data?.appointments || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || appointments.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <PageHeader title="Appointments" description="Manage your patient appointments" />

      <Card paddingSize="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search appointments..." />
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><Filter size={16} /> Status:</span>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((s) => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                    statusFilter === s ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm" : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}
                >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {isLoading ? <ListSkeleton items={6} /> : appointments.length === 0 ? (
        <EmptyState title="No appointments found" description={search || statusFilter !== "All" ? "Try adjusting your filters" : "No appointments scheduled"} icon={CalendarDays} />
      ) : (
        <>
          <div className="space-y-4">
              {appointments.map((apt, i) => {
              const patient = apt.patient || {};
              const patientName = patient.firstName && patient.lastName ? `${patient.firstName} ${patient.lastName}` : patient.name || "Patient";
              return (
                <Link key={apt._id} to={`${ROUTES.DOCTOR.APPOINTMENTS}/${apt._id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -2, scale: 1.005 }}
                    className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:shadow-[var(--shadow-lg)] md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-5">
                      <Avatar name={patientName} src={patient.avatar} size="lg" />
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">{patientName}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{apt.reason || apt.type || "Consultation"}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
                          <span className="flex items-center gap-1"><CalendarDays size={14} />{new Date(apt.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock size={14} />{apt.time}</span>
                          {apt.type && <Badge variant="secondary" size="xs">{apt.type}</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={apt.status} />
                      <ChevronRight size={20} className="text-[var(--text-muted)] transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </>
      )}
    </motion.div>
  );
};

export default AppointmentsPage;
