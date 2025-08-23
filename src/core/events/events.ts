export const createEvents = () => {
  const events = new Map<string, EventListener>();

  const addEvent = (event: string, callback: EventListener) => {
    events.set(event, callback);
    window.addEventListener(event, (e) => {
      callback(e);
      events.get(event)?.(e);
    });
  };

  const removeEvent = (event: string) => {
    events.delete(event);
    window.removeEventListener(event, (e) => {
      events.get(event)?.(e);
    });
  };

  return {
    events,
    addEvent,
    removeEvent
  };
};