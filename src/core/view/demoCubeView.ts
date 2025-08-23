import { screenSaver } from "./animations/screenSaver";
import { createAnimatedView } from "./animatedView";

export const createDemoCubeView = () => {
    const animatedView = createAnimatedView({
        id: 'demoCube',
        handlers: {
          onHover: (e, view) => {
            console.log("Hovered on view ", view);
          },
          onClick: (e, view) => {
            console.log("Clicked on view ", view);
          },
        },
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
    });

    return animatedView;
};