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

/**
 * Convert font size with units to pixels
 */
export const convertFontSizeToPixels = (fontSize: number): number => {
  return convertToPixels(fontSize, config.geometry.units[0]);
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

export const convertViewportUnits = (value: number) => {
  if (config.geometry.units[0] === 'vh' && config.geometry.units[1] === 'vw') {
    console.log('vh to vw', value);
    return value * 100;
  }
  if (config.geometry.units[0] === 'vw' && config.geometry.units[1] === 'vh') {
    console.log('vw to vh', value);
    return value / 100;
  }
  return value;
};
