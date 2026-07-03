import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  HeartPulse,
  UserRound,
  Shield,
  BrainCircuit,
  Cloud,
} from "lucide-react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { registerSchema } from "@/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import ROUTES from "@/routes/routeConstants";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
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

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "patient",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const selectedRole = useWatch({ control, name: "role" });

  const onSubmit = async (data) => {
    setServerError("");
    const payload = { ...data };
    delete payload.confirmPassword;
    delete payload.acceptTerms;
    const result = await registerUser(payload);
    if (result.success) {
      navigate(ROUTES.LOGIN, { state: { registered: true }, replace: true });
    } else {
      setServerError(result.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[var(--background)]">
      {/* Left — Branding */}
      <div className="hidden flex-1 items-center justify-center px-10 lg:flex">
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
            Join{" "}
            <span className="gradient-text">MediSync AI</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-[var(--muted-foreground)]">
            Create your account and experience AI-powered healthcare,
            appointments, prescriptions and digital medical records.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: BrainCircuit, text: "AI Medical Assistant" },
              { icon: Shield, text: "100% Secure Platform" },
              { icon: Cloud, text: "Cloud Health Records" },
              { icon: UserRound, text: "Hospital Management" },
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
      <div className="flex flex-1 items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-lg"
        >
          <div className="absolute -top-12 right-0 lg:right-auto lg:-top-14">
            <ThemeToggle />
          </div>

          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-xl)] sm:p-10">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                  Create Account
                </h2>
              </motion.div>
              <motion.div variants={itemVariants}>
                <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
                  Start your healthcare journey.
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  placeholder="John"
                  leftIcon={<User size={16} />}
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  leftIcon={<User size={16} />}
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>

              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                leftIcon={<Mail size={16} />}
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Phone (Optional)"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                leftIcon={<Phone size={16} />}
                error={errors.phone?.message}
                {...register("phone")}
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                  Register As
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "Patient", value: "patient" },
                    { label: "Doctor", value: "doctor" },
                  ].map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() =>
                        setValue("role", role.value, { shouldValidate: true })
                      }
                      className={`rounded-xl border p-3.5 transition-all duration-200 ${
                        selectedRole === role.value
                          ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm"
                          : "border-[var(--border)] hover:border-[var(--border-hover)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        <UserRound size={20} />
                        <span className="text-xs font-semibold">{role.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.role && (
                  <p className="mt-1.5 text-xs text-[var(--danger)]">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <Input
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                leftIcon={<Lock size={16} />}
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                leftIcon={<Lock size={16} />}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  {...register("acceptTerms")}
                  className="mt-0.5 h-4 w-4 rounded accent-[var(--primary)]"
                />
                <span className="text-xs text-[var(--muted-foreground)]">
                  I agree to the{" "}
                  <span className="font-semibold text-[var(--primary)]">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-[var(--primary)]">
                    Privacy Policy
                  </span>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-[var(--danger)]">
                  {errors.acceptTerms.message}
                </p>
              )}

              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-[var(--danger-light)] border border-[var(--danger)]/20 px-4 py-3 text-sm font-medium text-[var(--danger)]"
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
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
                </form>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="mt-6 text-center">
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Already have an account?
                  </p>
                  <Link
                    to={ROUTES.LOGIN}
                    className="mt-1.5 inline-block text-sm font-semibold text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
                  >
                    Login Instead
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
