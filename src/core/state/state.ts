import { createModel } from "../model/model";
import type { View } from "../view/types";

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