import type { ViewInstance } from '../view';

export type AnimationComponent = ReturnType<typeof addAnimations>;

export const addAnimations = (view: ViewInstance) => {
  const animate = () => {
    view.update();
  };

  const addAnimationEvent = (callback: (e: CustomEvent) => void) => {
    view.events.addEvent('animate', callback);
  };

  view.events.addEvent('animate', e => animate());

  return {
    addAnimationEvent,
  };
};
