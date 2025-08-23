import type { Units } from '../config';
import type { createEvents } from '../events/events';

export type ViewRenderProps = {
  id: string;
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
   * Unique identifier for the view
   */
  id: string;
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

export type ViewInstance = {
  update: () => void;
  events: ReturnType<typeof createEvents>;
  updatePosition: (newPosition: Position) => void;
  updateFillColor: (color: string) => void;
  updateStrokeColor: (color: string) => void;
  updateStrokeWidth: (width: number) => void;
  updateSize: (width: number, height: number) => void;
  updateText: (text: string | number) => void;
  updateFontSize: (fontSize: number) => void;
  props: ViewRenderProps;
};

export type AnimatedViewInstance = ViewInstance & {
  addAnimation: (callback: () => void) => void;
  animate: () => void;
};