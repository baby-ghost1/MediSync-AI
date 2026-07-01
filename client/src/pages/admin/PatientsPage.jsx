import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import StatusBadge from "@/components/common/StatusBadge";
import SectionLoader from "@/components/common/SectionLoader";
import EmptyState from "@/components/ui/EmptyState";
import patientService from "@/services/patient.service";
import { useApiQuery } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

const PatientsPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({ search: debouncedSearch || undefined, page, limit }), [debouncedSearch, page, limit]);

  const { data, isLoading } = useApiQuery({
    queryKey: ["admin-patients", params],
    queryFn: () => patientService.getPatients(params),
  });

  const patients = data?.patients || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || patients.length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader title="Patients" description="View all registered patients" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card paddingSize="lg">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name, email..." />
        </Card>
      </motion.div>

      {isLoading ? <SectionLoader /> : patients.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyState title="No patients found" description={search ? "Try a different search" : "No patients registered"} icon={Users} />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-off)]">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Patient</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Age/Gender</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Blood Group</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {patients.map((patient, i) => (
                    <motion.tr key={patient._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="bg-[var(--surface)] transition-all duration-200 hover:bg-[var(--surface-off)]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={patient.name} src={patient.avatar} size="md" />
                          <span className="font-semibold text-[var(--text-primary)]">{patient.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{patient.email}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{patient.age ? `${patient.age} yrs` : "N/A"} &middot; {patient.gender || "N/A"}</td>
                      <td className="px-6 py-4"><Badge variant="secondary" size="xs">{patient.bloodGroup || "N/A"}</Badge></td>
                      <td className="px-6 py-4"><StatusBadge status={patient.status || "active"} size="xs" /></td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "N/A"}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default PatientsPage;
