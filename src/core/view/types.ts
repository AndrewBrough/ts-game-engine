import type { CollisionLayer } from '../gameState/collisionLayers';
import type { AnimatedViewInstance } from './animatedView';
import type { InteractiveViewInstance } from './interactiveView';
import type { EntityViewInstance } from './player/entityView';
import type { ViewInstance } from './view';

export type ViewModel = {
  maxHealth: number;
  health: number;
  speed: number;
  collisionDamage: number;
};

export type View<T extends ViewModel = ViewModel> = {
  id: string;
  model: T;
  layer: CollisionLayer;
  scale: number;
  fill: {
    color: string;
    opacity: number;
  };
  stroke: {
    color: string;
    opacity: number;
    width: number;
  };
  geometry: Geometry;
  textProps: {
    text: string | number;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
  };
  physics: {
    speed: number;
    force: Position;
    dampening: number;
    bounce: number;
  };
};

export type Geometry = {
  x: number;
  y: number;
  width: number;
  height: number;
  shape?: 'rect' | 'circle' | 'text';
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
