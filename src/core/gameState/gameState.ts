import { createModel } from '../model/model';
import type { ViewInstance } from '../view/view';
import { COLLISION_MATRIX, type CollisionLayer } from './collisionLayers';

export type GameState = {
  score: number;
  views: Record<CollisionLayer, ViewInstance[]>;
  fps: number;
  isLogicPaused: boolean;
  timeScale: number;
};

const gameState = createModel<GameState>({
  score: 0,
  views: {} as Record<CollisionLayer, ViewInstance[]>,
  fps: 0,
  isLogicPaused: false,
  timeScale: 1,
});

export const addView = (view: ViewInstance) => {
  const layer = view.layer;
  if (!gameState.views[layer]) {
    gameState.views[layer] = [];
  }
  gameState.views[layer].push(view);
};

export const removeView = (view: ViewInstance) => {
  const layer = view.layer;
  if (gameState.views[layer]) {
    gameState.views[layer] = gameState.views[layer].filter(v => v !== view);
  }
};

export const getState = () => {
  return gameState;
};

const handleViewAdded = (e: CustomEvent<{ view: ViewInstance }>) => {
  addView(e.detail.view);
};

const handleViewRemoved = (e: CustomEvent<{ view: ViewInstance }>) => {
  removeView(e.detail.view);
};

window.addEventListener('viewAdded', handleViewAdded as EventListener);
window.addEventListener('viewRemoved', handleViewRemoved as EventListener);

// Helper function to get all views across all layers
export const getAllViews = (): ViewInstance[] => {
  return Object.values(gameState.views).flat();
};

export const getAllCollidableViews = (): ViewInstance[] => {
  const views = Object.keys(gameState.views).map(layer => {
    if (COLLISION_MATRIX[layer as CollisionLayer].length > 0) {
      return gameState.views[layer as CollisionLayer];
    }
    return [];
  });

  return views.flat();
};

export const updateView = (view: ViewInstance) => {
  const layer = view.layer;
  const stateViews = getViewsOnLayer(layer);
  const viewIndex = stateViews.findIndex(v => v.id === view.id);
  if (viewIndex !== -1) {
    stateViews[viewIndex] = view;
  }
};

// Helper function to get views on a specific layer
export const getViewsOnLayer = (layer: CollisionLayer): ViewInstance[] => {
  return gameState.views[layer] || [];
};

// Clear all views and clean up their resources
export const clearAllViews = () => {
  const allViews = getAllViews();

  // Clean up all views
  for (const view of allViews) {
    // Call view-specific cleanup if it exists
    view.destroy();
    // Remove view from game state
    removeView(view);
  }

  // Clear all layers
  gameState.views = {} as Record<CollisionLayer, ViewInstance[]>;
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
  layer: CollisionLayer
): ViewInstance[] => {
  const collidingViews: ViewInstance[] = [];
  const layers = COLLISION_MATRIX[layer];

  if (!layers) {
    // console.warn(`No collision layers found for layer ${layer}`);
    return [];
  }

  for (const layer of layers) {
    const views = getViewsOnLayer(layer);
    collidingViews.push(...views);
  }

  return collidingViews;
};
