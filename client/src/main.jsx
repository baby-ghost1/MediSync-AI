import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Root from "./Root";
import "@/index.css";

if (import.meta.env.VITE_SENTRY_DSN) {
  import("@sentry/react").then((Sentry) => {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.PROD ? "production" : "development",
      tracesSampleRate: 0.2,
      integrations: [Sentry.browserTracingIntegration()],
    });
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
