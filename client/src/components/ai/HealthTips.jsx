import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-6 shadow-xl shadow-black/10">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
          <Lightbulb size={20} className="text-[var(--warning)]" />
          Personalized Health Tips
        </h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-40">
            <Input label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 35" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="rounded-xl border-2 border-[var(--border)]/80 bg-[var(--card)]/80 px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-[var(--primary)]/50 focus:ring-4 focus:ring-[var(--primary)]/20 text-[var(--foreground)]"
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
          <div className="flex items-center gap-4 rounded-2xl bg-[var(--card)]/80 px-6 py-4 shadow-lg backdrop-blur-xl">
            <Spinner size="lg" />
            <span className="text-sm font-medium text-[var(--muted-foreground)]">Generating personalized tips...</span>
          </div>
        </div>
      )}

      {error && <Card variant="danger" className="p-4"><p className="text-sm text-[var(--danger)]">{error}</p></Card>}

      {parsed && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-6 shadow-xl shadow-black/10">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--gradient-primary)] shadow-lg">
                <Lightbulb size={26} className="text-[var(--primary-foreground)]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--foreground)]">Health Tips for Age {age}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Personalized AI-generated recommendations</p>
              </div>
            </div>
            <div className="rounded-2xl bg-[var(--warning-light)]/50 p-5">
              <div className="prose prose-sm max-w-none leading-7 prose-headings:text-[var(--foreground)] prose-a:text-[var(--primary)] prose-code:text-[var(--primary)] prose-pre:bg-transparent prose-pre:p-0 prose-p:text-[var(--foreground)] prose-li:text-[var(--foreground)] prose-strong:text-[var(--foreground)]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {typeof result === "string" ? result : result.text || result.tips || parsed.full}
                </ReactMarkdown>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default HealthTips;
