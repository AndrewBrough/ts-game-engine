import { screenSaver } from "./animations/screenSaver";
import { createAnimatedView } from "./animatedView";

export const createDemoCubeView = () => {
    const animatedView = createAnimatedView({
        id: 'demoCube',
        shapeProps: {
          width: 10,
          height: 10,
        },
        shape: 'rect',
        fill: {
          color: 'red',
        },
      });
    const screenSaverAnimate = screenSaver(animatedView);

    animatedView.addAnimation(() => {
        screenSaverAnimate();
    }, 'update');

    return animatedView;
};