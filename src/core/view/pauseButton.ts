import {
  getState,
  setTimeScale,
  toggleLogicPaused,
} from '../gameState/gameState';
import type { DeepPartial } from '../types';
import type { InteractiveView } from './types';
import { createInteractiveView } from './interactiveView';
import { config } from '../config';

export const createPauseButton = (
  props: DeepPartial<InteractiveView> = {},
  logicOrAnimation: 'logic' | 'animation' | 'both' = 'both'
) => {
  const defaultProps: DeepPartial<InteractiveView> = {
    id: `pause-button-${logicOrAnimation}-${props.relativeTo}`,
    layer: 'UI',
    shape: 'text',
    position: {
      x: -1,
      y: 0,
    },
    fill: {
      color: 'white',
    },
    handlers: {
      onClick: () => {
        handlePause();
      },
      onHover: () => {
        scale(1.1);
      },
      onHoverOut: () => {
        scale(1);
      },
      onKeyDown: event => {
        const keys = [' ', 'p', 'Escape', 'Delete', 'Backspace'];
        if (keys.includes(event.key)) {
          handlePause();
        }
      },
    },
  };

  const scale = (scale: number) => {
    viewInstance.updateScale(scale);
  };

  const mergedProps = {
    ...config,
    ...defaultProps,
    ...props,
  } as InteractiveView;
  const viewInstance = createInteractiveView(mergedProps);

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
    viewInstance.updateText(paused ? '▶️' : '⏸️');
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
