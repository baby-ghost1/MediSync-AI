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
      gradient: "from-[var(--primary)] to-[var(--accent)]",
      ring: "focus:border-[var(--primary)]/50 focus:ring-[var(--primary)]/20",
      button: "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:brightness-110 shadow-lg shadow-[var(--primary)]/25",
      text: "text-[var(--primary)]",
      glow: "shadow-[var(--primary)]/20",
    },
    violet: {
      gradient: "from-[var(--primary)] to-[var(--accent)]",
      ring: "focus:border-[var(--primary)]/50 focus:ring-[var(--primary)]/20",
      button: "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:brightness-110 shadow-lg shadow-[var(--primary)]/25",
      text: "text-[var(--primary)]",
      glow: "shadow-[var(--primary)]/20",
    },
  };

  const accent = accentStyles[accentColor] || accentStyles.blue;

  return (
    <div className={cn("flex h-full flex-col rounded-3xl border border-[var(--border)]/60 bg-[var(--card)]/80 backdrop-blur-xl shadow-xl shadow-black/5", className)}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--border-hover)] [&::-webkit-scrollbar-thumb]:hover:bg-[var(--muted-foreground)]"
      >
        {!hasMessages ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className={cn("mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br shadow-xl shadow-primary/10", accent.gradient)}>
              <Sparkles size={40} className="text-[var(--muted-foreground)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">{emptyTitle}</h2>
            <p className="mt-2 max-w-md text-[var(--muted-foreground)]">{emptyDescription}</p>
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
                      "border-[var(--border)]/60 bg-[var(--card)]/50 text-[var(--muted-foreground)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary-light)] hover:text-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10"
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

      <div className="border-t border-[var(--border)]/60 bg-[var(--card)]/50 px-4 pb-4 pt-3 backdrop-blur-xl">
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
                "w-full resize-none rounded-2xl border-2 border-[var(--border)]/80 bg-[var(--card)]/80 px-5 py-3 pr-12 text-sm outline-none transition-all duration-200",
                "placeholder:text-[var(--muted-foreground)]",
                "text-[var(--foreground)]",
                accent.ring,
                "hover:border-[var(--border-hover)]",
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] transition-all duration-200 hover:text-[var(--primary)] hover:scale-110"
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
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)]/60 bg-[var(--card)]/50 text-[var(--muted-foreground)] shadow-sm transition-all duration-200 hover:border-[var(--danger)]/50 hover:bg-[var(--danger-light)] hover:text-[var(--danger)] hover:shadow-md hover:shadow-[var(--danger)]/10"
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
                  ? "bg-[var(--danger)] text-[var(--danger-foreground)] hover:brightness-110 shadow-lg shadow-[var(--danger)]/25"
                  : cn(accent.button, "text-[var(--primary-foreground)] disabled:opacity-40 disabled:shadow-none"),
              )}
            >
              {isProcessing ? <Square size={18} /> : <Send size={18} />}
            </button>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-[var(--muted-foreground)]">
          AI responses are for informational purposes. Consult your doctor for medical advice.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
