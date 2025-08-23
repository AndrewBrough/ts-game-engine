import { getCanvas, getContext } from "../canvas/canvas";

export const createLoop = () => {
  const paused = false;

  const loop = () => {
    if(!paused) {
        // console.log("Loop");
        getContext().clearRect(0, 0, getCanvas().width, getCanvas().height);
        window.dispatchEvent(new Event('animate'));
        window.requestAnimationFrame(loop);
    }
  };

  loop();

  return {
    loop,
  };
};