import {
  getState,
  setTimeScale,
  toggleLogicPaused,
} from '../gameState/gameState';
import type { DeepPartial } from '../types';
import { Screen } from '../units';
import { addInputHandlers } from './components';
import type { View } from './types';
import { createView } from './view';

export const createPauseButton = (props: DeepPartial<View> = {}) => {
  const viewInstance = createView({
    ...props,
    id: 'pauseButton',
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
  });

  const { addHandler, handlers } = addInputHandlers();
  addHandler('click', 'click', () => {
    handlePause();
  });
  addHandler('mouseover', 'mouseover', () => {
    viewInstance.updateGeometryStyle({
      fill: {
        opacity: 1,
      },
    });
  });
  addHandler('mouseout', 'mouseout', (e: CustomEvent) => {
    viewInstance.updateGeometryStyle({
      fill: {
        opacity: 0.3,
      },
    });
  });
  addHandler('keydown', 'keydown', e => {
    console.log('keydown', e);
    if (!(e as unknown as KeyboardEvent).key) return;

    const keys = [' ', 'p', 'Escape', 'Delete', 'Backspace'];
    if (keys.includes((e as unknown as KeyboardEvent).key)) {
      handlePause();
    }
  });

  viewInstance.events.addEvent('keydown', e => {});

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

  return { ...viewInstance, handlers };
};
