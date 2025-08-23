import type { Units } from '../config';
import type { Bounds } from './collision';

export type View = {
  id: string;
  bounds: Bounds;
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
  /**
   * Indicates if the shapeProps dimensions have been calculated from rendering
   */
  dimensionsCalculated?: boolean;
  textProps: {
    text: string | number;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
  };
};

export type InteractiveView = View & {
  /**
   * Event handlers for interactive functionality
   */
  handlers?: {
    onClick?: (event: MouseEvent, view: View) => void;
    onMouseMove?: (event: MouseEvent, view: View) => void;
    onHover?: (event: MouseEvent, view: View) => void;
    onHoverOut?: (event: MouseEvent, view: View) => void;
    onTouchStart?: (event: TouchEvent, view: View) => void;
    onTouchEnd?: (event: TouchEvent, view: View) => void;
    onDrag?: (event: MouseEvent, view: View) => void;
  };
  /**
   * Indicates if this view is interactive
   */
  interactive?: boolean;
};

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

// Re-export ViewInstance from view.ts
export type { ViewInstance } from './view';