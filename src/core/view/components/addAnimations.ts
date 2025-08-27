import type { ViewInstance } from '../view';

export const addAnimations = (view: ViewInstance) => {
  const animations = {
    id: crypto.randomUUID(),
  };

  const animate = () => {
    view.update();
  };

  view.events.addEvent('animate', e => animate());

  return {
    ...animations,
  };
};
