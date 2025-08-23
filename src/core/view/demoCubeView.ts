import type { AnimatedViewInstance } from "./types";
import { screenSaver } from "./animations/screenSaver";
import { createAnimatedView } from "./animatedView";

export const createDemoCubeView = (): AnimatedViewInstance => {
    const animatedViewInstance = createAnimatedView({
        id: 'demoCube',
        position: { x: 1, y: 1 },
        shapeProps: {
          width: 10,
          height: 10,
        },
        shape: 'rect',
        fill: {
          color: 'red',
        },
      });
    const screenSaverAnimate = screenSaver(animatedViewInstance);

    animatedViewInstance.addAnimation(() => {
        screenSaverAnimate();
    });

    return animatedViewInstance;
};