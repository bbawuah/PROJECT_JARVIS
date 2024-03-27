import { motion } from "framer-motion";
import { DashboardContentContainer } from "../components/DashboardContentContainer/DashboardContentContainer";

export const About = () => {
  return (
    <motion.main
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <DashboardContentContainer>
        <div className="">
          <p className="text-center text-[calc(36/16*1rem)] font-[700] w-max">
            About me
          </p>
        </div>
      </DashboardContentContainer>
    </motion.main>
  );
};
