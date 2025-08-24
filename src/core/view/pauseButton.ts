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
    fill: {
      color: 'white',
    },
    handlers: {
      onClick: () => {
        console.log('clicked');
        handlePause();
      },
      onHover: () => {
        console.log('hovered');
        scale(1.1);
      },
      onHoverOut: () => {
        console.log('hovered out');
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
    console.log('scale', scale);
    viewInstance.updateSize(
      (viewInstance.props.bounds?.width ?? 0) * scale,
      (viewInstance.props.bounds?.height ?? 0) * scale
    );
  };

  const mergedProps = {
    ...config,
    ...defaultProps,
    ...props,
  } as InteractiveView;
  const viewInstance = createInteractiveView(mergedProps);

  const handlePause = () => {
    const { timeScale } = getState();
    if (logicOrAnimation === 'logic' || logicOrAnimation === 'both') {
      toggleLogicPaused();
    }
    if (logicOrAnimation === 'animation' || logicOrAnimation === 'both') {
      setTimeScale(timeScale > 0 ? 0 : 1);
    }
    updateText();
  };

  const updateText = () => {
    const { timeScale, isLogicPaused } = getState();
    if (logicOrAnimation === 'both') {
      viewInstance.updateText(isLogicPaused ? 'Resume' : 'Pause');
    }
    if (logicOrAnimation === 'logic') {
      viewInstance.updateText(
        isLogicPaused ? 'Resume Updates' : 'Pause Updates'
      );
    }
    if (logicOrAnimation === 'animation') {
      viewInstance.updateText(timeScale === 0 ? 'Resume Time' : 'Pause Time');
    }
  };

  updateText();
  viewInstance.update();

  return viewInstance;
};
