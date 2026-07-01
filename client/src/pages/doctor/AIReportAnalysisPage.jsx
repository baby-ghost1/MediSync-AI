import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Stethoscope, Pill, Activity, Brain, MessageSquare, Microscope } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { AIChat, SymptomChecker, MedicineInfo, ReportSummary } from "@/components/ai";
import aiService from "@/services/ai.service";
import { useApiMutation, useApiQuery } from "@/hooks/useQuery";

const quickActions = [
  { icon: FileText, label: "Analyze Report", action: "Analyze this medical report for key findings" },
  { icon: Stethoscope, label: "Differential Diagnosis", action: "Provide a differential diagnosis for these symptoms" },
  { icon: Pill, label: "Medicine Advice", action: "Recommend treatment plan for hypertension" },
  { icon: Activity, label: "Vitals Analysis", action: "Analyze these vitals and flag abnormalities" },
  { icon: Brain, label: "Risk Assessment", action: "Assess cardiovascular risk factors" },
];

const tabs = [
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "symptoms", label: "Symptom Analysis", icon: Stethoscope },
  { id: "medicine", label: "Medicine Info", icon: Pill },
  { id: "reports", label: "Report Summary", icon: FileText },
];

const AIReportAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const initRef = useRef(false);

  const { data: chatHistory } = useApiQuery({
    queryKey: ["doctor-ai-chat"],
    queryFn: () => aiService.getChatHistory(),
    enabled: activeTab === "chat",
  });

  useEffect(() => {
    if (chatHistory?.messages?.length && !initRef.current && !messages.length) {
      initRef.current = true;
      setTimeout(() => {
        setMessages(chatHistory.messages.map((m) => ({
          id: m._id, content: m.content, role: m.role, timestamp: m.createdAt,
        })));
      }, 0);
    }
  }, [chatHistory, messages.length]);

  const { mutate: sendMessage } = useApiMutation({
    mutationFn: (content) => aiService.chat({ message: content }),
    onSuccess: (data) => {
      const reply = data.response || data.data?.reply || data.message || "Analysis complete.";
      setMessages((prev) => [...prev, {
        id: Date.now().toString(), content: reply, role: "assistant", timestamp: new Date().toISOString(),
      }]);
      setStreamingMessage("");
      setIsProcessing(false);
    },
    onError: () => { setIsProcessing(false); setStreamingMessage(""); },
  });

  const { mutate: clearHistory } = useApiMutation({
    mutationFn: () => aiService.clearChatHistory(),
    onSuccess: () => { setMessages([]); },
    successMessage: "Chat history cleared",
  });

  const handleSend = (content) => {
    const userMsg = { id: Date.now().toString(), content, role: "user", timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setStreamingMessage("Analyzing...");
    sendMessage(content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-[calc(100vh-10rem)] flex-col gap-6"
    >
      <PageHeader
        title="AI Clinical Analysis"
        description="Get AI-powered clinical insights, analyze reports, and assist diagnosis"
      />

      <div className="flex gap-6 overflow-hidden flex-1">
        <div className="hidden w-56 shrink-0 lg:block">
          <motion.nav
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[var(--accent)] text-white shadow-lg"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-off)]"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 rounded-[var(--radius-lg)] bg-[var(--gradient-accent)] p-5 text-white"
          >
            <Microscope size={24} className="mb-2" />
            <p className="text-sm font-bold">Clinical AI Assistant</p>
            <p className="mt-1 text-xs text-white/70">Evidence-based clinical decision support powered by Gemini</p>
          </motion.div>
        </div>

        <div className="flex-1">
          {activeTab === "chat" && (
            <AIChat
              messages={messages}
              onSend={handleSend}
              onClear={clearHistory}
              isProcessing={isProcessing}
              streamingMessage={streamingMessage}
              quickActions={quickActions}
              placeholder="Ask about a diagnosis, symptoms, or treatment plan..."
              accentColor="violet"
              emptyTitle="AI Clinical Assistant"
              emptyDescription="Analyze reports, get diagnostic insights, and receive evidence-based treatment recommendations"
            />
          )}
          {activeTab === "symptoms" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-y-auto">
              <SymptomChecker />
            </motion.div>
          )}
          {activeTab === "medicine" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-y-auto">
              <MedicineInfo />
            </motion.div>
          )}
          {activeTab === "reports" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-y-auto">
              <ReportSummary />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AIReportAnalysisPage;
