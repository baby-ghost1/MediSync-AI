import { useState } from "react";
import { motion } from "framer-motion";
import { Pill, Search, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import aiService from "@/services/ai.service";

const MedicineInfo = () => {
  const [medicine, setMedicine] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!medicine.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await aiService.medicineAdvice(medicine);
      setResult(res.information || res.data?.information || res);
    } catch {
      setError("Failed to get medicine information.");
    } finally {
      setLoading(false);
    }
  };

  const parsed = result ? { full: typeof result === "string" ? result : result.text || result.information || "" } : null;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 p-6 shadow-xl shadow-slate-200/50 dark:from-slate-900 dark:to-slate-950 dark:shadow-black/20">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
          <Pill size={20} className="text-blue-600" />
          Medicine Information
        </h3>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input
              value={medicine}
              onChange={(e) => setMedicine(e.target.value)}
              placeholder="e.g., Paracetamol, Amoxicillin, Metformin..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              disabled={loading}
            />
          </div>
          <Button onClick={handleSearch} loading={loading} leftIcon={<Search size={16} />} disabled={!medicine.trim()}>
            Lookup
          </Button>
        </div>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-4 rounded-2xl bg-white/80 px-6 py-4 shadow-lg backdrop-blur-xl dark:bg-slate-800/80">
            <Spinner size="lg" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Looking up medicine...</span>
          </div>
        </div>
      )}

      {error && (
        <Card variant="danger" className="p-4">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      {parsed && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 p-6 shadow-xl shadow-slate-200/50 dark:from-slate-900 dark:to-slate-950 dark:shadow-black/20">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Pill size={26} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold capitalize text-slate-800 dark:text-white">{medicine}</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500">AI-generated medicine information</p>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-5 dark:from-blue-950/20 dark:to-indigo-950/10">
              <div className="prose prose-sm prose-slate dark:prose-invert max-w-none whitespace-pre-wrap leading-7 prose-headings:text-slate-800 dark:prose-headings:text-slate-100">
                {typeof result === "string" ? result : result.text || result.information || parsed.full}
              </div>
            </div>
          </Card>
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-yellow-50/50 p-5 text-sm text-amber-800 shadow-lg shadow-amber-500/5 dark:border-amber-800/30 dark:from-amber-950/30 dark:to-yellow-950/20 dark:text-amber-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="leading-6">This information is for reference only. Always consult a healthcare professional before taking any medication.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MedicineInfo;
