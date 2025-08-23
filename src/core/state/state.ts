import { createModel } from "../model/model";
import type { View, InteractiveView } from "../view/types";

export type State = {
  score: number;
  views: (View | InteractiveView)[];
  fps: number;
  isLogicPaused: boolean;
  timeScale: number;
};

const state = createModel<State>({
  score: 0,
  views: [],
  fps: 0,
  isLogicPaused: false,
  timeScale: 1,
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

export const setLogicPaused = (paused: boolean) => {
  state.isLogicPaused = paused;
};

export const toggleLogicPaused = () => {
  setLogicPaused(!state.isLogicPaused);
};

export const setTimeScale = (timeScale: number) => {
  state.timeScale = timeScale;
};

export const toggleTimeScale = () => {
  setTimeScale(state.timeScale === 1 ? 0 : 1);
};