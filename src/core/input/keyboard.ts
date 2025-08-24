import { getAllViews } from '../gameState/gameState';
import type { AnyView, InteractiveView } from '../view/types';

const heldKeys = new Set<string>();

// Helper function to get interactive views with specific handlers
const getViewsWithHandler = (
  handlerName: keyof NonNullable<InteractiveView['handlers']>
) => {
  return getAllViews().filter((view: AnyView) => {
    if ('handlers' in view) {
      const handlers = view.handlers as Record<string, (e: Event) => void>;
      if (handlerName in handlers) return false;
      return handlers[handlerName] !== undefined;
    }
    return false;
  });
};

// Key down handler
const handleKeyDown = (e: KeyboardEvent) => {
  heldKeys.add(e.key);

  // Also check for views with keyDown handlers that might want to handle this key
  const viewsWithKeyDown = getViewsWithHandler('onKeyDown');
  for (const view of viewsWithKeyDown) {
    if ('handlers' in view) {
      const handlers = view.handlers as Record<string, (e: Event) => void>;
      if (handlers.onKeyDown) {
        handlers.onKeyDown(e);
      }
    }
  }
};

// Key up handler
const handleKeyUp = (e: KeyboardEvent) => {
  heldKeys.delete(e.key);

  // Also check for views with keyUp handlers that might want to handle this key
  const viewsWithKeyUp = getViewsWithHandler('onKeyUp');
  for (const view of viewsWithKeyUp) {
    if ('handlers' in view) {
      const handlers = view.handlers as Record<string, (e: Event) => void>;
      if (handlers.onKeyUp) {
        handlers.onKeyUp(e);
      }
    }
  }
};

// Helper function to check if a key is currently held
export const isKeyHeld = (key: string): boolean => {
  return heldKeys.has(key);
};

// Helper function to get all currently held keys
export const getHeldKeys = (): Set<string> => {
  return new Set(heldKeys);
};

export const bindKeyboard = () => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
};
