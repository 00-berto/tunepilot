import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@renderer/lib/store";
import { IAudioMetadata, parseBlob } from "music-metadata";
import { useEffect, useRef, useState } from "react";
import { useFileBlob } from "@renderer/lib/hooks/useFileBlob";
import {
  setFile,
  setIsPlaying,
  setProgress,
  setSongDetails,
} from "@renderer/lib/slices/tuneSlice";
import {
  EllipsisIcon,
  FastForwardIcon,
  MoveDiagonalIcon,
  PauseIcon,
  PlayIcon,
} from "lucide-react";
import { getAudioUrl } from "@renderer/lib/hooks/getAudioUrl";

export function getCoverSrc(
  pictures?: IAudioMetadata["common"]["picture"],
): string {
  if (!pictures || pictures.length === 0) return "/no_cover.png";
  const picture = pictures[0];
  const mimeType = picture.format || "image/jpeg";
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < picture.data.length; i += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      picture.data.slice(i, i + chunkSize) as unknown as number[],
    );
  }
  const base64 = btoa(binary);
  return `data:${mimeType};base64,${base64}`;
}

export default function NowPlaying() {
  const tune = useSelector((state: RootState) => state.tune);
  const { blob } = useFileBlob(tune.file);
  const dispatch = useDispatch();
  const [metadata, setMetadata] = useState<IAudioMetadata | undefined>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const files = useSelector((state: RootState) => state.files.files);

  useEffect(() => {
    const getMetadata = async () => {
      if (!blob) return;
      const metadata = await parseBlob(blob);
      setMetadata(metadata);
    };
    getMetadata().then();
  }, [blob]);

  useEffect(() => {
    if (tune.file) {
      getAudioUrl(tune.file).then(setAudioUrl);
    }
  }, [tune.file]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [audioUrl]);

  useEffect(() => {
    if (audioUrl && metadata && audioRef.current) {
      dispatch(
        setSongDetails({
          name: metadata.common.title ?? "Metadata title missing!",
          artist: metadata.common.artist ?? "Metadata artist missing!",
          album: {
            name: metadata.common.album ?? "Metadata album missing!",
            cover: getCoverSrc(metadata.common.picture),
          },
          duration: Math.floor(audioRef.current.duration),
        }),
      );
    }
  }, [audioUrl, metadata, audioRef.current]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("nexttrack", () =>
        handleSkip("next"),
      );
      navigator.mediaSession.setActionHandler("previoustrack", () =>
        handleSkip("prev"),
      );
    }
    // Optional: cleanup
    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
      }
    };
  }, [tune.file, files]);

  function parseTime(time: number): string {
    if (!Number.isFinite(time) || isNaN(time)) return "-:--";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !tune.songDetails.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    audioRef.current.currentTime = percent * tune.songDetails.duration;
    dispatch(setProgress(Math.floor(audioRef.current.currentTime)));
  };

  const clearSong = () => {
    dispatch(setFile(""));
    dispatch(
      setSongDetails({
        name: "",
        artist: "",
        album: {
          name: "",
          cover: "",
        },
        duration: 0,
        progress: 0,
      }),
    );
  };

  const handleSkip = (direction: "next" | "prev") => {
    if (!tune.file || !files.length) return;
    const currentIndex = files.findIndex((f) => f.path === tune.file);
    if (currentIndex === -1) return clearSong();
    let newIndex: number;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % files.length;
    } else {
      if (audioRef.current && audioRef.current.currentTime < 3) {
        newIndex = (currentIndex - 1 + files.length) % files.length;
      } else {
        if (audioRef.current) audioRef.current.currentTime = 0;
        return;
      }
    }
    dispatch(setFile(files[newIndex].path));
  };

  return (
    <div className={"flex flex-col gap-5 w-full select-none"}>
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        className="hidden"
        onTimeUpdate={() => {
          if (audioRef.current) {
            dispatch(setProgress(Math.floor(audioRef.current.currentTime)));
          }
        }}
        onPlay={() => {
          dispatch(setIsPlaying(true));
        }}
        onPause={() => {
          dispatch(setIsPlaying(false));
        }}
        onEnded={() => {
          handleSkip("next");
        }}
      />
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-0 items-start">
          <div className="text-dominant-foreground/50 uppercase font-black text-xs">
            Now Playing
          </div>
          <div className="text-dominant-foreground/90 text-base font-bold line-clamp-1">
            {tune.songDetails.album.name}
          </div>
        </div>
        <div className="flex flex-row items-center justify-center">
          <div className="flex items-center justify-center p-1.5 rounded-full hover:bg-dominant-foreground/10 aspect-square">
            <EllipsisIcon className={"size-5"} />
          </div>
          <div className="flex items-center justify-center p-1.5 rounded-full hover:bg-dominant-foreground/10 aspect-square">
            <MoveDiagonalIcon className={"size-5"} />
          </div>
        </div>
      </div>
      <img
        src={tune.songDetails.album.cover || "/no_cover.png"}
        crossOrigin={"anonymous"}
        alt={"album cover"}
        className={"rounded-md aspect-square w-full h-auto object-cover"}
        draggable={false}
      />
      <div className="flex flex-col gap-0">
        <div className="text-dominant-foreground/90 text-2xl font-bold line-clamp-2">
          {tune.songDetails.name}
        </div>
        <div className="text-dominant-foreground/50 text-sm font-bold">
          {tune.songDetails.artist}
        </div>
      </div>
      <div className="flex flex-col gap-0.5 w-full">
        <div
          onClick={handleProgressBarClick}
          className="flex flex-row gap-0 h-1.5 rounded-full overflow-hidden hover:h-3 transition-all ease-out duration-100"
        >
          <div
            className="bg-white"
            style={{
              width: `${(tune.songDetails.progress / tune.songDetails.duration) * 100}%`,
            }}
          />
          <div className="flex-grow bg-white/50" />
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-xs font-black text-dominant-foreground/50">
            {parseTime(tune.songDetails.progress)}
          </div>
          <div className="text-xs font-black text-dominant-foreground/50">
            {parseTime(tune.songDetails.duration)}
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-8 justify-center items-center origin-center">
        <FastForwardIcon
          onClick={() => handleSkip("prev")}
          className={
            "size-14 rotate-180 fill-current opacity-50 hover:opacity-100 transition-all ease-out duration-75"
          }
        />
        {tune.playing ? (
          <PauseIcon
            onClick={() => audioRef.current?.pause()}
            className={
              "size-16 fill-current opacity-50 hover:opacity-100 transition-all ease-out duration-75"
            }
          />
        ) : (
          <PlayIcon
            onClick={() => audioRef.current?.play()}
            className={
              "size-16 fill-current opacity-50 hover:opacity-100 transition-all ease-out duration-75"
            }
          />
        )}
        <FastForwardIcon
          onClick={() => handleSkip("next")}
          className={
            "size-14 fill-current opacity-50 hover:opacity-100 transition-all ease-out duration-75"
          }
        />
      </div>
    </div>
  );
}
