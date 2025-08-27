import type { ViewInstance } from '../view';

export const addAnimations = (view: ViewInstance) => {
  const animate = () => {
    view.update();
  };

  const addAnimation = (
    callback: (e: CustomEvent) => void,
    event: 'animate' | 'update' | 'render' = 'animate'
  ) => {
    view.events.addEvent(event, e => callback(e as CustomEvent));
  };

  addAnimation((e: CustomEvent) => {
    animate();
  });

  return {
    addAnimation,
  };
};
