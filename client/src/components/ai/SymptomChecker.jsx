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
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 p-6 shadow-xl shadow-slate-200/50 dark:from-slate-900 dark:to-slate-950 dark:shadow-black/20">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white">
          <Stethoscope size={20} className="text-blue-600" />
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
          <div className="flex items-center gap-4 rounded-2xl bg-white/80 px-6 py-4 shadow-lg backdrop-blur-xl dark:bg-slate-800/80">
            <Spinner size="lg" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Analyzing your symptoms...</span>
          </div>
        </div>
      )}

      {error && (
        <Card variant="danger" className="p-4">
          <p className="text-sm text-red-600">{error}</p>
        </Card>
      )}

      {parsed && !analyzing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {parsed.possibleDiseases && (
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 shadow-lg shadow-amber-500/5 dark:from-amber-950/30 dark:to-orange-950/20">
              <div className="flex items-center gap-2 text-amber-600 mb-3">
                <AlertTriangle size={20} />
                <h4 className="font-bold">Possible Conditions</h4>
              </div>
              <p className="text-sm leading-7 whitespace-pre-wrap text-slate-700 dark:text-slate-300">{parsed.possibleDiseases}</p>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {parsed.severity && (
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-red-50 to-rose-50/50 p-5 shadow-lg shadow-red-500/5 dark:from-red-950/30 dark:to-rose-950/20">
                <div className="flex items-center gap-2 text-red-500 mb-3">
                  <Ambulance size={18} />
                  <h4 className="font-bold">Severity</h4>
                </div>
                <p className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">{parsed.severity}</p>
              </Card>
            )}
            {parsed.specialist && (
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-violet-50/50 p-5 shadow-lg shadow-purple-500/5 dark:from-purple-950/30 dark:to-violet-950/20">
                <div className="flex items-center gap-2 text-purple-600 mb-3">
                  <UserRound size={18} />
                  <h4 className="font-bold">Recommended Specialist</h4>
                </div>
                <p className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">{parsed.specialist}</p>
              </Card>
            )}
            {parsed.tests && (
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-5 shadow-lg shadow-blue-500/5 dark:from-blue-950/30 dark:to-indigo-950/20">
                <div className="flex items-center gap-2 text-blue-600 mb-3">
                  <Microscope size={18} />
                  <h4 className="font-bold">Suggested Tests</h4>
                </div>
                <p className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">{parsed.tests}</p>
              </Card>
            )}
            {parsed.homeCare && (
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50/50 p-5 shadow-lg shadow-green-500/5 dark:from-green-950/30 dark:to-emerald-950/20">
                <div className="flex items-center gap-2 text-green-600 mb-3">
                  <Home size={18} />
                  <h4 className="font-bold">Home Care</h4>
                </div>
                <p className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">{parsed.homeCare}</p>
              </Card>
            )}
          </div>

          {parsed.emergencySigns && (
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-red-50 to-rose-50/50 p-6 shadow-lg shadow-red-500/10 dark:from-red-950/30 dark:to-rose-950/20">
              <div className="flex items-center gap-2 text-red-600 mb-3">
                <AlertTriangle size={20} />
                <h4 className="font-bold">Emergency Warning Signs</h4>
              </div>
              <p className="text-sm leading-7 whitespace-pre-wrap text-slate-700 dark:text-slate-300">{parsed.emergencySigns}</p>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SymptomChecker;
