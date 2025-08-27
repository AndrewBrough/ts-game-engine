export type EventInstance = ReturnType<typeof createEvents>;

// Global registry to track event instances for cleanup
const eventInstances = new Set<{ cleanup: () => void }>();

// Cleanup function that can be called periodically or when needed
export const cleanupEventListeners = () => {
  for (const instance of eventInstances) {
    instance.cleanup();
  }
  eventInstances.clear();
};

export const InputEvents = {
  click: 'click',
  mouseover: 'mouseover',
  mouseout: 'mouseout',
  keydown: 'keydown',
  keyup: 'keyup',
  touchstart: 'touchstart',
  touchend: 'touchend',
};
export type InputEventName = keyof typeof InputEvents;

export const GameEvents = {
  update: 'update',
  render: 'render',
};
export type GameEventName = keyof typeof GameEvents;

export const Events = {
  ...GameEvents,
  ...InputEvents,
};
export type EventName = keyof typeof Events | string;

export const createEvents = () => {
  const events = new Map<EventName, ((e: any) => void)[]>();
  const eventHandlers = new Map<EventName, ((e: any) => void)[]>();

  const addEvent = (event: EventName, callback: (e: any) => void) => {
    events.set(event, [...(events.get(event) ?? []), callback]);

    // Create a wrapper function that we can reference for removal
    const handler = (e: any) => {
      callback(e);
    };

    eventHandlers.set(event, [...(eventHandlers.get(event) ?? []), handler]);
    window.addEventListener(event, handler as EventListener);
  };

  const removeEvent = (event: EventName) => {
    const handlers = eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        window.removeEventListener(event, handler as EventListener);
      });
      eventHandlers.delete(event);
    }
  };

  const cleanup = () => {
    // Remove all event listeners
    for (const [event, handler] of eventHandlers) {
      handler.forEach(handler => {
        window.removeEventListener(event, handler as EventListener);
      });
    }
    events.clear();
    eventHandlers.clear();
    eventInstances.delete(instance);
  };

  const instance = {
    events,
    addEvent,
    removeEvent,
    cleanup,
  };

  // Register this instance for potential cleanup
  eventInstances.add(instance);

  return instance;
};
