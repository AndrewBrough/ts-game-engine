import { createButton, type ButtonProps } from '../components/button';
import { getState, toggleLogicPaused } from '../gameState/gameState';
import { Screen } from '../units';
import { deepMerge } from '../utils/deepMerge';

const PAUSE_KEYS = [' ', 'p', 'Escape', 'Delete', 'Backspace'];

/**
 * Pauses game logic (updates, physics, collisions) while rendering continues,
 * so the button can still redraw and show hover state while paused.
 */
export const createPauseButton = ({ onClick, ...props }: ButtonProps = {}) => {
  const label = () => (getState().isLogicPaused ? '▶' : '⏸️');

  const defaults: ButtonProps = {
    id: 'pauseButton',
    hotkeys: PAUSE_KEYS,
    text: {
      text: label(),
      fontSize: Screen.percent(4).w,
    },
    geometry: {
      width: Screen.percent(4).w,
      height: Screen.percent(4).h,
      x: Screen.w - Screen.percent(5).w,
      y: Screen.percent(1).w,
    },
  };

  return createButton({
    ...deepMerge(defaults, props),
    onClick: button => {
      toggleLogicPaused();
      button.setText(label());
      onClick?.(button);
    },
  });
};
