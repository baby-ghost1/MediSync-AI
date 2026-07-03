import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Pill, Activity, Brain, FileText, Sparkles, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "@/components/common/PageHeader";
import { AIChat, SymptomChecker, MedicineInfo, HealthScore, HealthTips, ReportSummary } from "@/components/ai";
import aiService from "@/services/ai.service";
import { useApiMutation, useApiQuery } from "@/hooks/useQuery";

const quickActions = [
  { icon: Stethoscope, label: "Analyze Symptoms", action: "I'd like to analyze my symptoms" },
  { icon: Pill, label: "Medicine Advice", action: "I need medicine advice" },
  { icon: Activity, label: "Health Score", action: "Calculate my health score" },
  { icon: Brain, label: "Risk Prediction", action: "Predict my health risks" },
  { icon: FileText, label: "Report Summary", action: "Summarize my medical reports" },
];

const tabs = [
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "symptoms", label: "Symptom Checker", icon: Stethoscope },
  { id: "medicine", label: "Medicine Info", icon: Pill },
  { id: "healthscore", label: "Health Score", icon: Activity },
  { id: "healthtips", label: "Health Tips", icon: Sparkles },
  { id: "reports", label: "Report Summary", icon: FileText },
];

const AIAssistantPage = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const initRef = useRef(false);

  const { data: chatHistory } = useApiQuery({
    queryKey: ["ai-chat-history"],
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
      const reply = data.response || data.data?.reply || data.message || "I've processed your request.";
      setMessages((prev) => [...prev, {
        id: Date.now().toString(), content: reply, role: "assistant", timestamp: new Date().toISOString(),
      }]);
      setStreamingMessage("");
      setIsProcessing(false);
    },
    onError: () => {
      setIsProcessing(false);
      setStreamingMessage("");
      toast.error("Failed to get response");
    },
  });

  const { mutate: clearHistory } = useApiMutation({
    mutationFn: () => aiService.clearChatHistory(),
    onSuccess: () => { setMessages([]); toast.success("Chat history cleared"); },
    successMessage: "Chat history cleared",
  });

  const handleSend = (content) => {
    const userMsg = { id: Date.now().toString(), content, role: "user", timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setStreamingMessage("Analyzing your request...");
    sendMessage(content);
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col gap-6">
      <PageHeader
        title="AI Health Assistant"
        description="Get instant health insights, analyze symptoms, and more"
      />

      <div className="flex gap-6 overflow-hidden flex-1">
        <div className="hidden w-56 shrink-0 lg:block">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-lg)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-6 rounded-[var(--radius-lg)] bg-[var(--gradient-primary)] p-4 text-[var(--primary-foreground)]">
            <Brain size={24} className="mb-2" />
            <p className="text-sm font-bold">Powered by Gemini AI</p>
            <p className="mt-1 text-xs text-[var(--primary-foreground)]/80">Advanced medical intelligence for personalized healthcare</p>
          </div>
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
              placeholder="Ask about symptoms, medications, health scores..."
              emptyTitle="How can I help you today?"
              emptyDescription="Ask me about symptoms, medications, health scores, or your medical reports"
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
          {activeTab === "healthscore" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-y-auto">
              <HealthScore />
            </motion.div>
          )}
          {activeTab === "healthtips" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-y-auto">
              <HealthTips />
            </motion.div>
          )}
          {activeTab === "reports" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-y-auto">
              <ReportSummary />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
