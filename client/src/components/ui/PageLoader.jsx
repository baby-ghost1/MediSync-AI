import Spinner from "./Spinner";

const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <Spinner size="xl" text="Loading..." />
    </div>
  );
};

export default PageLoader;
