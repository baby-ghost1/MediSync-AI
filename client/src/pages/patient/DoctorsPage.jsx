import { useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope, MapPin, Star, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import SectionLoader from "@/components/common/SectionLoader";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import doctorService from "@/services/doctor.service";
import { useApiQuery } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import ROUTES from "@/routes/routeConstants";

const specializations = ["All", "Cardiology", "Orthopedics", "Dermatology", "Neurology", "Pediatrics", "Ophthalmology", "ENT", "Dentistry"];

const DoctorsPage = () => {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const { data, isLoading, error, refetch } = useApiQuery({
    queryKey: ["doctors", { search: debouncedSearch, specialization, page, limit }],
    queryFn: () => doctorService.getDoctors({ search: debouncedSearch, specialization: specialization === "All" ? undefined : specialization, page, limit }),
  });

  const doctors = data?.doctors || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || doctors.length;

  if (error) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Find a Doctor"
        description="Browse and search for healthcare professionals"
      />

      <Card paddingSize="lg" className="border-[var(--border)]/70 bg-[var(--surface)]/80">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchInput value={search} onChange={setSearch} placeholder="Search doctors..." />
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => { setSpecialization(spec); setPage(1); }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  specialization === spec
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-lg)]"
                    : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {isLoading ? (
        <SectionLoader />
      ) : doctors.length === 0 ? (
        <EmptyState title="No doctors found" description="Try adjusting your search or filters" icon={Stethoscope} />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {doctors.map((doctor, i) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`${ROUTES.PATIENT.BOOK_APPOINTMENT}?doctor=${doctor._id}`}>
                  <Card className="h-full overflow-hidden border-[var(--border)]/70 bg-[linear-gradient(135deg,var(--surface),var(--surface-off))]" hover>
                    <div className="flex items-start gap-5">
                      <Avatar name={doctor.name} src={doctor.avatar} size="xl" />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{doctor.name}</h3>
                        <p className="mt-1 text-sm text-[var(--primary)]">{doctor.specialization}</p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                          <MapPin size={14} />
                          {doctor.location || doctor.hospital || "City Hospital"}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                          <Clock size={14} />
                          {doctor.experience || 5}+ years experience
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex items-center gap-1 text-[var(--warning)]">
                            <Star size={16} fill="currentColor" />
                            <span className="font-semibold text-[var(--foreground)]">{doctor.rating || 4.5}</span>
                          </div>
                          <Badge variant={doctor.available ? "success" : "secondary"}>
                            {doctor.available ? "Available" : "Busy"}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight size={20} className="mt-2 shrink-0 text-[var(--muted-foreground)]" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default DoctorsPage;
