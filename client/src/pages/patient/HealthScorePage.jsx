import { motion } from "framer-motion";
import PageHeader from "@/components/common/PageHeader";
import { HealthScore } from "@/components/ai";

const HealthScorePage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PageHeader
        title="Health Score"
        description="Calculate your AI-powered health assessment score"
        badge="AI Powered"
      />
      <HealthScore />
    </motion.div>
  );
};

export default HealthScorePage;
