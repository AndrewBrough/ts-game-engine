import { screenSaver } from './animations/screenSaver';
import { createEntityView } from './player/entityView';

export const createDemoCubeView = (id?: string) => {
  // Generate random positions between 0-100
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;

  // Use provided id or generate a unique one
  const cubeId = id || `demoCube-${Math.random().toString(36).substr(2, 9)}`;

  const entityView = createEntityView({
    id: cubeId,
    model: { health: 10, speed: 0.1 },
    layer: 'DEFAULT',
    position: {
      x: randomX,
      y: randomY,
    },
    shapeProps: {
      width: 10,
      height: 10,
    },
    shape: 'rect',
    fill: {
      color: 'red',
    },
    stroke: {
      color: 'red',
      opacity: 1,
      width: 2,
    },
  });

  entityView.events.addEvent('update', (e: CustomEvent) => {
    screenSaver(entityView, e.detail.deltaTime ?? 16);
  });

  entityView.addAnimation(() => {}, 'update');

  return entityView;
};
