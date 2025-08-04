import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFile } from "@renderer/lib/slices/tuneSlice";
import { parseBlob } from "music-metadata";
import {
  addFiles,
  incrementLoadedFileCount,
  removeEmptyFirstFile,
  setFileCount,
  setLoading,
} from "@renderer/lib/slices/filesSlice";
import { getCoverSrc } from "@renderer/components/NowPlaying";
import { getAudioUrl } from "@renderer/lib/hooks/getAudioUrl";
import { RootState } from "@renderer/lib/store";
import { openDB } from "idb";

export default function FilesList() {
  const [files, setFiles] = useState<string[]>([]);
  const dispatch = useDispatch();
  const path = localStorage.getItem("path");
  const musicExtensions = [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a"];
  const reduxFiles = useSelector((state: RootState) => state.files);

  if (!path) {
    return null;
  }

  const setSelectedFile = (file: string) => {
    dispatch(setFile(file));
  };

  useEffect(() => {
    const fetchFiles = async () => {
      const filesAndFolders = await getFiles(path);
      setFiles(filesAndFolders);
    };
    fetchFiles().then();
  }, [path]);

  useEffect(() => {
    const setFilesToRedux = async () => {
      const db = await openDB("FileMetadataDB", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("metadata")) {
            db.createObjectStore("metadata", { keyPath: "path" });
          }
        },
      });

      const filePayloads = await Promise.all(
        files.map(async (file) => {
          if (!file) return null;

          // Check if metadata is cached
          const cached = await db.get("metadata", file);
          if (cached) {
            dispatch(incrementLoadedFileCount());
            return cached;
          }

          // Fetch and parse metadata
          const url = await getAudioUrl(file);
          const response = await fetch(url);
          const blob = await response.blob();
          if (!blob) return null;
          const metadata = await parseBlob(blob);

          const payload = {
            path: file,
            name: metadata.common.title ?? "",
            artist: metadata.common.artist ?? "",
            album: {
              name: metadata.common.album ?? "",
              cover: getCoverSrc(metadata.common.picture),
            },
          };

          // Cache metadata in IndexedDB
          await db.put("metadata", payload);
          dispatch(incrementLoadedFileCount());
          return payload;
        }),
      );

      dispatch(addFiles(filePayloads.filter(Boolean)));
    };

    if (files.length > 0) {
      dispatch(setFileCount(files.length));
      setFilesToRedux().then(() => dispatch(setLoading(false)));
      dispatch(removeEmptyFirstFile());
    }
  }, [files, dispatch]);

  if (path && reduxFiles.files.length <= 1) {
    dispatch(setLoading(true));
  }

  async function getFiles(
    dir: string,
    filesArr: string[] = [],
  ): Promise<string[]> {
    const fileList: FileList = await window.api.readdirS(dir);
    for (const file of Array.from(fileList)) {
      const fullPath = `${dir}\\${file.name}`;
      if (await window.api.isDirectory(fullPath)) {
        await getFiles(fullPath, filesArr);
      } else {
        const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        if (musicExtensions.includes(ext)) {
          filesArr.push(fullPath);
        }
      }
    }
    return filesArr;
  }

  return (
    <div className={"flex flex-col gap-2"}>
      {files.length > 0 &&
        files.map((file) => (
          <div
            key={file}
            onClick={() => setSelectedFile(file)}
            className={"cursor-pointer"}
          >
            {file}
          </div>
        ))}
    </div>
  );
}
