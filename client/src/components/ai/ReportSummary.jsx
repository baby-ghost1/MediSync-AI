import { useState } from "react";
import { motion } from "framer-motion";
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
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 p-6 shadow-xl shadow-slate-200/50 dark:from-slate-900 dark:to-slate-950 dark:shadow-black/20">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
          <FileText size={20} className="text-blue-600" />
          AI Report Summary
        </h3>
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by name..."
            className="w-full rounded-2xl border-2 border-slate-200/80 bg-white/80 px-5 py-3.5 pl-12 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-xl dark:bg-slate-800/80"><Spinner size="lg" /></div></div>
      ) : reports.length === 0 ? (
        <Card className="p-8 text-center border-0 shadow-lg"><p className="text-slate-400 dark:text-slate-500">No reports found.</p></Card>
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
                  ? "border-blue-500/50 bg-gradient-to-br from-blue-50 to-indigo-50/50 shadow-lg shadow-blue-500/10 dark:from-blue-950/30 dark:to-indigo-950/20"
                  : "border-slate-200/60 bg-white/80 hover:border-slate-300/80 hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-700/50 dark:bg-slate-800/80 dark:hover:border-slate-600/80 dark:hover:shadow-black/20"
              )}
              onClick={() => handleSummarize(report)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                    <FileText size={22} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">{report.title || report.name || "Medical Report"}</h4>
                    <p className="text-sm text-slate-400 dark:text-slate-500">
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-950/30">
                      <Brain size={16} />
                    </div>
                  )}
                </div>
              </div>

              {selected?._id === report._id && expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 border-t border-slate-200/60 pt-4 dark:border-slate-700/50">
                  <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    <Brain size={14} />
                    AI Analysis
                  </h5>
                  {summarizing ? (
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50/50 px-4 py-3 dark:bg-slate-700/30">
                      <Spinner size="sm" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">Generating AI summary...</span>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 dark:from-slate-800/50 dark:to-blue-950/10">
                      <p className="text-sm leading-7 whitespace-pre-wrap text-slate-700 dark:text-slate-300">{summary}</p>
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
