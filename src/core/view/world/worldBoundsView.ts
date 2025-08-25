import type { DeepPartial } from '../../types';
import { createEntityView } from '../player/entityView';
import type { EntityView } from '../types';

const WALL_THICKNESS = 5;
const baseProps = {
  layer: 'WALLS',
  shape: 'rect',
  relativeTo: 'center',
  anchor: 'center',
  geometry: {
    width: 100,
    height: WALL_THICKNESS,
    units: ['vw', 'vh'],
  },
  fill: {
    color: 'black',
    opacity: 0.7,
  },
  stroke: {
    color: 'black',
    opacity: 1,
  },
  textProps: {
    text: '',
  },
} as DeepPartial<EntityView>;

export const createWorldBoundsView = () => {
  createEntityView({
    ...baseProps,
    id: 'top-wall',
    geometry: {
      ...baseProps.geometry,
      x: 0,
      y: 0,
      width: 100,
      height: WALL_THICKNESS,
    },
    physics: {
      dampening: 0.9,
      bounce: 200,
    },
    fill: {
      color: 'blue',
    },
  });

  createEntityView({
    ...baseProps,
    id: 'bottom-wall',
    geometry: {
      ...baseProps.geometry,
      x: 0,
      y: 85,
      width: 100,
      height: WALL_THICKNESS,
    },
    physics: {
      dampening: 0.9,
      bounce: 200,
    },
    fill: {
      color: 'blue',
    },
  });

  createEntityView({
    ...baseProps,
    id: 'left-wall',
    physics: {
      dampening: 0.9,
      bounce: 200,
    },
    geometry: {
      ...baseProps.geometry,
      x: 0,
      y: 0,
      width: WALL_THICKNESS,
      height: 100,
    },
    fill: {
      color: 'orange',
    },
  });

  createEntityView({
    ...baseProps,
    id: 'right-wall',
    geometry: {
      ...baseProps.geometry,
      x: 90,
      y: 0,
      width: WALL_THICKNESS,
      height: 100,
    },
    physics: {
      dampening: 0.9,
      bounce: 200,
    },
    fill: {
      color: 'green',
    },
  });
};
