import { useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope, AlertTriangle, Home, Microscope, UserRound, Ambulance, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import Spinner from "@/components/ui/Spinner";
import aiService from "@/services/ai.service";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setAnalyzing(true);
    setError("");
    try {
      const res = await aiService.analyzeSymptoms(symptoms);
      setResult(res.analysis || res.data?.analysis || res);
    } catch {
      setError("Failed to analyze symptoms. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const parseAnalysis = (text) => {
    if (!text) return null;
    const sections = text.split(/\d+\.\s*/).filter(Boolean);
    return {
      full: text,
      possibleDiseases: sections[0] || "",
      severity: sections[1] || "",
      specialist: sections[2] || "",
      tests: sections[3] || "",
      homeCare: sections[4] || "",
      emergencySigns: sections[5] || "",
    };
  };

  const parsed = result ? parseAnalysis(typeof result === "string" ? result : result.analysis || result.text) : null;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-6 shadow-xl shadow-black/10">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
          <Stethoscope size={20} className="text-[var(--primary)]" />
          Describe Your Symptoms
        </h3>
        <Textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., I have a persistent headache, fever of 101°F, and a sore throat for 3 days..."
          rows={4}
          disabled={analyzing}
        />
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={handleAnalyze} loading={analyzing} leftIcon={<Search size={16} />} disabled={!symptoms.trim()}>
            Analyze Symptoms
          </Button>
          {result && (
            <Button variant="outline" onClick={() => { setResult(null); setSymptoms(""); }}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      {analyzing && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-4 rounded-2xl bg-[var(--card)]/80 px-6 py-4 shadow-lg backdrop-blur-xl">
            <Spinner size="lg" />
            <span className="text-sm font-medium text-[var(--muted-foreground)]">Analyzing your symptoms...</span>
          </div>
        </div>
      )}

      {error && (
        <Card variant="danger" className="p-4">
          <p className="text-sm text-[var(--danger)]">{error}</p>
        </Card>
      )}

      {parsed && !analyzing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {parsed.possibleDiseases && (
            <Card className="overflow-hidden border-0 bg-[var(--warning-light)] p-6 shadow-lg">
              <div className="flex items-center gap-2 text-[var(--warning)] mb-3">
                <AlertTriangle size={20} />
                <h4 className="font-bold">Possible Conditions</h4>
              </div>
              <p className="text-sm leading-7 whitespace-pre-wrap text-[var(--foreground)]">{parsed.possibleDiseases}</p>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {parsed.severity && (
              <Card className="overflow-hidden border-0 bg-[var(--danger-light)] p-5 shadow-lg">
                <div className="flex items-center gap-2 text-[var(--danger)] mb-3">
                  <Ambulance size={18} />
                  <h4 className="font-bold">Severity</h4>
                </div>
                <p className="text-sm whitespace-pre-wrap text-[var(--foreground)]">{parsed.severity}</p>
              </Card>
            )}
            {parsed.specialist && (
              <Card className="overflow-hidden border-0 bg-[var(--primary-light)] p-5 shadow-lg">
                <div className="flex items-center gap-2 text-[var(--primary)] mb-3">
                  <UserRound size={18} />
                  <h4 className="font-bold">Recommended Specialist</h4>
                </div>
                <p className="text-sm whitespace-pre-wrap text-[var(--foreground)]">{parsed.specialist}</p>
              </Card>
            )}
            {parsed.tests && (
              <Card className="overflow-hidden border-0 bg-[var(--primary-light)] p-5 shadow-lg">
                <div className="flex items-center gap-2 text-[var(--primary)] mb-3">
                  <Microscope size={18} />
                  <h4 className="font-bold">Suggested Tests</h4>
                </div>
                <p className="text-sm whitespace-pre-wrap text-[var(--foreground)]">{parsed.tests}</p>
              </Card>
            )}
            {parsed.homeCare && (
              <Card className="overflow-hidden border-0 bg-[var(--success-light)] p-5 shadow-lg">
                <div className="flex items-center gap-2 text-[var(--success)] mb-3">
                  <Home size={18} />
                  <h4 className="font-bold">Home Care</h4>
                </div>
                <p className="text-sm whitespace-pre-wrap text-[var(--foreground)]">{parsed.homeCare}</p>
              </Card>
            )}
          </div>

          {parsed.emergencySigns && (
            <Card className="overflow-hidden border-0 bg-[var(--danger-light)] p-6 shadow-lg">
              <div className="flex items-center gap-2 text-[var(--danger)] mb-3">
                <AlertTriangle size={20} />
                <h4 className="font-bold">Emergency Warning Signs</h4>
              </div>
              <p className="text-sm leading-7 whitespace-pre-wrap text-[var(--foreground)]">{parsed.emergencySigns}</p>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SymptomChecker;
