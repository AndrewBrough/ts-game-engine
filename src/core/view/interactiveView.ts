import type { DeepPartial } from "../types";
import { createAnimatedView } from "./animatedView";
import type { InteractiveView } from "./types";

export type InteractiveViewInstance = ReturnType<typeof createInteractiveView>;

export const createInteractiveView = (props: DeepPartial<InteractiveView>) => {
    const view = createAnimatedView(props);

    const addHandlers = () => {
        window.addEventListener('click', (event) => {
            view.events.events.get('onClick')?.(event);
        });
        window.addEventListener('mouseover', (event) => {
            view.events.events.get('onHover')?.(event);
        });
        window.addEventListener('mouseout', (event) => {
            view.events.events.get('onHoverOut')?.(event);
        });
        window.addEventListener('keydown', (event) => {
            view.events.events.get('onKeyDown')?.(event);
        });
        window.addEventListener('keyup', (event) => {
            view.events.events.get('onKeyUp')?.(event);
        });
    }

    const clearHandlers = () => {
        window.removeEventListener('click', (event) => {
            view.events.events.get('onClick')?.(event);
        });
        window.removeEventListener('mouseover', (event) => {
            view.events.events.get('onHover')?.(event);
        });
        window.removeEventListener('mouseout', (event) => {
            view.events.events.get('onHoverOut')?.(event);
        });
        window.removeEventListener('keydown', (event) => {
            view.events.events.get('onKeyDown')?.(event);
        });
        window.removeEventListener('keyup', (event) => {
            view.events.events.get('onKeyUp')?.(event);
        });
    }

    addHandlers();

    return {
        ...view,
        ...view.props,
        addHandlers,
        clearHandlers,
    };
};
