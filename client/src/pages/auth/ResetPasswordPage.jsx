import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Lock,
  ArrowLeft,
  HeartPulse,
  ShieldCheck,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { resetPasswordSchema } from "@/schemas/auth.schema";
import authService from "@/services/auth.service";
import ROUTES from "@/routes/routeConstants";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const token = params.token || searchParams.get("token");
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const missingToken = !token;
  const timerRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    if (missingToken) {
      toast.error("Invalid reset token");
      return;
    }
    setServerError("");
    try {
      await authService.resetPassword({ token, password: data.password });
      setSuccess(true);
      toast.success("Password reset successfully");
      timerRef.current = setTimeout(() => {
        navigate(ROUTES.LOGIN, { replace: true });
      }, 3000);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to reset password. The link may have expired.";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      <div className="absolute -left-[180px] -top-[120px] h-[450px] w-[450px] rounded-full bg-[var(--primary)]/10 blur-[180px]" />
      <div className="absolute -right-[180px] -bottom-[150px] h-[450px] w-[450px] rounded-full bg-[var(--accent)]/10 blur-[180px]" />

      <div className="hidden flex-1 items-center justify-center px-10 lg:flex">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-xl"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-[30px] bg-[var(--gradient-primary)] text-white shadow-[var(--shadow-xl)]">
            <HeartPulse size={48} />
          </div>

          <h1 className="mt-10 text-6xl font-black leading-tight">
            Reset
            <br />
            Your Password
          </h1>

          <p className="mt-8 text-xl leading-relaxed text-[var(--muted-foreground)]">
            Choose a strong password that you haven't used before to keep
            your account secure.
          </p>

          <div className="mt-14 space-y-5">
            {[
              "End-to-End Encrypted",
              "Strong Password Required",
              "Instant Account Recovery",
              "Secure Authentication",
            ].map((item) => (
              <div key={item} className="flex items-center gap-4">
                <ShieldCheck size={20} className="text-[var(--primary)]" />
                <span className="text-base font-medium tracking-tight text-[var(--foreground)]">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-10 shadow-[var(--shadow-xl)]"
        >
          <div className="absolute right-6 top-6">
            <ThemeToggle />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">New Password</h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">Enter your new password below.</p>
            </motion.div>

            <motion.div variants={itemVariants}>
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-[var(--success)]/20 bg-[var(--success-light)] p-8 text-center"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)] text-white">
                    <CheckCircle2 size={36} />
                  </div>

                  <h3 className="mt-8 text-2xl font-bold tracking-tight text-[var(--success)]">
                    Password Reset Successfully
                  </h3>

                  <p className="mt-4 leading-relaxed text-[var(--muted-foreground)]">
                    Redirecting you to login...
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Min. 8 characters"
                    leftIcon={<Lock size={18} />}
                    error={errors.password?.message}
                    {...register("password")}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Re-enter your password"
                    leftIcon={<Lock size={18} />}
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />

                  {serverError && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-[var(--danger-light)] border border-[var(--danger)]/20 px-4 py-3 text-sm font-medium text-[var(--danger)]"
                    >
                      {serverError}
                    </motion.p>
                  )}

                  {missingToken && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-[var(--warning-light)] border border-[var(--warning)]/20 px-4 py-3 text-sm font-medium text-[var(--warning)]"
                    >
                      Invalid or missing reset token. Please request a new password reset link.
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={missingToken}
                    fullWidth
                    size="xl"
                    variant="gradient"
                    rightIcon={
                      isSubmitting ? (
                        <LoaderCircle size={18} className="animate-spin" />
                      ) : (
                        <ShieldCheck size={18} />
                      )
                    }
                  >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="mt-8 border-t border-[var(--border)] pt-8 text-center">
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
