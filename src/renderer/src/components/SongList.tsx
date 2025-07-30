import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@renderer/lib/store";
import { setFile } from "@renderer/lib/slices/tuneSlice";
import { getDominantColor } from "@renderer/lib/hooks/getDominantColor";
import { useState } from "react";
import { toast } from "sonner";

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
          "select-none flex flex-col gap-8 items-center justify-center m-auto"
        }
      >
        <div className="flex flex-col gap-3 items-center justify-center">
          <div className="text-xl font-bold">
            Please paste the path to your music folder below.
          </div>
          <div className="">
            We're working on making this process easier and more streamlined.
          </div>
        </div>

        <form
          onSubmit={() => {
            localStorage.setItem(
              "path",
              (document.getElementById("path") as HTMLInputElement).value,
            );
            toast("Successfully set path!");
            // is this very unsafe? yes.
            // do i care? doesn't look like it.
          }}
          className="flex flex-row gap-2 w-full"
        >
          <input
            id={"path"}
            type={"text"}
            placeholder={"Your music folder"}
            className={
              "p-2 px-4 rounded-md outline-2 outline-dominant-foreground placeholder:text-dominant-foreground/80 w-full font-semibold focus-visible:ring-[4px] focus-visible:ring-dominant-foreground/50 transition-all ease-out duration-75"
            }
          />
          <button
            formAction={"submit"}
            className="p-2 px-3 bg-dominant text-dominant-background/80 rounded-md outline-2 outline-dominant font-semibold hover:bg-dominant/75 hover:outline-dominant/75 transition-all ease-out duration-75 cursor-pointer"
          >
            Submit
          </button>
        </form>
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
    <div className={"flex flex-col gap-1 items-start justify-start w-2/3"}>
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
  const [hovering, setHovering] = useState(false);

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
        transition: "background 0.3s ease-out",
        background: hovering
          ? `linear-gradient(to right, ${backgroundColor} 0%, ${backgroundColor} 30%, rgba(0,0,0,0) 100%)`
          : "none",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={
        "flex flex-row items-center justify-start gap-3 p-2 bg-opacity-10 hover:outline-2 outline-dominant rounded-md h-auto w-full transition-all ease-out duration-75 cursor-pointer select-none"
      }
    >
      <img
        src={file.album.cover}
        alt={"album cover"}
        className={"aspect-square size-12 rounded-md"}
        style={{
          boxShadow: "0 0 16px 4px " + backgroundColor,
        }}
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
