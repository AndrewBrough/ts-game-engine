import { convertPositionToPixels, convertSizeToPixels } from "../conversions";
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
      console.log(view);
    }
  });
};

export const locateView = (inputPosition: Position) => {
  return getState().views.find((v) => {
    const sizeInPixels = convertSizeToPixels(v.shapeProps.width, v.shapeProps.height);
    const viewPosition = convertPositionToPixels(v.position.x, v.position.y);
    // Use the collision system to get proper bounds for the view
    // Since we're now using props directly, we need to get the anchor from the view instance
    // For now, we'll use the view's position and size directly without anchor calculations
    return (
      inputPosition.x >= viewPosition.x &&
      inputPosition.x <= viewPosition.x + sizeInPixels.width &&
      inputPosition.y >= viewPosition.y &&
      inputPosition.y <= viewPosition.y + sizeInPixels.height
    );
  });
};