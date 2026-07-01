import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, HeartPulse, ShieldCheck, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { forgotPasswordSchema } from "@/schemas/auth.schema";
import authService from "@/services/auth.service";
import ROUTES from "@/routes/routeConstants";

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

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
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    try {
      await authService.forgotPassword(data.email);
      setSentEmail(data.email);
      setSent(true);
      toast.success("Reset link sent to your email");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send reset link";
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
            Forgot
            <br />
            Password?
          </h1>

          <p className="mt-8 text-xl leading-relaxed text-[var(--muted-foreground)]">
            Don't worry. Enter your registered email address and we'll send
            you a secure password reset link.
          </p>

          <div className="mt-14 space-y-5">
            {[
              "Secure Email Verification",
              "Encrypted Reset Link",
              "Expires Automatically",
              "Fast Account Recovery",
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
              <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Reset Password</h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">We'll email you a reset link.</p>
            </motion.div>

            <motion.div variants={itemVariants}>
              {!sent ? (
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" noValidate>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    leftIcon={<Mail size={18} />}
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    fullWidth
                    size="xl"
                    variant="gradient"
                    rightIcon={
                      isSubmitting ? (
                        <LoaderCircle size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )
                    }
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-[var(--success)]/20 bg-[var(--success-light)] p-8 text-center"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)] text-white">
                    <Send size={36} />
                  </div>

                  <h3 className="mt-8 text-2xl font-bold tracking-tight text-[var(--success)]">
                    Email Sent Successfully
                  </h3>

                  <p className="mt-4 leading-relaxed text-[var(--muted-foreground)]">
                    We've sent a password reset link to
                  </p>

                  <p className="mt-2 font-semibold text-[var(--primary)]">{sentEmail}</p>

                  <Button
                    type="button"
                    className="mt-10"
                    fullWidth
                    variant="gradient"
                    onClick={() => setSent(false)}
                  >
                    Send Again
                  </Button>
                </motion.div>
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

export default ForgotPasswordPage;
