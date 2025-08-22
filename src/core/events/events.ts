export const createEvents = () => {
  const events = new Map<string, EventListener>();

  const addEvent = (event: string, callback: (event: Event) => void) => {
    events.set(event, callback);
    window.addEventListener(event, callback);
    return () => {
      events.delete(event);
    }
  };

  const removeEvent = (event: string) => {
    const callback = events.get(event);
    if (callback) { 
      window.removeEventListener(event, callback);
      events.delete(event);
    } else {
      console.warn(`Event ${event} not found`);
    }
  };

  return {
    addEvent,
    removeEvent
  };
};