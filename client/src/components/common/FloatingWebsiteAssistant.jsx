import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Send, Sparkles, LoaderCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AIService from "@/services/ai.service";

const SUGGESTIONS = [
  "How to book an appointment?",
  "How to upload medical reports?",
  "How to use AI features?",
  "What can I do as a patient?",
];

const DRAG_THRESHOLD = 5;
const DISMISS_KEY = "assistantDismissed";

const FloatingWebsiteAssistant = () => {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";

  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem(DISMISS_KEY) === "true"; }
    catch { return false; }
  });
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const dragRef = useRef({ startX: 0, startY: 0, offsetX: 0, offsetY: 0, moved: false });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isHome) {
      setDismissed(false);
      try { sessionStorage.removeItem(DISMISS_KEY); } catch {}
    }
  }, [isHome]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      if (messages.length === 0) {
        setMessages([
          {
            role: "assistant",
            text: "Hi! I'm your MediSync AI Website Assistant. Ask me anything about using the platform, or pick a suggestion below!",
          },
        ]);
      }
    }
  }, [open]);

  const handleMouseDown = useCallback((e) => {
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.offsetX = offset.x;
    dragRef.current.offsetY = offset.y;
    dragRef.current.moved = false;
    setDragging(true);
  }, [offset]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        dragRef.current.moved = true;
      }
      setOffset({
        x: dx + dragRef.current.offsetX,
        y: dy + dragRef.current.offsetY,
      });
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const handleToggle = () => {
    if (!dragRef.current.moved) setOpen((prev) => !prev);
  };

  const handleDismiss = () => {
    setOpen(false);
    setDismissed(true);
    try { sessionStorage.setItem(DISMISS_KEY, "true"); } catch {}
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await AIService.websiteAssistant(text.trim());
      setMessages((prev) => [...prev, { role: "assistant", text: res.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (dismissed) return null;

  return (
    <div
      className="fixed bottom-24 right-6 z-[100]"
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      {/* Bubble */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onMouseDown={handleMouseDown}
          onClick={handleToggle}
          className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_8px_32px_rgba(37,99,235,.35)] transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(37,99,235,.5)]"
        >
          {open ? <X size={24} /> : <Bot size={24} />}
      </motion.button>

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-16 right-0 flex w-[320px] flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_20px_60px_rgba(15,23,42,.14)] h-[440px]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary)]/10">
                <Sparkles size={14} className="text-[var(--primary)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--foreground)]">Website Assistant</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">Ask me anything about MediSync AI</p>
              </div>
              <button
                onClick={handleDismiss}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "bg-[var(--secondary)] text-[var(--foreground)]"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:m-0 [&_ul]:m-0 [&_ol]:m-0 [&_li]:my-0.5">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-[var(--secondary)] px-3.5 py-2">
                    <LoaderCircle size={16} className="animate-spin text-[var(--muted-foreground)]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-2 space-y-1.5">
                <p className="text-[11px] font-medium text-[var(--muted-foreground)]">QUICK HELP</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-medium text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 transition-colors focus-within:border-[var(--primary)]">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your question..."
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[var(--muted-foreground)]"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingWebsiteAssistant;
