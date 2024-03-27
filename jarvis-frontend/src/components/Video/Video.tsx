import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

interface Props extends React.HTMLAttributes<HTMLVideoElement> {
  src: string;
  shouldStop?: boolean;
}

export const VideoPlayer = (props: Props) => {
  const { src, shouldStop, ...rest } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef || !videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        if (videoRef && videoRef.current) videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
      videoRef.current.addEventListener("loadedmetadata", function () {
        if (videoRef && videoRef.current) videoRef.current.play();
      });
    }
  }, [src]);

  useEffect(() => {
    if (!videoRef || !videoRef.current) return;

    if (shouldStop) {
      videoRef.current.pause();
    }
  }, [shouldStop]);

  return <video ref={videoRef} autoPlay {...rest} />;
};
