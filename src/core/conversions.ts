import { config, type Units } from './config';

/**
 * Convert viewport units (vh/vw) to pixels
 */
export const convertToPixels = (value: number, unit: Units): number => {
  switch (unit) {
    case 'vh':
      return (value / 100) * window.innerHeight;
    case 'vw':
      return (value / 100) * window.innerWidth;
    default:
      return value;
  }
};

/**
 * Assume default to vh, convert x and y to vw in pixels
 */
export const convertPositionToPixels = (
  x: number,
  y: number
): { x: number; y: number } => {
  const positionInPixels = {
    x: convertToPixels(x, 'vw'),
    y: convertToPixels(y, 'vh'),
  };

  return {
    x: positionInPixels.x,
    y: positionInPixels.y,
  };
};

// Assume default to vh, convert width to vw in pixels and height to pixels
export const convertSizeToPixels = (
  width: number,
  height: number,
  units: Units[]
): { width: number; height: number } => {
  const widthInPixels = convertToPixels(width, units[0]);
  const heightInPixels = convertToPixels(height, units[1]);

  return {
    width: widthInPixels,
    height: heightInPixels,
  };
};
