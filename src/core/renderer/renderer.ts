import { getAllViews } from "../gameState/gameState";
import type { ViewInstance, AnimatedViewInstance, InteractiveViewInstance } from "../view/types";

// Store view instances for rendering
const viewInstances: (ViewInstance | AnimatedViewInstance | InteractiveViewInstance)[] = [];

export const addViewInstance = (viewInstance: ViewInstance | AnimatedViewInstance | InteractiveViewInstance) => {
  viewInstances.push(viewInstance);
};

export const removeViewInstance = (viewInstance: ViewInstance | AnimatedViewInstance | InteractiveViewInstance) => {
  const index = viewInstances.indexOf(viewInstance);
  if (index > -1) {
    viewInstances.splice(index, 1);
  }
};

export const clearAllViewInstances = () => {
  // Clean up all view instances
  for (const viewInstance of viewInstances) {
    // Clean up view event listeners
    if (viewInstance.events) {
      viewInstance.events.cleanup();
    }
    
    // Clear handlers for interactive views
    if ('clearHandlers' in viewInstance && typeof viewInstance.clearHandlers === 'function') {
      viewInstance.clearHandlers();
    }
  }
  
  // Clear the array
  viewInstances.length = 0;
};

// Render all view instances
const renderAllViews = () => {
  for (const viewInstance of viewInstances) {
    if (viewInstance.events) {
      viewInstance.events.events.get('render')?.();
    }
  }
};

// Update all view instances
const updateAllViews = () => {
  for (const viewInstance of viewInstances) {
    if (viewInstance.events) {
      viewInstance.events.events.get('update')?.();
    }
  }
};

// Initialize the renderer by listening to global events
export const initializeRenderer = () => {
  window.addEventListener('render', renderAllViews);
  window.addEventListener('update', updateAllViews);
};

export const cleanupRenderer = () => {
  window.removeEventListener('render', renderAllViews);
  window.removeEventListener('update', updateAllViews);
  clearAllViewInstances();
};
