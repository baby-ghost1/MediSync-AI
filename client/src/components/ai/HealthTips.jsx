import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import aiService from "@/services/ai.service";

const HealthTips = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleGetTips = async () => {
    if (!age) return;
    setLoading(true);
    setError("");
    try {
      const res = await aiService.healthTips({ age: Number(age), gender });
      setResult(res.tips || res.data?.tips || res);
    } catch {
      setError("Failed to generate health tips.");
    } finally {
      setLoading(false);
    }
  };

  const parseTips = (text) => {
    if (!text) return null;
    return {
      full: text,
    };
  };

  const parsed = result ? parseTips(typeof result === "string" ? result : result.text || "") : null;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 p-6 shadow-xl shadow-slate-200/50 dark:from-slate-900 dark:to-slate-950 dark:shadow-black/20">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
          <Lightbulb size={20} className="text-yellow-500" />
          Personalized Health Tips
        </h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-40">
            <Input label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 35" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="rounded-xl border-2 border-slate-200/80 bg-white/80 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Button onClick={handleGetTips} loading={loading} leftIcon={<RefreshCw size={16} />} disabled={!age}>
            Generate Tips
          </Button>
        </div>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-4 rounded-2xl bg-white/80 px-6 py-4 shadow-lg backdrop-blur-xl dark:bg-slate-800/80">
            <Spinner size="lg" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Generating personalized tips...</span>
          </div>
        </div>
      )}

      {error && <Card variant="danger" className="p-4"><p className="text-sm text-red-600">{error}</p></Card>}

      {parsed && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 p-6 shadow-xl shadow-slate-200/50 dark:from-slate-900 dark:to-slate-950 dark:shadow-black/20">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg shadow-amber-500/20">
                <Lightbulb size={26} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Health Tips for Age {age}</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500">Personalized AI-generated recommendations</p>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-amber-50/50 to-yellow-50/50 p-5 dark:from-amber-950/20 dark:to-yellow-950/10">
              <div className="prose prose-sm prose-slate dark:prose-invert max-w-none whitespace-pre-wrap leading-7 prose-headings:text-slate-800 dark:prose-headings:text-slate-100">
                {typeof result === "string" ? result : result.text || result.tips || parsed.full}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default HealthTips;
