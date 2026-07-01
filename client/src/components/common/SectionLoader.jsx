import Spinner from "@/components/ui/Spinner";

const SectionLoader = ({ text = "Loading..." }) => (
  <div className="flex min-h-[400px] items-center justify-center">
    <Spinner size="lg" text={text} />
  </div>
);

export default SectionLoader;
