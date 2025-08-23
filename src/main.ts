import { createCanvas } from './core/canvas/canvas';
import { bindMouse } from './core/input/mouse';
import { createLoop } from './core/loop/loop';
import { createPauseButton } from './core/view/pauseButton';
import { bindKeyboard } from './core/input/keyboard';
import { devKeyboardShortcuts } from './core/input/devKeyboardShortcuts';
import { initializeRenderer } from './core/renderer/renderer';

window.onload = () => {
  createCanvas('app');
  bindMouse();
  bindKeyboard();
  createLoop();
  devKeyboardShortcuts();
  
  // Initialize the renderer to handle view rendering
  initializeRenderer();
  
  createPauseButton({ 
    relativeTo: 'top-right',
  }, 'both');
};
