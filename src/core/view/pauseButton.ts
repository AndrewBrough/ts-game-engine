import {
  getState,
  setTimeScale,
  toggleLogicPaused,
} from '../gameState/gameState';
import type { DeepPartial } from '../types';
import type { InteractiveView } from './types';
import { createInteractiveView } from './interactiveView';
import { Screen } from '../units';

export const createPauseButton = (props: DeepPartial<InteractiveView> = {}) => {
  const viewInstance = createInteractiveView({
    ...props,
    layer: 'UI',
    text: {
      offset: 'center',
      text: '⏸',
      fontSize: Screen.percent(4).w,
      style: {
        fill: {
          color: 'black',
          opacity: 1,
        },
      },
    },
    geometry: {
      shape: 'roundRect',
      width: Screen.percent(6).w,
      height: Screen.percent(4.5).h,
      x: Screen.w - Screen.percent(7).w,
      y: Screen.percent(1).w,
      style: {
        fill: {
          color: 'white',
          opacity: 0.3,
        },
      },
    },
    handlers: {
      onClick: () => {
        handlePause();
      },
      onHover: () => {
        viewInstance.updateScale(1.05);
        viewInstance.updateGeometryStyle({
          fill: {
            opacity: 1,
          },
        });
      },
      onHoverOut: () => {
        viewInstance.updateScale(1);
        viewInstance.updateGeometryStyle({
          fill: {
            opacity: 0.3,
          },
        });
      },
      onKeyDown: event => {
        const keys = [' ', 'p', 'Escape', 'Delete', 'Backspace'];
        if (keys.includes(event.key)) {
          handlePause();
        }
      },
    },
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
    viewInstance.updateText({
      text: paused ? '▶' : '⏸',
    });
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
