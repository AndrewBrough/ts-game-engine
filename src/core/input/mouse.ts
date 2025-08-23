import { getState } from "../state/state";
import type { Position, InteractiveView } from "../view/types";

let hoveredView: InteractiveView | null = null;

// Helper function to get interactive views with specific handlers
const getViewsWithHandler = (handlerName: keyof NonNullable<InteractiveView['handlers']>) => {
  return getState().views.filter((view): view is InteractiveView => {
    if (!('handlers' in view)) return false;
    if (!view.handlers) return false;
    if (!(handlerName in view.handlers)) return false;
    return view.handlers[handlerName] !== undefined;
  });
};

// Helper function to get interactive views
const getInteractiveViews = () => {
  return getState().views.filter((view): view is InteractiveView => 
    'interactive' in view && view.interactive === true
  );
};

export const locateView = (inputPosition: Position, viewsToCheck: InteractiveView[] = getInteractiveViews()) => {
  return viewsToCheck.find((v) => {
    const { left, right, top, bottom } = v.bounds;
    
    return (
      inputPosition.x >= left &&
      inputPosition.x <= right &&
      inputPosition.y >= top &&
      inputPosition.y <= bottom
    );
  });
};

// Click handler
const handleClick = (e: MouseEvent) => {
  const viewsWithClick = getViewsWithHandler('onClick');
  const view = locateView({ x: e.clientX, y: e.clientY }, viewsWithClick);
  
  if (view && view.handlers?.onClick) {
    console.log("Clicked");
    view.handlers.onClick(e, view);
  }
};

// Mouse move handler
const handleMouseMove = (e: MouseEvent) => {
  const view = locateView({ x: e.clientX, y: e.clientY }, getInteractiveViews());
  
  // Handle hover out for previous hovered view
  if (hoveredView && (!view || view.id !== hoveredView.id)) {
    if (hoveredView.handlers?.onHoverOut) {
      hoveredView.handlers.onHoverOut(e, hoveredView);
    }
    hoveredView = null;
  }
  
  // Handle hover for new view
  if (view && view.id !== hoveredView?.id) {
    hoveredView = view;
    if (view.handlers?.onHover) {
      view.handlers.onHover(e, view);
    }
  }
  
  // Handle mousemove for current view
  if (view && view.handlers?.onMouseMove) {
    view.handlers.onMouseMove(e, view);
  }
};

// Touch start handler
const handleTouchStart = (e: TouchEvent) => {
  const viewsWithTouchStart = getViewsWithHandler('onTouchStart');
  const touch = e.touches[0];
  const view = locateView({ x: touch.clientX, y: touch.clientY }, viewsWithTouchStart);
  
  if (view && view.handlers?.onTouchStart) {
    view.handlers.onTouchStart(e, view);
  }
};

// Touch end handler
const handleTouchEnd = (e: TouchEvent) => {
  const viewsWithTouchEnd = getViewsWithHandler('onTouchEnd');
  const touch = e.changedTouches[0];
  const view = locateView({ x: touch.clientX, y: touch.clientY }, viewsWithTouchEnd);
  
  if (view && view.handlers?.onTouchEnd) {
    view.handlers.onTouchEnd(e, view);
  }
};

export const bindMouse = () => {
  window.addEventListener('click', handleClick);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);
};