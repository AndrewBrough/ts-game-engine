import { getState } from "../state/state";
import type { InteractiveView, Position } from "../view/types";

// Helper function to get interactive views
export const getInteractiveViews = () => {
    return getState().views.filter((view): view is InteractiveView => 
      'interactive' in view && view.interactive === true
    );
  };

export const locateView = (inputPosition: Position, viewsToCheck: InteractiveView[] = getInteractiveViews()) => {
    return viewsToCheck.find((v) => {
      const { left, right, top, bottom } = v.bounds || { left: 0, right: 0, top: 0, bottom: 0 };
      
      return (
        inputPosition.x >= left &&
        inputPosition.x <= right &&
        inputPosition.y >= top &&
        inputPosition.y <= bottom
      );
    });
  };