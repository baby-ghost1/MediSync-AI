import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, User, CalendarDays, ChevronRight } from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import SectionLoader from "@/components/common/SectionLoader";
import EmptyState from "@/components/ui/EmptyState";
import doctorService from "@/services/doctor.service";
import { useApiQuery } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import ROUTES from "@/routes/routeConstants";

const PatientsPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({ search: debouncedSearch || undefined, page, limit }), [debouncedSearch, page, limit]);

  const { data, isLoading } = useApiQuery({
    queryKey: ["doctor-patients", params],
    queryFn: () => doctorService.getMyPatients(params),
  });

  const patients = data?.patients || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || patients.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <PageHeader title="My Patients" description="Manage your patient roster" />

      <Card paddingSize="lg">
        <SearchInput value={search} onChange={setSearch} placeholder="Search patients by name, email..." />
      </Card>

      {isLoading ? <SectionLoader /> : patients.length === 0 ? (
        <EmptyState title="No patients found" description={search ? "Try a different search" : "No patients assigned yet"} icon={Users} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {patients.map((patient, i) => {
              const p = patient.patient || patient;
              return (
                <Link key={patient._id} to={`${ROUTES.DOCTOR.PATIENTS}/${p._id || patient._id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:shadow-[var(--shadow-xl)]"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar name={p.name} src={p.avatar} size="lg" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold truncate text-[var(--text-primary)]">{p.name || "Patient"}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{p.email}</p>
                      </div>
                      <ChevronRight size={18} className="shrink-0 text-[var(--text-muted)] transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
                      {p.age && <span className="flex items-center gap-1"><User size={14} /> {p.age} yrs</span>}
                      {p.gender && <span className="capitalize">{p.gender}</span>}
                      {p.bloodGroup && <Badge variant="secondary" size="xs">{p.bloodGroup}</Badge>}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      {p.lastVisit && (
                        <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <CalendarDays size={12} /> Last: {new Date(p.lastVisit).toLocaleDateString()}
                        </span>
                      )}
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

export default PatientsPage;
