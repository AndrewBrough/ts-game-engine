import type { EventName } from '../events/events';
import { getAllViews } from '../gameState/gameState';
import type { ViewInstance } from '../view/view';
import { getInteractiveViews, locateView } from './targeting';

let hoveredView: ViewInstance | null = null;

// Helper function to get interactive views with specific handlers
const getViewsWithHandler = (handlerName: EventName) => {
  return getAllViews().filter((view: ViewInstance) => {
    return view.handlers.has(handlerName);
  });
};

// Click handler
const handleClick = (e: MouseEvent) => {
  const viewsWithClick = getViewsWithHandler('click');
  const view = locateView({ x: e.clientX, y: e.clientY }, viewsWithClick);

  if (view) {
    view.handlers.get('click')?.(e as unknown as CustomEvent);
  }
};

// Mouse move handler
const handleMouseMove = (e: MouseEvent) => {
  const view = locateView(
    { x: e.clientX, y: e.clientY },
    getInteractiveViews()
  );

  // Handle hover out for previous hovered view
  if (hoveredView && (!view || view.id !== hoveredView.id)) {
    hoveredView.handlers.get('mouseout')?.(e as unknown as CustomEvent);
    hoveredView = null;
  }

  // Handle hover for new view
  if (view && view.id !== hoveredView?.id) {
    hoveredView = view;
    view.handlers.get('mouseover')?.(e as unknown as CustomEvent);
  }

  // Handle mousemove for current view
  if (view) {
    view.handlers.get('mousemove')?.(e as unknown as CustomEvent);
  }
};

// Touch start handler
const handleTouchStart = (e: TouchEvent) => {
  const viewsWithTouchStart = getViewsWithHandler('touchstart');
  const touch = e.touches[0];
  const view = locateView(
    { x: touch.clientX, y: touch.clientY },
    viewsWithTouchStart
  );

  if (view) {
    view.handlers.get('touchstart')?.(e as unknown as CustomEvent);
  }
};

// Touch end handler
const handleTouchEnd = (e: TouchEvent) => {
  const viewsWithTouchEnd = getViewsWithHandler('touchend');
  const touch = e.changedTouches[0];
  const view = locateView(
    { x: touch.clientX, y: touch.clientY },
    viewsWithTouchEnd
  );

  if (view) {
    view.handlers.get('touchend')?.(e as unknown as CustomEvent);
  }
};

export const bindMouse = () => {
  window.addEventListener('click', handleClick);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);
};

export const unbindMouse = () => {
  window.removeEventListener('click', handleClick);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchend', handleTouchEnd);
};
