import type { Units } from '../config';
import type { CollisionLayer } from '../gameState/collisionLayers';
import type { AnimatedViewInstance } from './animatedView';
import type { Bounds } from './collision';
import type { InteractiveViewInstance } from './interactiveView';
import type { EntityViewInstance } from './player/entityView';
import type { ViewInstance } from './view';

export type View<T extends object = {}> = {
  id: string;
  model: T | object;
  layer: CollisionLayer;
  bounds?: Bounds;
  scale: number;
  force: Position;
  fill: {
    color: string;
    opacity: number;
  };
  stroke: {
    color: string;
    opacity: number;
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
  relativeTo?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'center';
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
  /**
   * Physics properties for entity movement and forces
   */
  physics?: {
    dampening: number; // Air resistance factor (0-1, where 1 = no dampening, 0 = full stop)
  };
};

export type InteractiveView = AnimatedView & {
  interactive: boolean;
  /**
   * Event handlers for interactive functionality
   */
  handlers?: {
    onClick?: (event: MouseEvent, view: AnyView | AnyViewInstance) => void;
    onMouseMove?: (event: MouseEvent, view: AnyView | AnyViewInstance) => void;
    onHover?: (event: MouseEvent, view: AnyView | AnyViewInstance) => void;
    onHoverOut?: (event: MouseEvent, view: AnyView | AnyViewInstance) => void;
    onTouchStart?: (event: TouchEvent, view: AnyView | AnyViewInstance) => void;
    onTouchEnd?: (event: TouchEvent, view: AnyView | AnyViewInstance) => void;
    onDrag?: (event: MouseEvent, view: AnyView | AnyViewInstance) => void;
    onKeyDown?: (event: KeyboardEvent, view: AnyView | AnyViewInstance) => void;
    onKeyUp?: (event: KeyboardEvent, view: AnyView | AnyViewInstance) => void;
  };
};

export type AnimatedView = View & {
  addAnimation: (callback: EventListener) => void;
  animate: () => void;
};

export type EntityModel = {
  health: number;
  speed: number;
  collisionDamage: number;
};

export type EntityView = AnimatedView & {
  entity: EntityModel;
};

export type AnyView = View | InteractiveView | AnimatedView | EntityView;

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

export type AnyViewInstance =
  | ViewInstance
  | InteractiveViewInstance
  | AnimatedViewInstance
  | EntityViewInstance;
