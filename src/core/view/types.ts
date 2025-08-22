import type { Units } from '../config';

export type ViewRenderProps = {
  fill: {
    color: string;
  };
  stroke: {
    color: string;
    width: number;
  };
  /**
   * Position to start drawing from
   */
  anchor: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  /**
   * Relative to the anchor position
   */
  position: Position;
  /**
   * Units for position and size values
   */
  units: Units;
  /**
   * Position relative to screen corners or center (ignores anchor when used)
   */
  relativeTo?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  shape: 'rect' | 'circle' | 'line' | 'text';
  shapeProps: {
    width: number;
    height: number;
    radius: number;
  };
  textProps: {
    text: string | number;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
  };
};

export type Position = {
  x: number;
  y: number;
};

export type View = {
  /**
   * The anchor position of the view (where it's positioned based on anchor setting)
   */
  position: Position;
  /**
   * Width and height of the view in pixels
   */
  size: {
    width: number;
    height: number;
  };
};