import { createCanvas } from './core/canvas/canvas';
import { bindMouse } from './core/input/mouse';
import { createLoop } from './core/loop/loop';
import { bindKeyboard } from './core/input/keyboard';
import { devKeyboardShortcuts } from './core/input/devKeyboardShortcuts';

window.onload = () => {
  createCanvas('app');
  bindMouse();
  bindKeyboard();
  createLoop();
  devKeyboardShortcuts();
};
