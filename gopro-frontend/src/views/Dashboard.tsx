import { motion } from "framer-motion";
import { DashboardContentContainer } from "../components/DashboardContentContainer/DashboardContentContainer";
import { useMutation, useQuery } from "react-query";
import { API_URL } from "../utils/variables";
import { useStore } from "../hooks/useStore";
import Progress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import ReactHlsPlayer from "react-hls-player";
import { Button } from "../components/Button/Button";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isError, isFetching } = useQuery(
    ["dashboard"],
    validateConnection
  );
  const ref = useRef<HTMLVideoElement | null>(null);
  const { gopro } = useStore();
  const {
    mutate,
    data: isMutationData,
    isLoading,
    isError: isMutationError,
  } = useMutation(["start_stream"], handleOnStream);

  return (
    <motion.main
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <DashboardContentContainer>
        <div className="w-full">
          {isError && <p>Lost connection</p>}
          {isFetching && <Progress />}
          {data && (
            <React.Fragment>
              <p className="text-center text-[calc(36/16*1rem)] font-[700] w-max">
                {gopro?.SSID}
                {gopro?.hardware_info.status}
              </p>
              <div className="w-full overflow-hidden h-auto min-h-[calc(350/16*1rem)] border border-gray-500 rounded-md flex justify-center">
                {!isMutationData && (
                  <Button
                    isLoading={isLoading}
                    onClick={() => mutate()}
                    text="Start streaming"
                    isLoadingText="Getting stream.."
                    className="bg-black text-white h-max my-auto w-[calc(180/16*1rem)]"
                  />
                )}
                {isMutationData && (
                  <ReactHlsPlayer
                    playerRef={ref}
                    src={`${API_URL}/streaming/output.m3u8`}
                    autoPlay={true}
                    controls={false}
                    width="100%"
                    height="100%"
                  />
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </DashboardContentContainer>
    </motion.main>
  );

  async function validateConnection() {
    try {
      const response = await fetch(`${API_URL}/is_connected`, {
        method: "GET",
      });

      if (response.status === 404) {
        throw new Error("GoPro not found");
      }

      const json = (await response.json()) as { is_connected: boolean };

      if (!json.is_connected) {
        navigate("/");
      }

      return json;
    } catch (e) {
      throw new Error(`${e}`);
    }
  }

  async function handleOnStream() {
    try {
      const response = await fetch(`${API_URL}/start_stream`, {
        method: "POST",
      });

      if (response.status === 404) {
        throw new Error("GoPro not found");
      }

      const json = (await response.json()) as { is_connected: boolean };

      console.log(json);

      return json;
    } catch (e) {
      throw new Error(`${e}`);
    }
  }
};
