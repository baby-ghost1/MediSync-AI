import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Clock, ChevronRight, Filter } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/components/common/StatusBadge";
import SectionLoader from "@/components/common/SectionLoader";
import EmptyState from "@/components/ui/EmptyState";
import appointmentService from "@/services/appointment.service";
import { useApiQuery } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import ROUTES from "@/routes/routeConstants";

const statusFilters = ["All", "upcoming", "confirmed", "pending", "completed", "cancelled"];

const MyAppointmentsPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({
    search: debouncedSearch || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
    page,
    limit,
  }), [debouncedSearch, statusFilter, page, limit]);

  const { data, isLoading } = useApiQuery({
    queryKey: ["appointments", params],
    queryFn: () => appointmentService.getAppointments(params),
  });

  const appointments = data?.appointments || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || appointments.length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Appointments"
        description="Manage your healthcare appointments"
        actions={
          <Link to={ROUTES.PATIENT.BOOK_APPOINTMENT}>
            <Button variant="gradient" leftIcon={<CalendarDays size={18} />}>
              Book New
            </Button>
          </Link>
        }
      />

      <Card paddingSize="lg" className="overflow-hidden border-0 bg-[linear-gradient(135deg,var(--primary),var(--accent))] text-white shadow-[var(--shadow-lg)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">Care coordination</p>
            <h2 className="mt-2 text-xl font-semibold">Stay ahead of every appointment</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              Track your upcoming visits, review status at a glance and keep your healthcare plan moving smoothly.
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-white/15 px-4 py-3 backdrop-blur-xl">
            <p className="text-sm font-semibold">{appointments.length} active appointment{appointments.length === 1 ? "" : "s"}</p>
          </div>
        </div>
      </Card>

      <Card paddingSize="lg" className="border-[var(--border)]/70 bg-[var(--surface)]/80">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search appointments..." />

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Filter size={16} /> Status:
            </span>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                    statusFilter === s
                      ? "bg-[var(--primary)] text-white shadow-[var(--shadow-sm)]"
                      : "border border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <SectionLoader />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description={search || statusFilter !== "All" ? "Try adjusting your filters" : "Book your first appointment to get started"}
          icon={CalendarDays}
          actionText={!search && statusFilter === "All" ? "Book Appointment" : undefined}
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((apt, i) => (
            <Link key={apt._id} to={`${ROUTES.PATIENT.APPOINTMENTS}/${apt._id}`}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.01 }}
                className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-[var(--border)]/80 bg-[linear-gradient(135deg,var(--surface),var(--surface-off))] p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-5">
                  <Avatar name={apt.doctor?.firstName && apt.doctor?.lastName ? `${apt.doctor.firstName} ${apt.doctor.lastName}` : apt.doctor?.name || "Doctor"} src={apt.doctor?.avatar} size="lg" />
                  <div>
                    <h3 className="text-lg font-bold text-[var(--foreground)]">{apt.doctor?.firstName && apt.doctor?.lastName ? `${apt.doctor.firstName} ${apt.doctor.lastName}` : apt.doctor?.name || "Doctor"}</h3>
                    <p className="text-sm text-[var(--primary)]">{apt.doctor?.specialization || "General"}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {new Date(apt.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {apt.time}
                      </span>
                      {apt.type && (
                        <Badge variant="secondary" size="xs">{apt.type}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={apt.status} />
                  <ChevronRight size={20} className="text-[var(--muted-foreground)]" />
                </div>
              </motion.div>
            </Link>
          ))}

          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
