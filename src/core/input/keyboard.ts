import { setFocusedView, getFocusedView, getAllViews } from "../gameState/gameState";
import type { InteractiveView } from "../view/types";

const heldKeys = new Set<string>();

// Helper function to get interactive views with specific handlers
const getViewsWithHandler = (handlerName: keyof NonNullable<InteractiveView['handlers']>) => {
  return getAllViews().filter((view): view is InteractiveView => {
    if (!('handlers' in view)) return false;
    if (!view.handlers) return false;
    if (!(handlerName in view.handlers)) return false;
    return view.handlers[handlerName] !== undefined;
  });
};

// Key down handler
const handleKeyDown = (e: KeyboardEvent) => {
  heldKeys.add(e.key);
  
  // Get the currently focused view
  const focusedView = getFocusedView();
  
  // If there's a focused view with a keyDown handler, call it
  if (focusedView && focusedView.handlers?.onKeyDown) {
    focusedView.handlers.onKeyDown(e, focusedView);
  }
  
  // Also check for views with keyDown handlers that might want to handle this key
  const viewsWithKeyDown = getViewsWithHandler('onKeyDown');
  for (const view of viewsWithKeyDown) {
    if (view !== focusedView && view.handlers?.onKeyDown) {
      view.handlers.onKeyDown(e, view);
    }
  }
};

// Key up handler
const handleKeyUp = (e: KeyboardEvent) => {
  heldKeys.delete(e.key);
  
  // Get the currently focused view
  const focusedView = getFocusedView();
  
  // If there's a focused view with a keyUp handler, call it
  if (focusedView && focusedView.handlers?.onKeyUp) {
    focusedView.handlers.onKeyUp(e, focusedView);
  }
  
  // Also check for views with keyUp handlers that might want to handle this key
  const viewsWithKeyUp = getViewsWithHandler('onKeyUp');
  for (const view of viewsWithKeyUp) {
    if (view !== focusedView && view.handlers?.onKeyUp) {
      view.handlers.onKeyUp(e, view);
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

// Helper function to focus a view (for keyboard events)
export const focusView = (view: InteractiveView | null) => {
  setFocusedView(view);
};

// Helper function to get the currently focused view
export const getCurrentFocusedView = (): InteractiveView | null => {
  return getFocusedView();
};

export const bindKeyboard = () => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
};  