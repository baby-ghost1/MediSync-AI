import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Brain, Search } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import aiService from "@/services/ai.service";
import reportService from "@/services/report.service";
import { useApiQuery } from "@/hooks/useQuery";
import { useDebounce } from "@/hooks/useDebounce";

const ReportSummary = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const debouncedSearch = useDebounce(search);

  const { data: reportsData, isLoading } = useApiQuery({
    queryKey: ["reports-summary", { search: debouncedSearch }],
    queryFn: () => reportService.getReports({ search: debouncedSearch }),
  });

  const reports = reportsData?.reports || reportsData?.data || [];

  const handleSummarize = async (report) => {
    setSelected(report);
    setSummarizing(true);
    setExpanded(true);
    try {
      const res = await aiService.summarizeReport(report._id);
      setSummary(res.summary || res.message || res.data?.summary || res.data?.message || "AI analysis complete.");
    } catch {
      setSummary("Failed to generate summary.");
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-6 shadow-xl shadow-black/10">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
          <FileText size={20} className="text-[var(--primary)]" />
          AI Report Summary
        </h3>
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by name..."
            className="w-full rounded-2xl border-2 border-[var(--border)]/80 bg-[var(--card)]/80 px-5 py-3.5 pl-12 text-sm outline-none transition-all duration-200 placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)]/50 focus:ring-4 focus:ring-[var(--primary)]/20 text-[var(--foreground)]"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><div className="rounded-2xl bg-[var(--card)]/80 p-6 shadow-lg backdrop-blur-xl"><Spinner size="lg" /></div></div>
      ) : reports.length === 0 ? (
        <Card className="p-8 text-center border-0 shadow-lg"><p className="text-[var(--muted-foreground)]">No reports found.</p></Card>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-2xl border-2 p-5 transition-all duration-200 cursor-pointer",
                selected?._id === report._id
                    ? "border-[var(--primary)]/50 bg-gradient-to-br from-[var(--primary-light)] to-[var(--info-light)] shadow-lg shadow-[var(--primary)]/10"
                  : "border-[var(--border)]/60 bg-[var(--card)]/80 hover:border-[var(--border-hover)]/80 hover:shadow-xl hover:shadow-black/10"
              )}
              onClick={() => handleSummarize(report)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] shadow-lg">
                    <FileText size={22} className="text-[var(--primary-foreground)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)]">{report.title || report.name || "Medical Report"}</h4>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {report.patient?.name || "Patient"} · {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={report.healthScore ? "success" : "secondary"} size="xs">
                    {report.healthScore ? `Score: ${report.healthScore}` : "Pending"}
                  </Badge>
                  {summarizing && selected?._id === report._id ? (
                    <Spinner size="sm" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
                      <Brain size={16} />
                    </div>
                  )}
                </div>
              </div>

              {selected?._id === report._id && expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 border-t border-[var(--border)]/60 pt-4">
                  <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                    <Brain size={14} />
                    AI Analysis
                  </h5>
                  {summarizing ? (
                    <div className="flex items-center gap-3 rounded-xl bg-[var(--secondary)]/50 px-4 py-3">
                      <Spinner size="sm" />
                      <span className="text-sm text-[var(--muted-foreground)]">Generating AI summary...</span>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-gradient-to-br from-[var(--secondary)] to-[var(--primary-light)]/30 p-4">
                      <div className="prose prose-sm max-w-none leading-7 prose-headings:text-[var(--foreground)] prose-a:text-[var(--primary)] prose-code:text-[var(--primary)] prose-pre:bg-transparent prose-pre:p-0 prose-p:text-[var(--foreground)] prose-li:text-[var(--foreground)] prose-strong:text-[var(--foreground)]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {summary}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportSummary;
