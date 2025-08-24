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
    model: { health: 10, speed: 0.5 },
    layer: 'DEFAULT',
    position: {
      x: randomX,
      y: randomY,
    },
    geometry: {
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

  entityView.events.addEvent('update', (e: CustomEvent) => {
    screenSaver(entityView, e.detail.deltaTime ?? 16);
  });

  entityView.addAnimation(() => {}, 'update');

  return entityView;
};
