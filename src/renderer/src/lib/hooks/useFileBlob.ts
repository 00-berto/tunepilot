import { useEffect, useState } from "react";
import { getAudioUrl } from "@renderer/lib/hooks/getAudioUrl";

export function useFileBlob(path: string | undefined) {
  const [blob, setBlob] = useState<Blob | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!path) {
      setBlob(undefined);
      return;
    }
    setLoading(true);
    const fetchBlob = async () => {
      const url = await getAudioUrl(path);
      const response = await fetch(url);
      const fileBlob = await response.blob();
      setBlob(fileBlob);
      setLoading(false);
    };
    fetchBlob().then();
  }, [path]);

  return { blob, loading };
}
