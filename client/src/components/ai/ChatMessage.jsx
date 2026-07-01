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
    <div className="group relative my-4 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 shadow-lg shadow-black/20 dark:bg-slate-950">
      {language && <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-800/50 px-4 py-2.5 text-xs font-medium text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          {language}
        </span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-500 transition-all hover:bg-slate-700/50 hover:text-white">
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
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
          <Bot size={18} className="text-white" />
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-slate-100/80 px-5 py-3.5 backdrop-blur-sm dark:bg-slate-800/80">
          <span className="flex gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: "0ms" }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: "150ms" }} />
            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: "300ms" }} />
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">{message.content || "Thinking..."}</span>
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
          ? "bg-gradient-to-br from-slate-600 to-slate-700 shadow-slate-500/20 dark:from-slate-500 dark:to-slate-600"
          : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20"
      )}>
        {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
      </div>

      <div className={cn("max-w-[80%] min-w-0", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "px-5 py-3.5 leading-7 shadow-sm",
          isUser
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl rounded-tr-md shadow-lg shadow-blue-500/20"
            : "bg-white text-slate-800 rounded-2xl rounded-tl-md border border-slate-200/60 shadow-lg shadow-slate-200/50 dark:border-slate-700/50 dark:bg-slate-800/80 dark:text-slate-100 dark:shadow-black/10"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm font-medium">{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none break-words prose-headings:text-slate-800 prose-headings:font-bold prose-a:text-blue-600 prose-code:text-blue-700 prose-pre:bg-transparent prose-pre:p-0 dark:prose-headings:text-slate-100 dark:prose-a:text-blue-400 dark:prose-code:text-blue-300">
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !match;
                    if (isInline) {
                      return <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-sm font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-200" {...props}>{children}</code>;
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
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{formattedTime}</span>
          {!isUser && (
            <>
              <button onClick={handleCopy} className="text-slate-400 opacity-0 transition-all duration-200 hover:text-blue-500 group-hover:opacity-100 hover:scale-110" title="Copy response">
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
              {onRegenerate && (
                <button onClick={onRegenerate} className="text-slate-400 opacity-0 transition-all duration-200 hover:text-blue-500 group-hover:opacity-100 hover:scale-110" title="Regenerate">
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
