export const Screen = {
  w: window.innerWidth,
  h: window.innerHeight,
  center: {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  },
  percent: (percent: number = 20) => ({
    w: window.innerWidth / percent,
    h: window.innerHeight / percent,
  }),
};
