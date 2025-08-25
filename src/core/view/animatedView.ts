import type { DeepPartial } from '../types';
import type { InteractiveView } from './types';
import { createView } from './view';

export type AnimatedViewInstance = ReturnType<typeof createAnimatedView>;

export const createAnimatedView = (props: DeepPartial<InteractiveView>) => {
  const viewInstance = createView({ ...props });

  const animate = () => {
    viewInstance.update();
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

  return {
    ...viewInstance,
    addAnimation,
    animate,
  };
};
