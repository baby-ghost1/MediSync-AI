import AppRoutes from "@/routes/AppRoutes";
import FloatingWebsiteAssistant from "@/components/common/FloatingWebsiteAssistant";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <AppRoutes />
      <FloatingWebsiteAssistant />
    </div>
  );
}

export default App;