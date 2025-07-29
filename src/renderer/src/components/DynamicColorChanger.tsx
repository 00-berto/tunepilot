import { getDominantColor } from "@renderer/lib/hooks/getDominantColor";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@renderer/lib/store";

export default function DynamicColorChanger() {
  const imageUrl = useSelector(
    (state: RootState) => state.tune.songDetails.album.cover,
  );

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const { dominant, background, foreground, dynamic } =
        getDominantColor(img);
      document.documentElement.style.setProperty("--color-dominant", dominant);

      document.documentElement.style.setProperty(
        "--color-dominant-background",
        background,
      );

      document.documentElement.style.setProperty(
        "--color-dominant-foreground",
        foreground,
      );

      document.documentElement.style.setProperty(
        "--color-dominant-dynamic",
        dynamic,
      );
    };
  }, [imageUrl]);

  return null;
}
