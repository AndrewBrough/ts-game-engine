import { getState } from '../gameState/gameState';
import type { Position } from '../view/types';
import type { ViewInstance } from '../view/view';

// Helper function to get interactive views
export const getInteractiveViews = () => {
  return Object.values(getState().views)
    .flat()
    .filter((view: ViewInstance) => {
      if ('interactive' in view) {
        return view.interactive === true;
      }
      return false;
    });
};

export const locateView = (
  inputPosition: Position,
  viewsToCheck: ViewInstance[] = getInteractiveViews()
) => {
  return viewsToCheck.find(v => {
    const { x, y, width, height } = v.geometry;
    return (
      inputPosition.x >= x &&
      inputPosition.x <= x + width &&
      inputPosition.y >= y &&
      inputPosition.y <= y + height
    );
  });
};
