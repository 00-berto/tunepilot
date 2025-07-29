// this code is mostly ai generated
// idk how to handle colors this shit is too complicated for me
// sorry

const isTooBlackOrWhite = ([r, g, b]: [number, number, number]) => {
  const threshold = 30;
  return (
    (r < threshold && g < threshold && b < threshold) ||
    (r > 255 - threshold && g > 255 - threshold && b > 255 - threshold)
  );
};

const getBrightness = ([r, g, b]: [number, number, number]) =>
  0.299 * r + 0.587 * g + 0.114 * b;

const rgbToHsv = ([r, g, b]: [number, number, number]) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const v = max;
  const s = max === 0 ? 0 : (max - min) / max;
  return { s, v };
};

const paleColor = ([r, g, b]: [number, number, number]) => {
  const blendWith = 255;
  const mix = 0.2;
  return [
    Math.round(r * (1 - mix) + blendWith * mix),
    Math.round(g * (1 - mix) + blendWith * mix),
    Math.round(b * (1 - mix) + blendWith * mix),
  ];
};

export const getDominantColor = (image: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = 50;
  canvas.height = 50;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const colorCount: Record<string, number> = {};
  let maxSaturation = -1;
  let mostSaturated: [number, number, number] | null = null;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2],
      a = data[i + 3];
    if (a < 200) continue;
    if (isTooBlackOrWhite([r, g, b])) continue;

    const key = `${r},${g},${b}`;
    colorCount[key] = (colorCount[key] || 0) + 1;

    const { s } = rgbToHsv([r, g, b]);
    if (s > maxSaturation) {
      maxSaturation = s;
      mostSaturated = [r, g, b];
    }
  }

  let dominant: [number, number, number] | null = null;
  let maxCount = 0;
  for (const key in colorCount) {
    if (colorCount[key] > maxCount) {
      maxCount = colorCount[key];
      dominant = key.split(",").map(Number) as [number, number, number];
    }
  }

  let chosen: [number, number, number] | null = null;
  if (
    mostSaturated &&
    colorCount[`${mostSaturated[0]},${mostSaturated[1]},${mostSaturated[2]}`] /
      (maxCount || 1) >=
      0.1
  ) {
    chosen = mostSaturated;
  } else if (dominant) {
    chosen = dominant;
  }

  if (!chosen) chosen = [128, 128, 128];

  // sorry for the any type i truly have no idea why it wont shut up
  const paled: any = paleColor(chosen);
  const brightness = getBrightness(paled);

  const brightnessThreshold = 999;

  const foreground = brightness < brightnessThreshold ? "#ffffff" : "#000000";
  const background = brightness < brightnessThreshold ? "#000000" : "#ffffff";
  const dynamic = brightness < 100 ? "#ffffff" : "#000000";

  return {
    dominant: `rgb(${paled.join(",")})`,
    foreground,
    background,
    dynamic,
  };
};
