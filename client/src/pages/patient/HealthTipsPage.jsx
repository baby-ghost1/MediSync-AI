import { motion } from "framer-motion";
import PageHeader from "@/components/common/PageHeader";
import { HealthTips } from "@/components/ai";

const HealthTipsPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PageHeader
        title="Health Tips"
        description="Get personalized health tips based on your age and lifestyle"
        badge="AI Powered"
      />
      <HealthTips />
    </motion.div>
  );
};

export default HealthTipsPage;
