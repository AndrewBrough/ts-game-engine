import { createModel } from "../model/model";
import type { Position, View } from "../view/types";

export type State = {
  score: number;
  views: View[];
};

const state = createModel<State>({
  score: 100,
  views: [],
});

export const getState = () => state;

export const addView = (view: View) => {
  state.views.push(view);
};

export const removeView = (view: View) => {
  state.views = state.views.filter((v) => v !== view);
};

export const locateView = (position: Position) => {
  return getState().views.find((v) => position.x >= v.position.x && position.x <= v.position.x + v.size.width && position.y >= v.position.y && position.y <= v.position.y + v.size.height);
};