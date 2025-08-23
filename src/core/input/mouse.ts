import { getState } from "../state/state";
import type { Position } from "../view/types";
import { isPointInBounds, getViewBounds } from "../view/collision";

export const bindMouse = () => {
  window.addEventListener('click', (e) => {
    const view = locateView({ x: e.clientX, y: e.clientY });
    if (view) {
      console.log("Clicked on view ", view);
    }
  });
  window.addEventListener('mousemove', (e) => {
    const view = locateView({ x: e.clientX, y: e.clientY });
    if (view) {
      console.log(view);
    }
  });
};

export const locateView = (position: Position) => {
  return getState().views.find((v) => {
    // Use the collision system to get proper bounds for the view
    // Note: We need to get the anchor from the view instance, but for now we'll use center as default
    // TODO: Store anchor information in the view state
    const bounds = getViewBounds(v.position, v.size, 'center');
    return isPointInBounds(position, bounds);
  });
};