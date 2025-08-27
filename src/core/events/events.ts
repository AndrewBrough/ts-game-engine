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

export const createEvents = () => {
  const events = new Map<string, ((e: CustomEvent) => void)[]>();
  const eventHandlers = new Map<string, ((e: CustomEvent) => void)[]>();

  const addEvent = (
    event: string,
    callback: (e: CustomEvent | KeyboardEvent | MouseEvent) => void
  ) => {
    events.set(event, [...(events.get(event) ?? []), callback]);

    // Create a wrapper function that we can reference for removal
    const handler = (e: CustomEvent) => {
      callback(e);
    };

    eventHandlers.set(event, [...(eventHandlers.get(event) ?? []), handler]);
    window.addEventListener(event, handler as EventListener);
  };

  const removeEvent = (event: string) => {
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
