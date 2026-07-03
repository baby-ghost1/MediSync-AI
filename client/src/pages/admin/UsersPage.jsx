import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users, Shield, ShieldOff, Trash2,
} from "lucide-react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import StatusBadge from "@/components/common/StatusBadge";
import { TableSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import adminService from "@/services/admin.service";
import { useApiQuery, useApiMutation } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

const roleFilters = ["All", "patient", "doctor", "admin"];
const statusFilters = ["All", "active", "pending", "blocked"];

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

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debouncedSearch = useDebounce(search);
  const { page, setPage, limit } = usePagination();

  const params = useMemo(() => ({
    search: debouncedSearch || undefined,
    role: roleFilter !== "All" ? roleFilter : undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
    page, limit,
  }), [debouncedSearch, roleFilter, statusFilter, page, limit]);

  const { data, isLoading, refetch } = useApiQuery({
    queryKey: ["admin-users", params],
    queryFn: () => adminService.getUsers(params),
  });

  const { mutate: verifyUser } = useApiMutation({
    mutationFn: (id) => adminService.verifyUser(id),
    onSuccess: () => { refetch(); },
    successMessage: "User verified",
  });

  const { mutate: blockUser } = useApiMutation({
    mutationFn: (id) => adminService.blockUser(id),
    onSuccess: () => { refetch(); },
    successMessage: "User blocked",
  });

  const { mutate: deleteUser, isPending: isDeleting } = useApiMutation({
    mutationFn: () => adminService.deleteUser(deleteTarget),
    onSuccess: () => { setDeleteTarget(null); refetch(); },
    successMessage: "User deleted",
  });

  const users = data?.users || data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || users.length;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader title="User Management" description="Manage all platform users" />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card paddingSize="lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by name, email..." />
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--text-secondary)]">Role:</span>
                {roleFilters.map((r) => (
                  <button key={r} onClick={() => { setRoleFilter(r); setPage(1); }}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
                      roleFilter === r
                        ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                        : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] bg-[var(--surface)]"
                    }`}
                  >{r.charAt(0).toUpperCase() + r.slice(1)}</button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--text-secondary)]">Status:</span>
                {statusFilters.map((s) => (
                  <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
                      statusFilter === s
                        ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                        : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]/50 hover:text-[var(--primary)] bg-[var(--surface)]"
                    }`}
                  >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {isLoading ? <TableSkeleton rows={6} cols={6} /> : users.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyState title="No users found" description={search || roleFilter !== "All" || statusFilter !== "All" ? "Try adjusting filters" : "No users registered yet"} icon={Users} />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-off)]">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Joined</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {users.map((user, i) => (
                    <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="bg-[var(--surface)] transition-all duration-200 hover:bg-[var(--surface-off)]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name || `${user.firstName} ${user.lastName}`} src={user.avatar} size="md" />
                          <span className="font-semibold text-[var(--text-primary)]">{user.name || `${user.firstName} ${user.lastName}`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{user.email}</td>
                      <td className="px-6 py-4"><Badge variant={user.role === "admin" ? "gradient" : user.role === "doctor" ? "primary" : "secondary"} size="xs" className="capitalize">{user.role}</Badge></td>
                      <td className="px-6 py-4"><StatusBadge status={user.status || (user.isVerified ? "active" : "pending")} size="xs" /></td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {user.role !== "admin" && !user.isVerified && (
                            <Button variant="ghost" size="icon" onClick={() => verifyUser(user._id)}><Shield size={16} className="text-[var(--success)]" /></Button>
                          )}
                          {user.role !== "admin" && user.status !== "blocked" && (
                            <Button variant="ghost" size="icon" onClick={() => blockUser(user._id)}><ShieldOff size={16} className="text-[var(--warning)]" /></Button>
                          )}
                          {user.role !== "admin" && (
                            <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(user._id)}><Trash2 size={16} className="text-[var(--danger)]" /></Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </motion.div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteUser}
        title="Delete User?" description="This action is permanent. All user data will be removed." loading={isDeleting} />
    </motion.div>
  );
};

export default UsersPage;
