import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Square, Sparkles, Trash2, Wand2 } from "lucide-react";
import { cn } from "@/utils/cn";
import ChatMessage from "./ChatMessage";

const AIChat = ({
  messages = [],
  onSend,
  onClear,
  onStop,
  isProcessing = false,
  streamingMessage = "",
  quickActions = [],
  onQuickAction,
  placeholder = "Type your message...",
  accentColor = "blue",
  emptyTitle = "How can I help you today?",
  emptyDescription = "Ask me anything about your health, symptoms, or medications",
  className,
}) => {
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (autoScroll) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [autoScroll]);

  useEffect(() => { scrollToBottom(); }, [messages, streamingMessage, scrollToBottom]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setAutoScroll(atBottom);
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isProcessing) return;
    onSend?.(trimmed);
    setInput("");
    setAutoScroll(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action) => {
    setInput(action);
    inputRef.current?.focus();
  };

  const hasMessages = messages.length > 0 || streamingMessage;

  const accentStyles = {
    blue: {
      gradient: "from-blue-500 to-indigo-600",
      ring: "focus:border-blue-500/50 focus:ring-blue-500/20",
      button: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25",
      text: "text-blue-600",
      glow: "shadow-blue-500/20",
    },
    violet: {
      gradient: "from-violet-500 to-indigo-600",
      ring: "focus:border-violet-500/50 focus:ring-violet-500/20",
      button: "bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 shadow-lg shadow-violet-500/25",
      text: "text-violet-600",
      glow: "shadow-violet-500/20",
    },
  };

  const accent = accentStyles[accentColor] || accentStyles.blue;

  return (
    <div className={cn("flex h-full flex-col rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:border-slate-700/50 dark:bg-slate-900/80 dark:shadow-black/20", className)}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:hover:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:hover:bg-slate-600"
      >
        {!hasMessages ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className={cn("mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br shadow-xl shadow-blue-500/10", accent.gradient)}>
              <Sparkles size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{emptyTitle}</h2>
            <p className="mt-2 max-w-md text-slate-400 dark:text-slate-500">{emptyDescription}</p>
            {quickActions.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleQuickAction(action.prompt || action.action)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                      "border-slate-200/60 bg-white/50 text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-blue-500/50 dark:hover:bg-blue-950/30"
                    )}
                  >
                    {action.icon && <action.icon size={16} />}
                    {action.label || action}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-6 px-2">
            <AnimatePresence>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {streamingMessage && (
                <ChatMessage
                  message={{ id: "streaming", role: "assistant", content: streamingMessage }}
                  isTyping
                />
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-slate-200/60 bg-white/50 px-4 pb-4 pt-3 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/50">
        <div className="flex items-end gap-3">
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={1}
              disabled={isProcessing}
              className={cn(
                "w-full resize-none rounded-2xl border-2 border-slate-200/80 bg-white/80 px-5 py-3 pr-12 text-sm outline-none transition-all duration-200",
                "placeholder:text-slate-400 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500",
                accent.ring,
                "hover:border-slate-300 dark:hover:border-slate-600",
                "disabled:opacity-50"
              )}
              style={{ minHeight: "44px", maxHeight: "120px" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
            />
            {onQuickAction && (
              <button
                onClick={() => { onQuickAction(); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-200 hover:text-blue-500 hover:scale-110"
                title="Quick actions"
              >
                <Wand2 size={18} />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {onClear && messages.length > 0 && (
              <button
                onClick={onClear}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/60 bg-white/50 text-slate-400 shadow-sm transition-all duration-200 hover:border-red-400/50 hover:bg-red-50 hover:text-red-500 hover:shadow-md hover:shadow-red-500/10 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:border-red-500/50 dark:hover:bg-red-950/20"
                title="Clear chat"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              onClick={isProcessing && onStop ? onStop : handleSend}
              disabled={!input.trim() && !isProcessing}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
                isProcessing
                  ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25"
                  : cn(accent.button, "text-white disabled:opacity-40 disabled:shadow-none"),
              )}
            >
              {isProcessing ? <Square size={18} /> : <Send size={18} />}
            </button>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-400 dark:text-slate-500">
          AI responses are for informational purposes. Consult your doctor for medical advice.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
