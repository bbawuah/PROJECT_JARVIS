import Hls from "hls.js";
import { useEffect, useRef } from "react";

interface Props extends React.HTMLAttributes<HTMLAudioElement> {
  src: string;
  shouldStop?: boolean;
}

export const AudioPlayer = (props: Props) => {
  const { src, shouldStop, ...rest } = props;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef || !audioRef.current) return;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.config.debug = true;

      hls.loadSource(src);
      hls.attachMedia(audioRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        if (audioRef && audioRef.current) audioRef.current.play();
      });
    } else if (audioRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      audioRef.current.src = src;
      audioRef.current.addEventListener("loadedmetadata", function () {
        if (audioRef && audioRef.current) audioRef.current.play();
      });
    }
  }, [src]);

  useEffect(() => {
    if (!audioRef || !audioRef.current) return;

    if (shouldStop) {
      audioRef.current.pause();
    }
  }, [shouldStop]);

  return <audio ref={audioRef} {...rest} />;
};
