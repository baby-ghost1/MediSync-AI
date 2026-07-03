import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Brain, TrendingUp, AlertTriangle, Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import aiService from "@/services/ai.service";

const HealthScore = () => {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [conditions, setConditions] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCalculate = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = { age: Number(age), weight: Number(weight), height: Number(height), conditions };
      const res = await aiService.healthScore(payload);
      setResult(res.healthScore || res.data?.healthScore || res);
    } catch {
      setError("Failed to calculate health score.");
    } finally {
      setLoading(false);
    }
  };

  const score = result?.score ?? null;
  const scoreNum = Number(score);
  const getScoreColor = (s) => {
    if (s >= 80) return "from-green-400 to-emerald-500";
    if (s >= 60) return "from-yellow-400 to-amber-500";
    if (s >= 40) return "from-orange-400 to-red-500";
    return "from-red-400 to-rose-600";
  };

  const getScoreLabel = (s) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Fair";
    return "Needs Attention";
  };

  const getScoreRing = (s) => {
    if (s >= 80) return "stroke-green-500";
    if (s >= 60) return "stroke-amber-500";
    if (s >= 40) return "stroke-orange-500";
    return "stroke-rose-500";
  };

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (Math.min(Math.max(scoreNum, 0), 100) / 100) * circumference;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-6 shadow-xl shadow-black/10">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
          <Activity size={20} className="text-[var(--primary)]" />
          Calculate Health Score
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 35" />
          <Input label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 70" />
          <Input label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 170" />
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Existing Conditions</label>
          <textarea
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            placeholder="e.g., Type 2 diabetes, hypertension (optional)"
            rows={2}
            className="w-full rounded-xl border-2 border-[var(--border)]/80 bg-[var(--card)]/80 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[var(--primary)]/50 focus:ring-4 focus:ring-[var(--primary)]/20 text-[var(--foreground)]"
          />
        </div>
        <div className="mt-4">
          <Button onClick={handleCalculate} loading={loading} leftIcon={<Brain size={16} />} disabled={!age || !weight || !height}>
            Calculate Health Score
          </Button>
        </div>
        </div>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-4 rounded-2xl bg-[var(--card)]/80 px-6 py-4 shadow-lg backdrop-blur-xl">
            <Spinner size="lg" />
            <span className="text-sm font-medium text-[var(--muted-foreground)]">Calculating your health score...</span>
          </div>
        </div>
      )}

      {error && <Card variant="danger" className="p-4"><p className="text-sm text-[var(--danger)]">{error}</p></Card>}

      {result && !loading && !isNaN(scoreNum) && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-8 text-center shadow-xl shadow-black/10">
            <div className="relative mx-auto mb-4 flex h-36 w-36 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-[var(--border)]" />
                <circle
                  cx="60" cy="60" r="54" fill="none" strokeWidth="8" strokeLinecap="round"
                  className={cn("transition-all duration-1000 ease-out", getScoreRing(scoreNum))}
                  strokeDasharray={circumference}
                  strokeDashoffset={isNaN(offset) ? circumference : offset}
                />
              </svg>
              <div className={cn(
                "flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br shadow-lg",
                getScoreColor(scoreNum)
              )}>
                <span className="text-3xl font-black text-[var(--primary-foreground)] drop-shadow-sm">{scoreNum}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[var(--foreground)]">{getScoreLabel(scoreNum)}</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">Your AI-generated health assessment</p>
          </Card>

          {result.insights && (
            <Card className="overflow-hidden border-0 bg-[var(--primary-light)] p-6 shadow-lg">
              <div className="flex items-center gap-2 text-[var(--primary)] mb-3">
                <TrendingUp size={18} />
                <h4 className="font-bold">Health Insights</h4>
              </div>
              <p className="text-sm leading-7 whitespace-pre-wrap text-[var(--foreground)]">{result.insights}</p>
            </Card>
          )}
          {result.risks && (
            <Card className="overflow-hidden border-0 bg-[var(--danger-light)] p-6 shadow-lg">
              <div className="flex items-center gap-2 text-[var(--danger)] mb-3">
                <AlertTriangle size={18} />
                <h4 className="font-bold">Risk Factors</h4>
              </div>
              <p className="text-sm leading-7 whitespace-pre-wrap text-[var(--foreground)]">{result.risks}</p>
            </Card>
          )}
          {result.recommendations && (
            <Card className="overflow-hidden border-0 bg-[var(--success-light)] p-6 shadow-lg">
              <div className="flex items-center gap-2 text-[var(--success)] mb-3">
                <Shield size={18} />
                <h4 className="font-bold">Recommendations</h4>
              </div>
              <p className="text-sm leading-7 whitespace-pre-wrap text-[var(--foreground)]">{result.recommendations}</p>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default HealthScore;
