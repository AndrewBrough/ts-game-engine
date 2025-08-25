import {
  getState,
  setTimeScale,
  toggleLogicPaused,
} from '../gameState/gameState';
import type { DeepPartial } from '../types';
import type { InteractiveView } from './types';
import { createInteractiveView } from './interactiveView';
import { defaultViewConfig } from '../config';

export const createPauseButton = (props: DeepPartial<InteractiveView> = {}) => {
  const viewInstance = createInteractiveView({
    ...defaultViewConfig,
    layer: 'UI',
    handlers: {
      onClick: () => {
        handlePause();
      },
      onKeyDown: event => {
        const keys = [' ', 'p', 'Escape', 'Delete', 'Backspace'];
        if (keys.includes(event.key)) {
          handlePause();
        }
      },
    },
    ...props,
  });

  viewInstance.events.addEvent('hover', () => {
    viewInstance.updateScale(1.1);
  });
  viewInstance.events.addEvent('hoverOut', () => {
    viewInstance.updateScale(1);
  });

  const handlePause = () => {
    const { timeScale, isLogicPaused } = getState();
    const paused = timeScale === 0 || isLogicPaused;
    console.log('paused', paused);

    if (paused) {
      toggleLogicPaused();
      setTimeScale(1);
    }
    if (!paused) {
      toggleLogicPaused();
      setTimeScale(timeScale > 0 ? 0 : 1);
    }
    updateText();
  };

  const updateText = () => {
    const { timeScale, isLogicPaused } = getState();
    const paused = timeScale === 0 || isLogicPaused;
    viewInstance.updateText(paused ? '▶' : '⏸');
    // if (logicOrAnimation === 'both') {
    //   viewInstance.updateText(paused ? 'Resume' : 'Pause');
    // }
    // if (logicOrAnimation === 'logic') {
    //   viewInstance.updateText(
    //     isLogicPaused ? 'Resume Updates' : 'Pause Updates'
    //   );
    // }
    // if (logicOrAnimation === 'animation') {
    //   viewInstance.updateText(timeScale === 0 ? 'Resume Time' : 'Pause Time');
    // }
  };

  updateText();
  viewInstance.update();

  return viewInstance;
};
