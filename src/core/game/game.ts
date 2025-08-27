import { createCanvas } from '../canvas/canvas';
import { bindKeyboard } from '../input/keyboard';
import { bindMouse } from '../input/mouse';
import { createLoop } from '../loop/loop';

export const createGame = () => {
  const canvas = createCanvas('app');
  const mouse = bindMouse();
  const keyboard = bindKeyboard();
  const loop = createLoop();

  return {
    canvas,
    mouse,
    keyboard,
    loop,
  };
};
