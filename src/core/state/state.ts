import { createModel } from "../model/model";
import type { View } from "../view/types";

export type State = {
  score: number;
  views: View[];
  fps: number;
};

const state = createModel<State>({
  score: 0,
  views: [],
  fps: 0,
});

export const getState = () => state;

export const addView = (view: View) => {
  state.views.push(view);
};

export const removeView = (view: View) => {
  state.views = state.views.filter((v) => v !== view);
};

export const updateFPS = (fps: number) => {
  state.fps = fps;
};