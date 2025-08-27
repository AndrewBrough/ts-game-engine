import type { EventName } from '../events/events';
import { getAllViews } from '../gameState/gameState';
import type { ViewInstance } from '../view/view';

const heldKeys = new Set<string>();
let currentDeltaTime = 16; // Default to 16ms (60fps)

// Function to update deltaTime from the game loop
export const updateDeltaTime = (deltaTime: number) => {
  currentDeltaTime = deltaTime;
};

// Helper function to get interactive views with specific handlers
const getViewsWithHandler = (handlerName: EventName) => {
  return getAllViews().filter((view: ViewInstance) => {
    if ('handlers' in view) {
      return view.handlers.has(handlerName);
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
      if (view.handlers.has('keydown')) {
        // Create a CustomEvent with deltaTime from the game loop
        const customEvent = new CustomEvent('keydown', {
          detail: {
            deltaTime: currentDeltaTime, // Use the current deltaTime from the game loop
            key: e.key,
            code: e.code,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            metaKey: e.metaKey,
            repeat: e.repeat,
          },
        });
        view.handlers.get('keydown')?.(customEvent);
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
      if (view.handlers.has('keyup')) {
        // Create a CustomEvent with deltaTime from the game loop
        const customEvent = new CustomEvent('keyup', {
          detail: {
            deltaTime: currentDeltaTime, // Use the current deltaTime from the game loop
            key: e.key,
            code: e.code,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            metaKey: e.metaKey,
            repeat: e.repeat,
          },
        });
        view.handlers.get('keyup')?.(customEvent);
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

export const unbindKeyboard = () => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
};
