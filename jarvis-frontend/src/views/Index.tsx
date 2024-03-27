import { motion } from "framer-motion";
import { Button } from "../components/Button/Button";
import { DashboardContentContainer } from "../components/DashboardContentContainer/DashboardContentContainer";
import { Form } from "../components/Form/Form";
import { Input } from "../components/DataEntry/Input/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { API_URL } from "../utils/variables";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Inputs {
  target: string;
}

export const Index = () => {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const onHandleSubmit: SubmitHandler<Inputs> = async (data) => {
    localStorage.setItem("target", data.target);

    try {
      const response = await fetch(`${API_URL}/connect`, {
        method: "POST",
        body: JSON.stringify({ target: data.target }),
      });

      if (response.status === 404) {
        throw new Error("GoPro not found");
      }

      const json = (await response.json()) as { is_connected: boolean };

      if (json.is_connected === true) {
        navigate("/dashboard");
      }
    } catch (error) {
      setFetchError("Could not connect to GoPro");
      return;
    }
  };

  return (
    <motion.main
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <DashboardContentContainer>
        <div className="relative self-center mx-auto w-[calc(560/16*1rem)]">
          <p className="text-center mb-4 text-[calc(36/16*1rem)] font-[700] w-max">
            Connect to a GoPro to get started!
          </p>
          <p className="mb-2">
            Make sure your GoPro is on and connected to your WiFi. Then, fill in
            your GoPro target (GoPro 1234) and click connect.
          </p>
          <Form
            className="flex flex-col space-y-2 mb-1"
            onSubmit={handleSubmit(onHandleSubmit)}
          >
            <div>
              <Input
                placeholder="GoPro 1234"
                className="w-full"
                error={errors.target}
                {...register("target", { required: true })}
              />
              <div className="h-4 mb-2">
                {errors.target && (
                  <span className="text-red-500 text-sm">
                    This field is required
                  </span>
                )}
              </div>
            </div>
            <Button
              type="submit"
              text="Connect"
              className="bg-black text-white"
              isLoading={isSubmitting}
            />
          </Form>

          {fetchError && (
            <span className="text-red-500 text-sm absolute">{fetchError}</span>
          )}
        </div>
      </DashboardContentContainer>
    </motion.main>
  );
};
