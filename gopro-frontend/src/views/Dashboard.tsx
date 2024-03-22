import { motion } from "framer-motion";
import { DashboardContentContainer } from "../components/DashboardContentContainer/DashboardContentContainer";
import { useMutation, useQuery } from "react-query";
import { API_URL } from "../utils/variables";
import React, { useRef, useState } from "react";
import ReactHlsPlayer from "react-hls-player";
import { GoPro } from "../store/goproStore";
import classNames from "classnames";
import { Button } from "../components/Button/Button";

export const Dashboard = () => {
  const { data: goproData, isError: isErrorGoProData } = useQuery(
    ["dashboard_gopro_data"],
    getData
  );
  const [refetchInterval, setRefetchInterval] = useState<number | false>(1000);
  const mutationData = useMutation(["start_stream"], handlePrepareStream);
  const ref = useRef<HTMLVideoElement | null>(null);
  const videoContainerClasses = classNames(
    "w-full overflow-hidden h-full mb-6 lg:max-h-[calc(550/16*1rem)] xl:max-h-[calc(720/16*1rem)] border border-gray-500 rounded-md flex justify-center"
  );
  const playlistData = useQuery(
    "dashboard_stream_playlist",
    handleSearchPlaylist,
    {
      refetchInterval,
      onSuccess: (data) => {
        if (data.has_streaming_playlist === true) {
          setRefetchInterval(false);
        }
      },
      enabled: mutationData.isSuccess === true,
    }
  );
  let isLoadingStream =
    mutationData.isLoading ||
    playlistData.isLoading === true ||
    playlistData.data?.has_streaming_playlist === false
      ? true
      : false;

  return (
    <motion.main
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <DashboardContentContainer className="flex-col">
        <div className="w-full grow mb-5">
          <div className="mb-3 min-h-[calc(96/16*1rem)]">
            {isErrorGoProData && (
              <>
                <p className="mb-1">
                  Lost connection.. Do you want to reconnect to &nbsp;
                  {localStorage.getItem("target")}?
                </p>
                <Button
                  className="bg-black text-white w-[calc(170/16*1rem)]"
                  text="Connect"
                />
              </>
            )}
          </div>
          <React.Fragment>
            {goproData && (
              <p className="text-center text-[calc(36/16*1rem)] font-[700] w-max">
                {goproData.SSID}
              </p>
            )}
            <div className={videoContainerClasses}>
              {!playlistData.data?.has_streaming_playlist && (
                <Button
                  className="bg-black h-max my-auto text-white w-[calc(170/16*1rem)]"
                  text="Start streaming"
                  isLoading={isLoadingStream}
                  onClick={() => mutationData.mutate()}
                />
              )}
              {playlistData.data?.has_streaming_playlist === true && (
                <ReactHlsPlayer
                  playerRef={ref}
                  src={`${API_URL}/streaming/output.m3u8`}
                  autoPlay={true}
                  controls={false}
                  width="100%"
                  height="100%"
                />
              )}
              {playlistData.isError && (
                <span className="text-red-500 text-sm absolute">
                  Error loading stream
                </span>
              )}
            </div>
          </React.Fragment>
          <div className="p-5 border h-[calc(250/16*1rem)] border-gray-500 rounded-md">
            <div className="flex ">
              <Button
                className="bg-red-500 text-white"
                text="Stop streaming"
                onClick={() => handleStopStreaming()}
              />
            </div>
          </div>
        </div>
      </DashboardContentContainer>
    </motion.main>
  );

  async function getData() {
    try {
      const response = await fetch(`${API_URL}/get_gopro_data`, {
        method: "GET",
      });

      if (response.status === 404) {
        throw new Error("GoPro not found");
      }

      const json = (await response.json()) as GoPro;

      return json;
    } catch (e) {
      console.log(e);
      // navigate("/");
      throw new Error(`${e}`);
    }
  }

  async function handlePrepareStream() {
    try {
      const response = await fetch(`${API_URL}/start_stream`, {
        method: "POST",
      });

      if (response.status === 404) {
        throw new Error("GoPro not found");
      }

      const json = await response.json();
      return json;
    } catch (e) {
      throw new Error(`${e}`);
    }
  }

  async function handleSearchPlaylist() {
    try {
      const response = await fetch(`${API_URL}/has_streaming_playlist`, {
        method: "GET",
      });

      if (response.status === 404) {
        throw new Error("File not found");
      }

      const playlistJson = (await response.json()) as {
        has_streaming_playlist: boolean;
      };

      return playlistJson;
    } catch (e) {
      throw new Error(`${e}`);
    }
  }

  async function handleStopStreaming() {
    if (!ref || !ref.current) {
      return;
    }

    ref.current.pause();

    try {
      const response = await fetch(`${API_URL}/stop_stream`, {
        method: "POST",
      });

      if (response.status !== 200) {
        throw new Error("Error during stopping the stream");
      }

      return true;
    } catch (e) {
      throw new Error("Error whilst stopping the stream");
    }
  }
};
