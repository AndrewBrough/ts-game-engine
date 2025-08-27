import type { CollisionLayer } from '../gameState/collisionLayers';
import type { Component, createView } from './view';

export type ViewModel = {
  maxHealth: number;
  health: number;
  speed: number;
  collisionDamage: number;
  [key: string]: any;
};

export type View<T extends ViewModel = ViewModel> = {
  id: string;
  model: T;
  layer: CollisionLayer;
  scale: number;
  imageUrl?: string;
  geometry: Geometry;
  text: {
    offset?: Position | 'center';
    height?: number;
    width?: number;
    text: string | number;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    style: StyleProps;
  };
  physics: {
    speed: number;
    currentForce: Position;
    dampening: number;
    bounce: number;
  };
  components: Component[];
};

export type StyleProps = {
  fill: {
    color: string;
    opacity: number;
  };
  stroke: {
    color: string;
    opacity: number;
    width: number;
  };
  radii?: number;
};

export type Geometry = {
  x: number;
  y: number;
  width: number;
  height: number;
  shape?: 'rect' | 'roundRect' | 'image';
  style: StyleProps;
};

export type EntityModel = {
  health: number;
  speed: number;
  collisionDamage: number;
};

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};
