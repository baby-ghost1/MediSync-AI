import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, HeartPulse, Shield, BrainCircuit, CalendarCheck2 } from "lucide-react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { loginSchema } from "@/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import ROUTES from "@/routes/routeConstants";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
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

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

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
    const result = await login(data);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setServerError(result.message || "Invalid email or password");
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[var(--background)]">
      {/* Left — Branding */}
      <div className="hidden flex-1 items-center justify-center lg:flex">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-lg"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--gradient-primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-lg)]">
            <HeartPulse size={32} />
          </div>

          <h1 className="mt-8 text-5xl font-bold tracking-tight leading-[1.1]">
            Welcome
            <br />
            <span className="gradient-text">Back</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-[var(--muted-foreground)]">
            Continue managing appointments, prescriptions, AI consultations
            and your healthcare records.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: BrainCircuit, text: "AI Powered Diagnosis" },
              { icon: Shield, text: "Encrypted Medical Records" },
              { icon: CalendarCheck2, text: "Instant Appointment Booking" },
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

      {/* Right — Form */}
      <div className="flex flex-1 items-center justify-center p-6 mt-10 bg-[var(--background)]">
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="relative w-full max-w-[420px]"
  >
    {/* Ambient Glow Effect */}
    <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-tr from-[var(--primary)]/20 via-transparent to-[var(--primary)]/10 blur-xl opacity-75" />

    <div className="relative rounded-[32px] border border-[var(--border)]/50 bg-[var(--card)]/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <div className="space-y-1.5">
          <motion.h2 variants={itemVariants} className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Welcome Back
          </motion.h2>
          <motion.p variants={itemVariants} className="text-sm text-[var(--muted-foreground)]">
            Enter your credentials to access your dashboard.
          </motion.p>
        </div>

        <motion.div variants={itemVariants}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="name@healthcare.com"
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

            <div className="flex justify-end">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-xs font-semibold text-[var(--primary)] hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              fullWidth
              size="lg"
              className="mt-2 font-bold shadow-lg shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              variant="gradient"
            >
              {isSubmitting ? "Authenticating..." : "Login to Dashboard"}
            </Button>
          </form>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <p className="text-xs text-[var(--muted-foreground)]">
            Don&apos;t have an account?{" "}
            <Link
              to={ROUTES.REGISTER}
              className="font-bold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
</div>
    </div>
  );
};

export default LoginPage;
