/**
 * Viewport size in CSS pixels, read live so it stays correct after a resize
 * or rotation. Values captured into variables (e.g. a view's x/y at creation)
 * don't update by themselves.
 */
export const Screen = {
  get w() {
    return window.innerWidth;
  },
  get h() {
    return window.innerHeight;
  },
  get center() {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  },
  percent: (percent: number = 20) => ({
    w: (percent / 100) * window.innerWidth,
    h: (percent / 100) * window.innerHeight,
  }),
};
