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
  const events = new Map<string, EventListener>(); 
  const eventHandlers = new Map<string, (e: Event) => void>();

  const addEvent = (event: string, callback: EventListener) => {
    events.set(event, callback);
    
    // Create a wrapper function that we can reference for removal
    const handler = (e: Event) => {
      callback(e);
    };
    
    eventHandlers.set(event, handler);
    window.addEventListener(event, handler);
  };

  const removeEvent = (event: string) => {
    const handler = eventHandlers.get(event);
    if (handler) {
      window.removeEventListener(event, handler);
      eventHandlers.delete(event);
    }
    events.delete(event);
  };

  const cleanup = () => {
    // Remove all event listeners
    for (const [event, handler] of eventHandlers) {
      window.removeEventListener(event, handler);
    }
    events.clear();
    eventHandlers.clear();
    // Remove from global registry
    eventInstances.delete(instance);
  };

  const instance = {
    events,
    addEvent,
    removeEvent,
    cleanup
  };

  // Register this instance for potential cleanup
  eventInstances.add(instance);

  return instance;
};