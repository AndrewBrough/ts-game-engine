
import type { ViewInstance } from "../view/types";

// Store view instances for rendering
const viewInstances: ViewInstance[] = [];

export const addViewInstance = (viewInstance: ViewInstance) => {
  viewInstances.push(viewInstance);
};

export const removeViewInstance = (viewInstance: ViewInstance) => {
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
const renderAllViews = (e: Event) => {
  for (const viewInstance of viewInstances) {
    if (viewInstance.events) {
        viewInstance.events.events.get('render')?.(e);
    }
  }
};

// Update all view instances
const updateAllViews = (e: Event) => {
  for (const viewInstance of viewInstances) {
    if (viewInstance.events) {
      viewInstance.events.events.get('update')?.(e);
    }
  }
};

// Initialize the renderer by listening to global events
export const initializeRenderer = () => {
  window.addEventListener('render', renderAllViews);
  window.addEventListener('update', updateAllViews);
};

export const cleanupRenderer = () => {
  window.removeEventListener('render', (e) => renderAllViews(e));
  window.removeEventListener('update', (e) => updateAllViews(e));
  clearAllViewInstances();
};
