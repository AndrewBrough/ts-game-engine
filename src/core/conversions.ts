import { config, type Units } from './config';

/**
 * Convert viewport units (vh/vw) to pixels
 */
export const convertToPixels = (value: number, unit: Units): number => {
  switch (unit) {
    case 'px':
      return value;
    case 'vh':
      return (value / 100) * window.innerHeight;
    case 'vw':
      return (value / 100) * window.innerWidth;
    default:
      return value;
  }
};

/**
 * Convert multiple values with units to pixels
 */
export const convertPositionToPixels = (
  x: number,
  y: number,
  units?: Units
): { x: number; y: number } => {
  units = units ?? config.units;

  return {
    x: convertToPixels(x, units),
    y: convertToPixels(y, units),
  };
};

/**
 * Convert size values with units to pixels
 */
export const convertSizeToPixels = (
  width: number,
  height: number,
  units?: Units
): { width: number; height: number } => {
  units = units ?? config.units;

  return {
    width: convertToPixels(width, units),
    height: convertToPixels(height, units),
  };
};

/**
 * Convert font size with units to pixels
 */
export const convertFontSizeToPixels = (
  fontSize: number,
  units?: Units
): number => {
  units = units ?? config.units;
  return convertToPixels(fontSize, units);
};
