import { createCanvas } from './core/canvas/canvas';

import { bindMouse } from './core/input/mouse';
import { createLoop } from './core/loop/loop';
import { createFpsView } from './core/loop/fpsView';
import { createDemoCubeView } from './core/view/demoCubeView';
import { createPauseButton } from './core/view/pauseButton';
import { bindKeyboard } from './core/input/keyboard';

window.onload = () => {
  createCanvas('app');
  bindMouse();
  bindKeyboard();
  createLoop();
  
  createDemoCubeView();
  createFpsView();

  createPauseButton({ 
    relativeTo: 'top-right',
  }, 'both');
};
