import type { DeepPartial } from '../types';
import { createAnimatedView } from './animatedView';
import type { InteractiveView } from './types';

export type InteractiveViewInstance = ReturnType<typeof createInteractiveView>;

export const createInteractiveView = (props: DeepPartial<InteractiveView>) => {
  const view = createAnimatedView({ ...props, interactive: true });

  // Store handler references for proper cleanup
  const handlers = {
    click: (event: Event) =>
      view.events.events
        ?.get('onClick')
        ?.forEach(cb => cb?.(event as CustomEvent)),
    mouseover: (event: Event) =>
      view.events.events
        ?.get('onHover')
        ?.forEach(cb => cb?.(event as CustomEvent)),
    mouseout: (event: Event) =>
      view.events.events
        ?.get('onHoverOut')
        ?.forEach(cb => cb?.(event as CustomEvent)),
    keydown: (event: Event) =>
      view.events.events
        ?.get('onKeyDown')
        ?.forEach(cb => cb?.(event as CustomEvent)),
    keyup: (event: Event) =>
      view.events.events
        ?.get('onKeyUp')
        ?.forEach(cb => cb?.(event as CustomEvent)),
  };

  const addHandlers = () => {
    window.addEventListener('click', handlers.click);
    window.addEventListener('mouseover', handlers.mouseover);
    window.addEventListener('mouseout', handlers.mouseout);
    window.addEventListener('keydown', handlers.keydown);
    window.addEventListener('keyup', handlers.keyup);
  };

  const clearHandlers = () => {
    window.removeEventListener('click', handlers.click);
    window.removeEventListener('mouseover', handlers.mouseover);
    window.removeEventListener('mouseout', handlers.mouseout);
    window.removeEventListener('keydown', handlers.keydown);
    window.removeEventListener('keyup', handlers.keyup);
  };

  addHandlers();

  return {
    ...view,
    addHandlers,
    clearHandlers,
  };
};
