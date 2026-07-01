import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { queryClient } from "@/config/queryClient";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/providers/SocketProvider";
import ErrorBoundary from "@/components/common/ErrorBoundary";

function Root() {
  return (
    <ErrorBoundary showDetails>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <SocketProvider>
                <App />
                <Toaster
                  position="top-right"
                  reverseOrder={false}
                  toastOptions={{
                    duration: 3000,
                    style: {
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "14px",
                    },
                    success: {
                      iconTheme: {
                        primary: "#16a34a",
                        secondary: "#ffffff",
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: "#dc2626",
                        secondary: "#ffffff",
                      },
                    },
                  }}
                />
              </SocketProvider>
            </AuthProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default Root;
