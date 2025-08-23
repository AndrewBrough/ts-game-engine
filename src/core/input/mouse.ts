import { convertPositionToPixels } from "../conversions";
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
    const { left, right, top, bottom } = v.bounds;
    
    return (
      inputPosition.x >= left &&
      inputPosition.x <= right &&
      inputPosition.y >= top &&
      inputPosition.y <= bottom
    );
  });
};