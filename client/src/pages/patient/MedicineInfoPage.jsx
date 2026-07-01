import { motion } from "framer-motion";
import PageHeader from "@/components/common/PageHeader";
import { MedicineInfo } from "@/components/ai";

const MedicineInfoPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <PageHeader
        title="Medicine Information"
        description="Look up detailed information about any medication"
        badge="AI Powered"
      />
      <MedicineInfo />
    </motion.div>
  );
};

export default MedicineInfoPage;
