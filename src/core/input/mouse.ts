import { getState } from "../state/state";
import type { Position } from "../view/types";

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
      // console.log(view);
    }
  });
};

export const locateView = (position: Position) => {
  return getState().views.find((v) => {
    // Use the collision system to get proper bounds for the view
    // Since we're now using props directly, we need to get the anchor from the view instance
    // For now, we'll use the view's position and size directly without anchor calculations
    return (
      position.x >= v.position.x &&
      position.x <= v.position.x + v.size.width &&
      position.y >= v.position.y &&
      position.y <= v.position.y + v.size.height
    );
  });
};