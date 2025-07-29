export async function getAudioUrl(filePath: string): Promise<string> {
  const buffer = await window.api.readFile(filePath); // Should return Uint8Array
  const ext = filePath.slice(filePath.lastIndexOf(".") + 1);
  const mimeType = `audio/${ext === "mp3" ? "mpeg" : ext}`;
  const blob = new Blob([buffer], { type: mimeType });
  return URL.createObjectURL(blob);
}
