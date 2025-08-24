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
export const convertFontSizeToPixels = (
  fontSize: number,
  units?: Units
): number => {
  units = units ?? config.units;
  return convertToPixels(fontSize, units);
};

// Assume default to vh, convert width to vw in pixels and height to pixels
export const convertSizeToPixels = (
  width: number,
  height: number
): { width: number; height: number } => {
  // const widthInVh = convertViewportUnits(width, 'vw');
  // const heightInVh = convertViewportUnits(height, 'vh');

  const widthInPixels = convertToPixels(width, 'vh');
  const heightInPixels = convertToPixels(height, 'vh');

  return {
    width: widthInPixels,
    height: heightInPixels,
  };
};

export const convertViewportUnits = (value: number, units: Units) => {
  if (config.units === 'vh' && units === 'vw') {
    console.log('vh to vw', value);
    return value * 100;
  }
  if (config.units === 'vw' && units === 'vh') {
    console.log('vw to vh', value);
    return value / 100;
  }
  return value;
};
