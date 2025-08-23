import { createModel } from "../model/model";
import type { View, InteractiveView } from "../view/types";
import { COLLISION_MATRIX, type CollisionLayer } from "./collisionLayers";

export type GameState = {
  score: number;
  views: Record<CollisionLayer, (View | InteractiveView)[]>;
  fps: number;
  isLogicPaused: boolean;
  timeScale: number;
  focusedView: InteractiveView | null;
};

// Track game state instances
let gameStateInstanceCount = 0;
const gameStateInstanceId = ++gameStateInstanceCount;

const gameState = createModel<GameState>({
  score: 0,
  views: {} as Record<CollisionLayer, (View | InteractiveView)[]>,
  fps: 0,
  isLogicPaused: false,
  timeScale: 1,
  focusedView: null,
});

console.log(`🎮 GameState instance #${gameStateInstanceId} created at ${new Date().toISOString()}`);

export const getState = () => gameState;

export const addView = (view: View | InteractiveView) => {
  const layer = view.layer;
  console.log(`🎮 [Instance #${gameStateInstanceId}] Adding view ${view.id} to layer ${layer}`);
  if (!gameState.views[layer]) {
    gameState.views[layer] = [];
  }
  gameState.views[layer].push(view);
  console.log(`🎮 [Instance #${gameStateInstanceId}] Total views in ${layer}: ${gameState.views[layer].length}`);
};

export const removeView = (view: View | InteractiveView) => {
  const layer = view.layer;
  if (gameState.views[layer]) {
    gameState.views[layer] = gameState.views[layer].filter((v) => v !== view);
  }
};

// Helper function to get all views across all layers
export const getAllViews = (): (View | InteractiveView)[] => {
  return Object.values(gameState.views).flat();
};

export const getAllCollidableViews = (): (View | InteractiveView)[] => {
  return [...getViewsOnLayer('DEFAULT'), ...getViewsOnLayer('PLAYER')];
};

export const updateView = (view: View | InteractiveView) => {
  const layer = view.layer;
  const stateViews = getViewsOnLayer(layer);
  const viewIndex = stateViews.findIndex((v) => v.id === view.id);
  if (viewIndex !== -1) {
    stateViews[viewIndex] = view;
  }
};

// Helper function to get views on a specific layer
export const getViewsOnLayer = (layer: CollisionLayer): (View | InteractiveView)[] => {
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
  gameState.views = {} as Record<CollisionLayer, (View | InteractiveView)[]>; 
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

// Debug function to check game state status
export const debugGameState = () => {
  console.log(`🎮 === GameState Debug Info ===`);
  console.log(`🎮 Instance ID: #${gameStateInstanceId}`);
  console.log(`🎮 Total views across all layers: ${getAllViews().length}`);
  
  const viewsByLayer = new Map<string, number>();
  getAllViews().forEach(view => {
    const count = viewsByLayer.get(view.layer) || 0;
    viewsByLayer.set(view.layer, count + 1);
  });
  
  console.log(`🎮 Views by layer:`, Object.fromEntries(viewsByLayer));
  console.log(`🎮 Collidable views: ${getAllCollidableViews().length}`);
  console.log(`🎮 ===============================`);
  
  return {
    instanceId: gameStateInstanceId,
    totalViews: getAllViews().length,
    viewsByLayer: Object.fromEntries(viewsByLayer),
    collidableViews: getAllCollidableViews().length
  };
};

export const getCollisionLayerViews = (layer: CollisionLayer, excludeEmptyBounds = true): (View | InteractiveView)[] => {
  const collidingViews = [];
  const layers = COLLISION_MATRIX[layer]
  
  if(!layers) {
    console.warn(`No collision layers found for layer ${layer}`);
    return [];
  }

  for(const layer of layers) {
    const views = getViewsOnLayer(layer);
    if(excludeEmptyBounds) {
      collidingViews.push(...views.filter((v) => v.bounds));
    } else {
      collidingViews.push(...views);
    }
  }

  return collidingViews;
};