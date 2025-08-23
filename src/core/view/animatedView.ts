import type { ViewRenderProps } from "./types";
import { createView } from "./view";
import type { DeepPartial } from "../types";
import { screenSaver } from "./animations/screenSaver";

export const createAnimatedView = (props: DeepPartial<ViewRenderProps>) => {
    const viewInstance = createView(props);
    const screenSaverAnimate = screenSaver(viewInstance);
    // const demoAnimate = demoAnimation(viewInstance);

    const animate = () => {
        // demoAnimate();
        screenSaverAnimate();
        // console.log(`Frame ${animationFrame++}: X=${currentX.toFixed(1)}, Hue=${hue}`);
    };

    viewInstance.events.addEvent('animate', () => {
        animate();
    });

    return {
        ...viewInstance,
    };
};