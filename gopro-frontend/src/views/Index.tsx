import { motion } from "framer-motion";
import { Button } from "../components/Button/Button";
import { DashboardContentContainer } from "../components/DashboardContentContainer/DashboardContentContainer";
import { Input } from "../components/DataEntry/Input/Input";
import { Form } from "../components/Form/Form";

export const Index = () => {
  return (
    <motion.main
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <DashboardContentContainer>
        <div className="self-center mx-auto w-[calc(560/16*1rem)]">
          <p className="text-center mb-4 text-[calc(36/16*1rem)] font-[700] w-max">
            Connect to a GoPro to get started!
          </p>
          <Form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
            <Input name="ipAddress" placeholder="GoPro IP Address" />
            <Button
              type="submit"
              text="Connect"
              className="bg-black text-white"
            />
          </Form>
        </div>
      </DashboardContentContainer>
    </motion.main>
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ipAddress = formData.get("ipAddress") as string;
    console.log(ipAddress);
  }
};
