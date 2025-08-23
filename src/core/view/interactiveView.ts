import type { DeepPartial } from "../types";
import { createAnimatedView } from "./animatedView";
import type { InteractiveView } from "./types";

export type InteractiveViewInstance = ReturnType<typeof createInteractiveView>;

export const createInteractiveView = (props: DeepPartial<InteractiveView>) => {
    const view = createAnimatedView(props);
    
    // Store handler references for proper cleanup
    const handlers = {
        click: (event: Event) => view.events.events.get('onClick')?.(event),
        mouseover: (event: Event) => view.events.events.get('onHover')?.(event),
        mouseout: (event: Event) => view.events.events.get('onHoverOut')?.(event),
        keydown: (event: Event) => view.events.events.get('onKeyDown')?.(event),
        keyup: (event: Event) => view.events.events.get('onKeyUp')?.(event),
    };

    const addHandlers = () => {
        window.addEventListener('click', handlers.click);
        window.addEventListener('mouseover', handlers.mouseover);
        window.addEventListener('mouseout', handlers.mouseout);
        window.addEventListener('keydown', handlers.keydown);
        window.addEventListener('keyup', handlers.keyup);
    }

    const clearHandlers = () => {
        window.removeEventListener('click', handlers.click);
        window.removeEventListener('mouseover', handlers.mouseover);
        window.removeEventListener('mouseout', handlers.mouseout);
        window.removeEventListener('keydown', handlers.keydown);
        window.removeEventListener('keyup', handlers.keyup);
    }

    addHandlers();

    return {
        ...view,
        ...view.props,
        addHandlers,
        clearHandlers,
    };
};
