import { createModel } from '../model/model';
import type { AnyView } from '../view/types';
import { COLLISION_MATRIX, type CollisionLayer } from './collisionLayers';

export type GameState = {
  score: number;
  views: Record<CollisionLayer, AnyView[]>;
  fps: number;
  isLogicPaused: boolean;
  timeScale: number;
};

const gameState = createModel<GameState>({
  score: 0,
  views: {} as Record<CollisionLayer, AnyView[]>,
  fps: 0,
  isLogicPaused: false,
  timeScale: 1,
});

export const getState = () => gameState;

export const addView = (view: AnyView) => {
  const layer = view.layer;
  if (!gameState.views[layer]) {
    gameState.views[layer] = [];
  }
  gameState.views[layer].push(view);
};

export const removeView = (view: AnyView) => {
  const layer = view.layer;
  if (gameState.views[layer]) {
    gameState.views[layer] = gameState.views[layer].filter(v => v !== view);
  }
};

// Helper function to get all views across all layers
export const getAllViews = (): AnyView[] => {
  return Object.values(gameState.views).flat();
};

export const getAllCollidableViews = (): AnyView[] => {
  return [...getViewsOnLayer('DEFAULT'), ...getViewsOnLayer('PLAYER')];
};

export const updateView = (view: AnyView) => {
  const layer = view.layer;
  const stateViews = getViewsOnLayer(layer);
  const viewIndex = stateViews.findIndex(v => v.id === view.id);
  if (viewIndex !== -1) {
    stateViews[viewIndex] = view;
  }
};

// Helper function to get views on a specific layer
export const getViewsOnLayer = (layer: CollisionLayer): AnyView[] => {
  return gameState.views[layer] || [];
};

// Clear all views and clean up their resources
export const clearAllViews = () => {
  const allViews = getAllViews();

  // Clean up all views
  for (const view of allViews) {
    // Remove view from game state
    removeView(view);
  }

  // Clear all layers
  gameState.views = {} as Record<CollisionLayer, AnyView[]>;
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

export const getCollisionLayerViews = (
  layer: CollisionLayer,
  excludeEmptyBounds = true
): AnyView[] => {
  const collidingViews = [];
  const layers = COLLISION_MATRIX[layer];

  if (!layers) {
    // console.warn(`No collision layers found for layer ${layer}`);
    return [];
  }

  for (const layer of layers) {
    const views = getViewsOnLayer(layer);
    if (excludeEmptyBounds) {
      collidingViews.push(
        ...views.filter(v => v.bounds !== undefined && v.bounds.width !== 0)
      );
    } else {
      collidingViews.push(...views);
    }
  }

  return collidingViews;
};
