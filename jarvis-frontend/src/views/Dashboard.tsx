import { motion } from "framer-motion";
import { DashboardContentContainer } from "../components/DashboardContentContainer/DashboardContentContainer";
import { useMutation, useQuery } from "react-query";
import { API_URL } from "../utils/variables";
import React, { useRef, useState } from "react";
import classNames from "classnames";
import { Button } from "../components/Button/Button";
import { VideoPlayer } from "../components/Video/Video";
import { AudioPlayer } from "../components/Audio/Audio";
import { GoPro } from "../types/types";

export const Dashboard = () => {
  const { data: goproData, isError: isErrorGoProData } = useQuery(
    ["dashboard_gopro_data"],
    getData
  );
  const [shouldStop, setShouldStop] = useState<boolean>(false);
  const [refetchInterval, setRefetchInterval] = useState<number | false>(1000);
  const [refetchIntervalAudio, setRefetchIntervalAudio] = useState<
    number | false
  >(1000);
  const mutationData = useMutation(["start_stream"], handlePrepareStream);
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
  const audioPlaylistData = useQuery(
    "dashboard_audio_stream_playlist",
    handleSearchAudioPlaylist,
    {
      refetchInterval: refetchIntervalAudio,
      onSuccess: (data) => {
        if (data.has_streaming_playlist === true) {
          setRefetchIntervalAudio(false);
        }
      },
      enabled: playlistData.data?.has_streaming_playlist === true,
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
            {goproData && (
              <>
                <p className="text-center text-[calc(36/16*1rem)] font-[700] w-max">
                  {goproData.hardware_info.data.ap_ssid}
                </p>
                <p className="text-center text-[calc(18/16*1rem)] font-[500] w-max">
                  firmware_version:{" "}
                  {goproData.hardware_info.data.firmware_version}
                </p>
              </>
            )}
          </div>
          <React.Fragment>
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
                <VideoPlayer
                  shouldStop={shouldStop}
                  className="w-full h-full"
                  src={`${API_URL}/streaming/video/output.m3u8`}
                />
              )}

              {audioPlaylistData.data?.has_streaming_playlist === true && (
                <AudioPlayer
                  src={`${API_URL}/streaming/audio/output.m3u8`}
                  className="absolute invisible"
                  shouldStop={shouldStop}
                />
              )}
              {playlistData.isError && (
                <span className="text-red-500 text-sm absolute">
                  Error loading stream
                </span>
              )}
            </div>
          </React.Fragment>
          <div className="p-5 border border-gray-500 rounded-md">
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

  async function handleSearchAudioPlaylist() {
    try {
      const response = await fetch(`${API_URL}/has_audio_streaming_playlist`, {
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
    setShouldStop(true);

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
