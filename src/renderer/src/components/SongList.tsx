import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@renderer/lib/store";
import { setFile } from "@renderer/lib/slices/tuneSlice";
import { getDominantColor } from "@renderer/lib/hooks/getDominantColor";
import { useState } from "react";

export default function SongList() {
  const files = useSelector((state: RootState) => state.files.files);
  const loading = useSelector((state: RootState) => state.files.loading);
  const loadedFiles = useSelector(
    (state: RootState) => state.files.loadedFiles,
  );
  const fileCount = useSelector((state: RootState) => state.files.fileCount);
  const path = localStorage.getItem("path");
  const searchInput = useSelector((state: RootState) => state.tune.search);

  if (!path) {
    return (
      <div
        className={
          "select-none size-full flex flex-col gap-3 items-center justify-center"
        }
      >
        <div className="text-xl font-bold">
          Please specify a path inside your local storage.
        </div>
        <div className="">
          Don't worry, this process will be more streamlined soon.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={
          "select-none size-full flex flex-col gap-3 items-center justify-center"
        }
      >
        <div className="text-xl font-bold">
          Please wait while we load your music.
        </div>
        <div className="">
          Forgive us if this process takes long, we are looking for ways to make
          it faster.
        </div>
        <div className="">
          ({loadedFiles}/{fileCount} files loaded)
        </div>
      </div>
    );
  }

  const filteredFiles = files.filter((file) => {
    const search = searchInput?.toLowerCase() || "";
    return (
      file.name.toLowerCase().includes(search) ||
      file.artist?.toLowerCase().includes(search) ||
      file.album.name.toLowerCase().includes(search)
    );
  });

  return (
    <div className={"flex flex-col gap-1 items-start justify-start"}>
      {(filteredFiles.length > 0 ? filteredFiles : files).map((file) => {
        return <Song file={file} />;
      })}
    </div>
  );
}

function Song({
  file,
}: {
  file: {
    path: string;
    name: string;
    artist: string;
    album: {
      name: string;
      cover: string;
    };
  };
}) {
  const dispatch = useDispatch();
  const [dominantColor, setDominantColor] = useState("#ffffff");

  const rgbToRgba = (rgb: string, alpha: number): string => {
    return rgb.replace(/^rgb\((.+)\)$/i, `rgba($1, ${alpha})`);
  };

  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = file.album.cover;
  img.onload = () => {
    const { dominant } = getDominantColor(img);
    setDominantColor(dominant);
  };
  const backgroundColor = rgbToRgba(dominantColor, 0.5);

  return (
    <div
      onClick={() => {
        dispatch(setFile(file.path));
      }}
      style={{
        outlineColor: dominantColor,
        background: `linear-gradient(to right, ${backgroundColor} 0%, rgba(0,0,0,0) 70%, rgba(0,0,0,0) 100%)`,
      }}
      className={
        "flex flex-row items-center justify-start gap-3 p-2 hover:outline-2 bg-opacity-10 outline-dominant rounded-md h-auto w-full transition-all ease-out duration-75 cursor-pointer select-none"
      }
    >
      <img
        src={file.album.cover}
        alt={"album cover"}
        className={"aspect-square size-12 rounded-md"}
      />
      <div className="flex flex-col gap-1">
        <div className="font-bold text-dominant-foreground/90">{file.name}</div>
        <div className="text-xs font-semibold text-dominant-foreground/50">
          {file.artist}
        </div>
      </div>
    </div>
  );
}
