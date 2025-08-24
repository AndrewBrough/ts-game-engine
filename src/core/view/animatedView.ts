import type { DeepPartial } from '../types';
import type { InteractiveView, Position } from './types';
import { createView } from './view';

export type AnimatedViewInstance = ReturnType<typeof createAnimatedView>;

export const createAnimatedView = (
  props: DeepPartial<InteractiveView> = {}
) => {
  const viewInstance = createView(props);

  const animate = () => {
    viewInstance.update();
  };

  const move = (position: Position, deltaTime: number) => {
    viewInstance.updatePosition({
      x: viewInstance.props.position.x + (position.x * deltaTime) / 10,
      y: viewInstance.props.position.y + (position.y * deltaTime) / 10,
    });
  };

  const addAnimation = (
    callback: (e: CustomEvent) => void,
    event: 'animate' | 'update' | 'render' = 'animate'
  ) => {
    viewInstance.events.addEvent(event, callback);
  };

  addAnimation((e: CustomEvent) => {
    animate();
  });

  viewInstance.events.addEvent('collide', (e: CustomEvent) => {
    const collision = e.detail?.collision;
    if (collision) {
      console.log('Animated view collided with', collision);
    }
  });

  return {
    ...viewInstance,
    addAnimation,
    animate,
    move,
  };
};
