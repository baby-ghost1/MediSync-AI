import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, Shield, Fingerprint, Server, Activity } from "lucide-react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { loginSchema } from "@/schemas/auth.schema";
import useAuthStore from "@/store/authStore";
import adminService from "@/services/admin.service";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const response = await adminService.login(data);
      const { token, refreshToken, user } = response;
      setAuth({ user, token, refreshToken, isAuthenticated: true });
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response
          ? `Server error (${error.response.status})`
          : "Cannot connect to server. Make sure the backend is running on port 5000.");
      setServerError(message);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[var(--background)]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-[var(--primary)]/10 blur-[180px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[var(--accent)]/8 blur-[180px]" />
        <div className="absolute inset-0 opacity-[0.02] [background-image:linear-gradient(to_right,var(--foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--foreground)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="hidden flex-1 flex-col items-center justify-center lg:flex">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-lg text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--gradient-primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-xl)] shadow-[var(--primary)]/30 ring-4 ring-[var(--primary)]/20">
            <Shield size={40} />
          </div>

          <h1 className="mt-8 text-5xl font-bold tracking-tight leading-[1.1]">
            Admin
            <br />
            <span className="gradient-text">Portal</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-[var(--muted-foreground)]">
            Authorized Personnel Only
          </p>

          <div className="mx-auto mt-10 inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-3">
            <Fingerprint size={18} className="text-[var(--primary)]" />
            <span className="text-sm font-medium text-[var(--muted-foreground)]">
              Secure Administrator Access
            </span>
          </div>

          <div className="mt-10 space-y-4 text-left">
            {[
              { icon: Server, text: "Full Platform Management" },
              { icon: Activity, text: "Real-time System Monitoring" },
              { icon: Shield, text: "Enterprise-Grade Security" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-light)]">
                  <item.icon size={16} className="text-[var(--primary)]" />
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 bg-[var(--background)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[420px]"
        >
          <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-tr from-[var(--primary)]/20 via-transparent to-[var(--primary)]/10 blur-xl opacity-75" />

          <div className="relative rounded-[32px] border border-[var(--border)]/50 bg-[var(--card)]/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="space-y-1.5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] text-[var(--primary-foreground)] shadow-lg mb-4">
                  <Shield size={28} />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
                  Administrator Login
                </h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Enter your admin credentials to access the control panel.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="space-y-4">
                  <Input
                    label="Admin Email"
                    type="email"
                    placeholder="admin@medisync.ai"
                    leftIcon={<Mail size={18} className="text-[var(--muted-foreground)]" />}
                    error={errors.email?.message}
                    className="bg-[var(--background)]/50 focus:bg-[var(--background)] transition-all"
                    {...register("email")}
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    leftIcon={<Lock size={18} className="text-[var(--muted-foreground)]" />}
                    error={errors.password?.message}
                    className="bg-[var(--background)]/50 focus:bg-[var(--background)] transition-all"
                    {...register("password")}
                  />
                </div>

                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="rounded-xl bg-[var(--danger-light)] border border-[var(--danger)]/20 px-4 py-3 text-xs font-medium text-[var(--danger)]"
                  >
                    {serverError}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  loading={isSubmitting}
                  fullWidth
                  size="lg"
                  variant="gradient"
                >
                  {isSubmitting ? "Authenticating..." : "Access Admin Panel"}
                </Button>
              </form>

              <div className="border-t border-[var(--border)] pt-6 text-center">
                <a
                  href="/"
                  className="text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  &larr; Back to Main Site
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;