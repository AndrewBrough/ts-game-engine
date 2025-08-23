import { togglePaused, getState } from "../state/state";
import type { DeepPartial } from "../types";
import type { InteractiveView } from "./types";
import { createAnimatedView } from "./animatedView";

export const createPauseButton = (props: DeepPartial<InteractiveView> = {}) => {
    const defaultProps: DeepPartial<InteractiveView> = {
        id: 'pause-button',
        relativeTo: 'top-right',
        shape: 'text',
        textProps: {
            text: 'Pause',
        },
        fill: {
            color: 'white',
        },
        handlers: {
            onClick: (_event: MouseEvent, view: InteractiveView) => {
                console.log("Clicked pause");
                togglePaused();
                // Update the button text based on pause state
                const { isPaused } = getState();
                view.textProps.text = isPaused ? 'Resume' : 'Pause';
            },
            // onHover: (_event: MouseEvent, view: InteractiveView) => {
            //     // Change color on hover
            //     view.fill.color = '#ffff00'; // Yellow
            // },
            // onHoverOut: (_event: MouseEvent, view: InteractiveView) => {
            //     // Restore original color
            //     view.fill.color = 'white';
            // },
        },
    };

    const mergedProps = { ...defaultProps, ...props };
    const viewInstance = createAnimatedView(mergedProps);

    return viewInstance;
};
