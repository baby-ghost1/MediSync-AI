import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Bot, User, Copy, Check } from "lucide-react";
import { cn } from "@/utils/cn";

import "highlight.js/styles/github-dark.css";

const CodeBlock = ({ language, children }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-2xl border border-[var(--border)]/60 bg-[var(--card)] shadow-lg shadow-black/20">
      {language && <div className="flex items-center justify-between border-b border-[var(--border)]/60 bg-[var(--surface-hover)]/50 px-4 py-2.5 text-xs font-medium text-[var(--muted-foreground)]">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
          {language}
        </span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[var(--muted-foreground)] transition-all hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>}
      <pre className="overflow-x-auto p-5 text-sm leading-6"><code className="font-mono">{children}</code></pre>
    </div>
  );
};

const ChatMessage = ({ message, isTyping = false, onRegenerate }) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = useMemo(() => {
    if (!message.timestamp) return "";
    return new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [message.timestamp]);

  if (isTyping) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 px-4 py-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--gradient-primary)] shadow-lg">
<Bot size={18} className="text-[var(--primary-foreground)]" />
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[var(--secondary)]/80 px-5 py-3.5 backdrop-blur-sm">
          <span className="flex gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--primary)]" style={{ animationDelay: "0ms" }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--primary)]" style={{ animationDelay: "150ms" }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--primary)]" style={{ animationDelay: "300ms" }} />
          </span>
          <span className="text-sm text-[var(--muted-foreground)]">{message.content || "Thinking..."}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn("flex gap-4 px-4 py-2 group", isUser ? "flex-row-reverse" : "")}
    >
      <div className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-lg",
        isUser
          ? "bg-[var(--muted-foreground)] shadow-black/10"
          : "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow-[var(--primary)]/20"
      )}>
        {isUser ? <User size={18} className="text-[var(--primary-foreground)]" /> : <Bot size={18} className="text-[var(--primary-foreground)]" />}
      </div>

      <div className={cn("max-w-[80%] min-w-0", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "px-5 py-3.5 leading-7 shadow-sm",
          isUser
            ? "bg-[var(--gradient-primary)] text-[var(--primary-foreground)] rounded-2xl rounded-tr-md shadow-lg"
            : "bg-[var(--card)] text-[var(--foreground)] rounded-2xl rounded-tl-md border border-[var(--border)]/60 shadow-lg shadow-black/5"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm font-medium">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none break-words prose-headings:text-[var(--foreground)] prose-headings:font-bold prose-a:text-[var(--primary)] prose-code:text-[var(--primary)] prose-pre:bg-transparent prose-pre:p-0 prose-p:text-[var(--foreground)] prose-li:text-[var(--foreground)] prose-strong:text-[var(--foreground)]">
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !match;
                    if (isInline) {
                      return <code className="rounded-md bg-[var(--secondary)] px-1.5 py-0.5 text-sm font-medium text-[var(--foreground)]" {...props}>{children}</code>;
                    }
                    return <CodeBlock language={match[1]}>{String(children).replace(/\n$/, "")}</CodeBlock>;
                  },
                  pre({ children }) { return <>{children}</>; },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <div className={cn("mt-1.5 flex items-center gap-3 px-1", isUser ? "justify-end" : "")}>
          <span className="text-[11px] font-medium text-[var(--muted-foreground)]">{formattedTime}</span>
          {!isUser && (
            <>
              <button onClick={handleCopy} className="text-[var(--muted-foreground)] opacity-0 transition-all duration-200 hover:text-[var(--primary)] group-hover:opacity-100 hover:scale-110" title="Copy response">
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
              {onRegenerate && (
                <button onClick={onRegenerate} className="text-[var(--muted-foreground)] opacity-0 transition-all duration-200 hover:text-[var(--primary)] group-hover:opacity-100 hover:scale-110" title="Regenerate">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
