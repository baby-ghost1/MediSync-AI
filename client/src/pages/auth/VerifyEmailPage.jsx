import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HeartPulse,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  LoaderCircle,
  ArrowLeft,
} from "lucide-react";

import ThemeToggle from "@/components/ui/ThemeToggle";
import authService from "@/services/auth.service";
import ROUTES from "@/routes/routeConstants";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const token = params.token || searchParams.get("token");
  const [status, setStatus] = useState(() => (token ? "verifying" : "error"));
  const [errorMessage, setErrorMessage] = useState(() =>
    token ? "" : "Invalid or missing verification token."
  );

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

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    let navTimer = null;

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        if (!cancelled) {
          setStatus("success");
          navTimer = setTimeout(() => {
            navigate(ROUTES.LOGIN, { replace: true });
          }, 4000);
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(
            error.response?.data?.message ||
              "Verification failed. The link may have expired or is invalid."
          );
        }
      }
    };

    const timer = setTimeout(verify, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (navTimer) clearTimeout(navTimer);
    };
  }, [token, navigate]);

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
            Email
            <br />
            Verification
          </h1>

          <p className="mt-8 text-xl leading-relaxed text-[var(--muted-foreground)]">
            Verify your email address to activate your account and access
            all MediSync AI features.
          </p>

          <div className="mt-14 space-y-5">
            {[
              "Secure Email Verification",
              "Instant Account Activation",
              "Protected Data Access",
              "Full Platform Access",
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
            {status === "verifying" && (
              <motion.div variants={itemVariants}>
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center">
                    <LoaderCircle size={64} className="animate-spin text-[var(--primary)]" />
                  </div>

                  <h2 className="mt-8 text-2xl font-bold tracking-tight text-[var(--foreground)]">Verifying Email</h2>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    Please wait while we verify your email address...
                  </p>
                </div>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div variants={itemVariants}>
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--success)] text-white shadow-[var(--shadow-lg)]">
                    <CheckCircle2 size={56} />
                  </div>

                  <h2 className="mt-8 text-2xl font-bold tracking-tight text-[var(--success)]">
                    Email Verified Successfully
                  </h2>

                  <p className="mt-4 leading-relaxed text-[var(--muted-foreground)]">
                    Your email has been verified. You can now access all MediSync AI
                    features.
                  </p>

                  <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                    Redirecting to login...
                  </p>

                  <Link
                    to={ROUTES.LOGIN}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
                  >
                    <ArrowLeft size={16} />
                    Go to Login
                  </Link>
                </div>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div variants={itemVariants}>
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--danger)] text-white shadow-[var(--shadow-lg)]">
                    <XCircle size={56} />
                  </div>

                  <h2 className="mt-8 text-2xl font-bold tracking-tight text-[var(--danger)]">
                    Verification Failed
                  </h2>

                  <p className="mt-4 leading-relaxed text-[var(--muted-foreground)]">
                    {errorMessage}
                  </p>

                  <div className="mt-8 space-y-3">
                    <Link
                      to={ROUTES.LOGIN}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
                    >
                      <ArrowLeft size={16} />
                      Go to Login
                    </Link>

                    <p className="text-sm text-[var(--muted-foreground)]">
                      Need help?{" "}
                      <Link to={ROUTES.FORGOT_PASSWORD} className="font-semibold text-[var(--primary)]">
                        Resend verification
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
