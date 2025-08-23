import { createModel } from "../model/model";
import type { View, InteractiveView } from "../view/types";

export type State = {
  score: number;
  views: (View | InteractiveView)[];
  fps: number;
  isPaused: boolean;
};

const state = createModel<State>({
  score: 0,
  views: [],
  fps: 0,
  isPaused: false,
});

export const getState = () => state;

export const addView = (view: View | InteractiveView) => {
  state.views.push(view);
};

export const removeView = (view: View | InteractiveView) => {
  state.views = state.views.filter((v) => v !== view);
};

export const updateFPS = (fps: number) => {
  state.fps = fps;
};

export const setPaused = (paused: boolean) => {
  state.isPaused = paused;
};

export const togglePaused = () => {
  state.isPaused = !state.isPaused;
};