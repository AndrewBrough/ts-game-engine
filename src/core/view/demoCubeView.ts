import { alwaysMoveForward } from './animations/alwaysMoveForward';
import { bounceOffWalls } from './animations/bounceOffWalls';
import { screenSaver } from './animations/screenSaver';
import { createEntityView } from './player/entityView';

export const createDemoCubeView = (id?: string) => {
  // Generate random positions between 0-100
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;

  // Use provided id or generate a unique one
  const cubeId = id || `demoCube-${crypto.randomUUID()}`;

  const entityView = createEntityView({
    id: cubeId,
    model: { health: 10, speed: 1 },
    physics: {
      dampening: 0.9,
      bounce: 2,
    },
    layer: 'DEFAULT',
    geometry: {
      x: randomX,
      y: randomY,
      width: 10,
      height: 10,
    },
    fill: {
      color: 'red',
    },
    stroke: {
      color: 'red',
      opacity: 1,
      width: 2,
    },
  });

  // screenSaver(entityView);
  // alwaysMoveForward(entityView);
  // bounceOffWalls(entityView);

  return entityView;
};
