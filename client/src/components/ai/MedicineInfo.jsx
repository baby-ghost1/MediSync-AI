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
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-6 shadow-xl shadow-black/10">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
          <Pill size={20} className="text-[var(--primary)]" />
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
          <div className="flex items-center gap-4 rounded-2xl bg-[var(--card)]/80 px-6 py-4 shadow-lg backdrop-blur-xl">
            <Spinner size="lg" />
            <span className="text-sm font-medium text-[var(--muted-foreground)]">Looking up medicine...</span>
          </div>
        </div>
      )}

      {error && (
        <Card variant="danger" className="p-4">
          <p className="text-sm text-[var(--danger)]">{error}</p>
        </Card>
      )}

      {parsed && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-6 shadow-xl shadow-black/10">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] shadow-lg">
                <Pill size={26} className="text-[var(--primary-foreground)]" />
              </div>
              <div>
                <h3 className="text-xl font-bold capitalize text-[var(--foreground)]">{medicine}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">AI-generated medicine information</p>
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--primary-light)]/50 p-5">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-7 prose-headings:text-[var(--foreground)]">
                {typeof result === "string" ? result : result.text || result.information || parsed.full}
              </div>
            </div>
          </Card>
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[var(--warning)]/20 bg-[var(--warning-light)] p-5 text-sm text-[var(--warning)] shadow-lg">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="leading-6">This information is for reference only. Always consult a healthcare professional before taking any medication.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MedicineInfo;
