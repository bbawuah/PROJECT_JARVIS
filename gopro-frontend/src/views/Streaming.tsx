import { motion } from "framer-motion";
import { DashboardContentContainer } from "../components/DashboardContentContainer/DashboardContentContainer";

export const Streaming = () => {
  return (
    <motion.main
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <DashboardContentContainer>
        <div className="self-center mx-auto">
          <p className="text-center text-[calc(36/16*1rem)] font-[700] w-max">
            Streaming
          </p>
        </div>
      </DashboardContentContainer>
    </motion.main>
  );
};
