import { motion } from "framer-motion";
import PageHeader from "@/components/common/PageHeader";
import { SymptomChecker } from "@/components/ai";

const SymptomCheckerPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PageHeader
        title="Symptom Checker"
        description="Analyze your symptoms and get AI-powered insights"
        badge="AI Powered"
      />
      <SymptomChecker />
    </motion.div>
  );
};

export default SymptomCheckerPage;
