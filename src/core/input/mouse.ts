import { getAllViews } from '../gameState/gameState';
import type { AnyView, InteractiveView } from '../view/types';
import { getInteractiveViews, locateView } from './targeting';

let hoveredView: AnyView | null = null;

// Helper function to get interactive views with specific handlers
const getViewsWithHandler = (
  handlerName: keyof NonNullable<InteractiveView['handlers']>
) => {
  return getAllViews().filter((view: AnyView) => {
    if ('handlers' in view) {
      console.log({ view, handlerName });
      const handlers = view.handlers as Record<string, (e: Event) => void>;
      if (handlerName in handlers) {
        return true;
      }
    }
    return false;
  });
};

// Click handler
const handleClick = (e: MouseEvent) => {
  const viewsWithClick = getViewsWithHandler('onClick');
  const view = locateView({ x: e.clientX, y: e.clientY }, viewsWithClick);

  console.log({ view, viewsWithClick });

  if (view && 'handlers' in view) {
    const handlers = view.handlers as Record<string, (e: Event) => void>;
    if (handlers.onClick) {
      handlers.onClick(e);
    }
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
    if ('handlers' in hoveredView) {
      const handlers = hoveredView.handlers as Record<
        string,
        (e: Event) => void
      >;
      if (handlers.onHoverOut) {
        handlers.onHoverOut(e);
      }
    }
    hoveredView = null;
  }

  // Handle hover for new view
  if (view && view.id !== hoveredView?.id) {
    hoveredView = view;
    if ('handlers' in view) {
      const handlers = view.handlers as Record<string, (e: Event) => void>;
      if (handlers.onHover) {
        handlers.onHover(e);
      }
    }
  }

  // Handle mousemove for current view
  if (view && 'handlers' in view) {
    const handlers = view.handlers as Record<string, (e: Event) => void>;
    if (handlers.onMouseMove) {
      handlers.onMouseMove(e);
    }
  }
};

// Touch start handler
const handleTouchStart = (e: TouchEvent) => {
  const viewsWithTouchStart = getViewsWithHandler('onTouchStart');
  const touch = e.touches[0];
  const view = locateView(
    { x: touch.clientX, y: touch.clientY },
    viewsWithTouchStart
  );

  if (view && 'handlers' in view) {
    const handlers = view.handlers as Record<string, (e: Event) => void>;
    if (handlers.onTouchStart) {
      handlers.onTouchStart(e);
    }
  }
};

// Touch end handler
const handleTouchEnd = (e: TouchEvent) => {
  const viewsWithTouchEnd = getViewsWithHandler('onTouchEnd');
  const touch = e.changedTouches[0];
  const view = locateView(
    { x: touch.clientX, y: touch.clientY },
    viewsWithTouchEnd
  );

  if (view && 'handlers' in view) {
    const handlers = view.handlers as Record<string, (e: Event) => void>;
    if (handlers.onTouchEnd) {
      handlers.onTouchEnd(e);
    }
  }
};

export const bindMouse = () => {
  window.addEventListener('click', handleClick);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);
};
