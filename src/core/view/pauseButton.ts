import { getState, setTimeScale, toggleLogicPaused } from "../state/state";
import type { DeepPartial } from "../types";
import type { InteractiveView } from "./types";
import { createInteractiveView } from "./interactiveView";
import { config } from "../config";

export const createPauseButton = (props: DeepPartial<InteractiveView> = {}, logicOrAnimation: 'logic' | 'animation' = 'logic') => {
    const defaultProps: DeepPartial<InteractiveView> = {
        id: `pause-button-${logicOrAnimation}`,
        position: { x: 1, y: 1 },
        relativeTo: 'top-right',
        shape: 'text',
        fill: {
            color: 'white',
        },
        handlers: {
            onClick: () => {
                console.log('onClick', logicOrAnimation);
                handlePause();
            },
        },
    };

    const mergedProps = { ...config, ...defaultProps, ...props } as InteractiveView;
    const viewInstance = createInteractiveView(mergedProps);

    const handlePause = () => {
        console.log('handlePause', logicOrAnimation);
        const { timeScale } = getState();
        if(logicOrAnimation === 'logic') {
            toggleLogicPaused();
        } else {
            setTimeScale(timeScale > 0 ? 0 : 1);
        }
        updateText();
    }

    const updateText = () => {
        const { timeScale, isLogicPaused } = getState();
        viewInstance.updateText(logicOrAnimation === 'logic' ? (isLogicPaused ? 'Logic Resume' : 'Logic Pause') : (timeScale === 0 ? 'Animation Resume' : 'Animation Pause'));
    }

    updateText();
    viewInstance.update();

    return viewInstance;
};
