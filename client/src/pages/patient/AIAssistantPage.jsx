import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stethoscope, Pill, Activity, Brain, FileText, Sparkles, MessageSquare,
  Plus, Trash2, Edit3, Check, X, MessageCircle, FlaskConical,
} from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";
import { AIChat, SymptomChecker, MedicineInfo, HealthScore, HealthTips, ReportSummary } from "@/components/ai";
import LabInterpreter from "@/components/ai/LabInterpreter";
import aiService from "@/services/ai.service";
import { useApiMutation, useApiQuery } from "@/hooks/useQuery";
import { cn } from "@/utils/cn";

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
  { id: "lab", label: "Lab Interpreter", icon: FlaskConical },
  { id: "healthscore", label: "Health Score", icon: Activity },
  { id: "healthtips", label: "Health Tips", icon: Sparkles },
  { id: "reports", label: "Report Summary", icon: FileText },
];

const AIAssistantPage = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [activeConv, setActiveConv] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [showConvSidebar, setShowConvSidebar] = useState(true);
  const initRef = useRef(false);

  const { data: convData, refetch: refetchConvs } = useApiQuery({
    queryKey: ["ai-conversations"],
    queryFn: () => aiService.listConversations(),
  });

  const conversations = convData?.data || [];

  const { mutate: createConv } = useApiMutation({
    mutationFn: () => aiService.createConversation("New Conversation"),
    onSuccess: (data) => {
      refetchConvs();
      const conv = data?.data;
      if (conv) {
        setActiveConv(conv._id);
        setMessages([]);
      }
      toast.success("New conversation created");
    },
  });

  const { mutate: deleteConv } = useApiMutation({
    mutationFn: (id) => aiService.deleteConversation(id),
    onSuccess: (_, id) => {
      refetchConvs();
      if (activeConv === id) {
        setActiveConv(null);
        setMessages([]);
      }
      toast.success("Conversation deleted");
    },
  });

  const { mutate: renameConv } = useApiMutation({
    mutationFn: ({ id, title }) => aiService.renameConversation(id, title),
    onSuccess: () => {
      refetchConvs();
      setRenamingId(null);
      toast.success("Renamed");
    },
  });

  const { data: convMessages } = useApiQuery({
    queryKey: ["ai-conversation", activeConv],
    queryFn: () => aiService.getConversation(activeConv),
    enabled: !!activeConv,
  });

  useEffect(() => {
    if (convMessages?.data?.messages && !initRef.current) {
      initRef.current = true;
      setMessages(convMessages.data.messages.map((m) => ({
        id: m._id || Date.now().toString(),
        content: m.content,
        role: m.role,
      })));
    }
  }, [convMessages]);

  const handleSend = useCallback((content) => {
    const userMsg = { id: Date.now().toString(), content, role: "user", timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setStreamingMessage("");

    const conversationId = activeConv;

    if (conversationId) {
      let fullReply = "";
      aiService.conversationChatStream(
        conversationId,
        content,
        (chunk) => {
          fullReply += chunk;
          setStreamingMessage(fullReply);
        },
        () => {
          setMessages((prev) => [...prev, { id: Date.now().toString(), content: fullReply, role: "assistant" }]);
          setStreamingMessage("");
          setIsProcessing(false);
          refetchConvs();
        },
        () => {
          setIsProcessing(false);
          setStreamingMessage("");
          toast.error("Stream failed, falling back to non-streaming");
          aiService.conversationChat(conversationId, content).then((res) => {
            const reply = res.response || "I've processed your request.";
            setMessages((prev) => [...prev, { id: Date.now().toString(), content: reply, role: "assistant" }]);
          }).catch(() => toast.error("Failed to get response"));
        }
      );
    } else {
      setStreamingMessage("Analyzing your request...");
      aiService.chat({ message: content }).then((data) => {
        const reply = data.response || data.data?.reply || data.message || "I've processed your request.";
        setMessages((prev) => [...prev, { id: Date.now().toString(), content: reply, role: "assistant" }]);
        setStreamingMessage("");
        setIsProcessing(false);
      }).catch(() => {
        setIsProcessing(false);
        setStreamingMessage("");
        toast.error("Failed to get response");
      });
    }
  }, [activeConv, refetchConvs]);

  const handleClear = useCallback(() => {
    if (activeConv) {
      deleteConv(activeConv);
      setActiveConv(null);
    } else {
      aiService.clearChatHistory().then(() => {
        setMessages([]);
        toast.success("Chat cleared");
      });
    }
  }, [activeConv, deleteConv]);

  const switchConversation = (id) => {
    setActiveConv(id);
    setMessages([]);
    initRef.current = false;
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col gap-6">
      <PageHeader
        title="AI Health Assistant"
        description="Get instant health insights, analyze symptoms, and more"
      />

      <div className="flex gap-6 overflow-hidden flex-1">
        {/* Left Sidebar */}
        <div className="hidden w-56 shrink-0 overflow-y-auto lg:block [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--border-hover)]">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[var(--radius-lg)] px-4 py-3 text-sm font-medium transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-lg)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>

          {activeTab === "chat" && (
            <>
              <div className="mt-4 flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Conversations</span>
                <Button variant="ghost" size="icon" onClick={createConv} title="New conversation">
                  <Plus size={14} />
                </Button>
              </div>
              <div className="mt-2 space-y-0.5">
                {conversations.length === 0 && (
                  <p className="px-2 text-[11px] text-[var(--muted-foreground)]">No conversations yet</p>
                )}
                {conversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg px-3 py-2 text-xs cursor-pointer transition-colors",
                      activeConv === conv._id
                        ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
                    )}
                    onClick={() => switchConversation(conv._id)}
                  >
                    <MessageCircle size={12} className="shrink-0" />
                    {renamingId === conv._id ? (
                      <input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            renameConv({ id: conv._id, title: renameValue });
                          }
                          if (e.key === "Escape") setRenamingId(null);
                        }}
                        className="flex-1 bg-transparent border-b border-[var(--primary)] text-[var(--foreground)] outline-none text-xs"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="flex-1 truncate">{conv.title}</span>
                    )}
                    <div className="hidden gap-0.5 group-hover:flex">
                      {renamingId !== conv._id && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); setRenamingId(conv._id); setRenameValue(conv.title); }}
                            className="p-0.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                          >
                            <Edit3 size={10} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteConv(conv._id); }}
                            className="p-0.5 text-[var(--muted-foreground)] hover:text-[var(--danger)]"
                          >
                            <Trash2 size={10} />
                          </button>
                        </>
                      )}
                      {renamingId === conv._id && (
                        <>
                          <button onClick={() => renameConv({ id: conv._id, title: renameValue })} className="p-0.5 text-[var(--success)]"><Check size={10} /></button>
                          <button onClick={() => setRenamingId(null)} className="p-0.5 text-[var(--muted-foreground)]"><X size={10} /></button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-6 rounded-[var(--radius-lg)] bg-[var(--gradient-primary)] p-4 text-[var(--primary-foreground)]">
            <Brain size={24} className="mb-2" />
            <p className="text-sm font-bold">Powered by Gemini AI</p>
            <p className="mt-1 text-xs text-[var(--primary-foreground)]/80">Advanced medical intelligence for personalized healthcare</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          {activeTab === "chat" && (
            <AIChat
              messages={messages}
              onSend={handleSend}
              onClear={handleClear}
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
          {activeTab === "lab" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-y-auto">
              <LabInterpreter />
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
