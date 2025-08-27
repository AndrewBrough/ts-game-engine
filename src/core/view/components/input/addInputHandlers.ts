import type { EventName } from '../../../events/events';

export const addInputHandlers = () => {
  const inputEvents = {
    click: 'click',
    mouseover: 'mouseover',
    mouseout: 'mouseout',
    keydown: 'keydown',
    keyup: 'keyup',
  };

  const handlers: Record<EventName, Map<string, (e: CustomEvent) => void>> = {
    click: new Map(),
    mouseover: new Map(),
    mouseout: new Map(),
    keydown: new Map(),
    keyup: new Map(),
  };

  const addHandler = (
    event: EventName,
    key: string,
    callback: (e: CustomEvent) => void
  ) => {
    handlers[event].set(key, callback);
  };

  const removeHandler = (event: EventName, key: string) => {
    handlers[event].delete(key);
  };

  return {
    handlers,
    inputEvents,
    addHandler,
    removeHandler,
  };
};
