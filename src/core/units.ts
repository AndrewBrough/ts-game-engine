export const Screen = {
  w: window.innerWidth,
  h: window.innerHeight,
  center: {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  },
  percent: (percent: number = 20) => ({
    w: (percent / 100) * window.innerWidth,
    h: (percent / 100) * window.innerHeight,
  }),
};
