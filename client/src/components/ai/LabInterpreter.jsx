import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Beaker, AlertCircle, LoaderCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/ui/EmptyState";
import aiService from "@/services/ai.service";

const TEST_TYPES = [
  "Complete Blood Count (CBC)",
  "Basic Metabolic Panel (BMP)",
  "Comprehensive Metabolic Panel (CMP)",
  "Lipid Panel",
  "Thyroid Function (TSH, T3, T4)",
  "Liver Function (LFT)",
  "Kidney Function (RFT)",
  "HbA1c / Blood Glucose",
  "Iron Studies",
  "Vitamin D / B12",
  "Cardiac Markers (Troponin, CK-MB)",
  "Coagulation Profile (PT, PTT, INR)",
  "Urinalysis",
  "Arterial Blood Gas (ABG)",
  "Other",
];

const LabInterpreter = () => {
  const [testType, setTestType] = useState("");
  const [customTest, setCustomTest] = useState("");
  const [results, setResults] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [interpreting, setInterpreting] = useState(false);
  const [interpretation, setInterpretation] = useState("");

  const handleInterpret = async () => {
    const type = testType === "Other" ? customTest : testType;
    if (!type || !results) {
      toast.error("Test type and results are required");
      return;
    }

    setInterpreting(true);
    setInterpretation("");

    try {
      const res = await aiService.interpretLabResults({
        testType: type,
        results,
        patientAge: patientAge || undefined,
        patientGender: patientGender || undefined,
      });
      setInterpretation(res.interpretation || "");
    } catch {
      toast.error("Failed to interpret lab results");
    } finally {
      setInterpreting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card paddingSize="lg">
        <CardHeader
          title="Lab Report Interpreter"
          description="Paste lab results for AI-powered clinical interpretation"
        />
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Select
            label="Test Type"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            options={[
              { value: "", label: "Select test type..." },
              ...TEST_TYPES.map((t) => ({ value: t, label: t })),
            ]}
          />
          {testType === "Other" && (
            <Input
              label="Custom Test Name"
              value={customTest}
              onChange={(e) => setCustomTest(e.target.value)}
              placeholder="e.g., Allergy Panel"
            />
          )}
          <Input
            label="Patient Age (optional)"
            type="number"
            value={patientAge}
            onChange={(e) => setPatientAge(e.target.value)}
            placeholder="e.g., 45"
          />
          <Select
            label="Patient Gender (optional)"
            value={patientGender}
            onChange={(e) => setPatientGender(e.target.value)}
            options={[
              { value: "", label: "Select..." },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="Lab Results"
            value={results}
            onChange={(e) => setResults(e.target.value)}
            placeholder={`Example:\nWBC: 11.5 x10^3/uL (Ref: 4.5-11.0)\nRBC: 4.2 x10^6/uL (Ref: 4.7-6.1)\nHemoglobin: 12.5 g/dL (Ref: 13.5-17.5)\nPlatelets: 150 x10^3/uL (Ref: 150-400)`}
            rows={6}
          />
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={handleInterpret} loading={interpreting} disabled={interpreting}>
            <Beaker size={16} /> {interpreting ? "Interpreting..." : "Interpret Results"}
          </Button>
        </div>
      </Card>

      {interpreting && (
        <Card paddingSize="lg">
          <div className="flex items-center justify-center gap-3 py-8">
            <LoaderCircle size={24} className="animate-spin text-[var(--primary)]" />
            <span className="text-sm text-[var(--muted-foreground)]">Analyzing lab results...</span>
          </div>
        </Card>
      )}

      {interpretation && !interpreting && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card paddingSize="lg">
            <CardHeader
              title="Interpretation"
              description="AI-powered clinical analysis of the provided lab results"
            />
            <div className="prose prose-sm mt-4 max-w-none text-[var(--foreground)]">
              <ReactMarkdown>{interpretation}</ReactMarkdown>
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-[var(--warning)]/20 bg-[var(--warning)]/5 p-4">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--warning)]" />
              <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                This interpretation is for educational purposes only and does not constitute a medical diagnosis. 
                Always consult with a qualified healthcare provider for clinical decision-making.
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {!interpretation && !interpreting && (
        <EmptyState
          icon={FlaskConical}
          title="Enter lab results to begin"
          description="Paste your lab test values above for AI-powered analysis with reference range checking and clinical context"
          compact
        />
      )}
    </div>
  );
};

export default LabInterpreter;
