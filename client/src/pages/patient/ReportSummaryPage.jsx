import { motion } from "framer-motion";
import PageHeader from "@/components/common/PageHeader";
import { ReportSummary } from "@/components/ai";

const ReportSummaryPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PageHeader
        title="Report Summary"
        description="Get AI-generated summaries of your medical reports"
        badge="AI Powered"
      />
      <ReportSummary />
    </motion.div>
  );
};

export default ReportSummaryPage;
