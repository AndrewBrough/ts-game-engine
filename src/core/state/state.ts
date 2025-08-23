import { createModel } from "../model/model";
import type { View, InteractiveView } from "../view/types";

export type GameState = {
  score: number;
  views: (View | InteractiveView)[];
  fps: number;
  isLogicPaused: boolean;
  timeScale: number;
  focusedView: InteractiveView | null;
};

const gameState = createModel<GameState>({
  score: 0,
  views: [],
  fps: 0,
  isLogicPaused: false,
  timeScale: 1,
  focusedView: null,
});

export const getState = () => gameState;

export const addView = (view: View | InteractiveView) => {
  gameState.views.push(view);
};

export const removeView = (view: View | InteractiveView) => {
  gameState.views = gameState.views.filter((v) => v !== view);
};

export const updateFPS = (fps: number) => {
  gameState.fps = fps;
};

export const setLogicPaused = (paused: boolean) => {
  gameState.isLogicPaused = paused;
};

export const toggleLogicPaused = () => {
  setLogicPaused(!gameState.isLogicPaused);
};

export const setTimeScale = (timeScale: number) => {
  gameState.timeScale = timeScale;
};

export const toggleTimeScale = () => {
  setTimeScale(gameState.timeScale === 1 ? 0 : 1);
};

export const setFocusedView = (view: InteractiveView | null) => {
  gameState.focusedView = view;
};

export const getFocusedView = () => {
  return gameState.focusedView;
};