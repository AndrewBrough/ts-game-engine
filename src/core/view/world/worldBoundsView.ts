import { getState } from '../../gameState/gameState';
import type { DeepPartial } from '../../types';
import { createEntityView } from '../player/entityView';
import type { InteractiveView } from '../types';
import { createPauseButton } from '../pauseButton';

const WALL_THICKNESS = 5;

const createWall = (props: DeepPartial<InteractiveView>) => {
  createEntityView({
    ...props,
  });
};

export const createWorldBoundsView = () => {
  //   createWall({
  //     id: 'top-wall',
  //     model: {
  //       health: 'top',
  //       speed: 0,
  //       collisionDamage: 0,
  //     },
  //     layer: 'WALLS',
  //     shape: 'rect',
  //     position: {
  //       x: 0,
  //       y: 0,
  //     },
  //     shapeProps: {
  //       width: 100,
  //       height: WALL_THICKNESS,
  //     },
  //     fill: {
  //       color: 'blue',
  //       opacity: 0.7,
  //     },
  //     stroke: {
  //       color: 'black',
  //       opacity: 1,
  //     },
  //   });

  createPauseButton({
    relativeTo: 'bottom-right',
    position: {
      x: -5,
      y: -5,
    },
    shapeProps: {
      width: 5,
      height: 5,
    },
  });

  // Bottom wall
  //   createWall({
  //     id: 'bottom-wall',
  //     model: {
  //       health: 'bottom',
  //       speed: 0,
  //       collisionDamage: 0,
  //     },
  //     relativeTo: 'bottom-left',
  //     position: {
  //       x: 0,
  //       y: 80,
  //     },
  //     shapeProps: {
  //       width: 100,
  //       height: WALL_THICKNESS,
  //     },
  //     fill: {
  //       color: 'red',
  //       opacity: 0.7,
  //     },
  //     stroke: {
  //       color: 'black',
  //       opacity: 1,
  //     },
  //   });
  //   console.log(getState().views);

  //   // Left wall
  //   createWall({
  //     model: {
  //       health: 'left',
  //     },
  //     position: {
  //       x: WALL_THICKNESS / 2,
  //       y: 0,
  //     },
  //   });

  //   // Right wall
  //   createWall({
  //     model: {
  //       health: 'right',
  //     },
  //     position: {
  //       x: window.innerWidth - WALL_THICKNESS / 2,
  //       y: 0,
  //     },
  //   });
};
