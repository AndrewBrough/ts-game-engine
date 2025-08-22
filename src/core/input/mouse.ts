import { locateView } from "../state/state";

export const bindMouse = () => {
  window.addEventListener('click', (e) => {
    const view = locateView({ x: e.clientX, y: e.clientY });
    if (view) {
      console.log("Clicked on view ", view);
    }
  });
//   window.addEventListener('mousemove', (e) => {
//     const view = locateView({ x: e.clientX, y: e.clientY });
//     if (view) {
//       console.log(view);
//     }
//   });
};