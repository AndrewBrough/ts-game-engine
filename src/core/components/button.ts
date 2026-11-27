import type { DeepPartial } from '../types';
import { Screen } from '../units';
import { deepMerge } from '../utils/deepMerge';
import { addLayout, type LayoutFn } from '../view/components/addLayout';
import type { StyleProps, View } from '../view/types';
import { createView } from '../view/view';

export type ButtonProps = DeepPartial<View> & {
  /** Called on mouse click and when any of `hotkeys` is pressed. */
  onClick?: (button: ButtonInstance) => void;
  /** Keys (KeyboardEvent.key values) that also trigger the button, e.g. [' ', 'p']. */
  hotkeys?: string[];
  /** Geometry style merged in while hovered, reverted on mouse out. */
  hoverStyle?: DeepPartial<StyleProps>;
  /**
   * Position/size relative to the screen, re-run on every canvas resize.
   * Overrides geometry x/y/width/height (and text fontSize if returned).
   */
  layout?: LayoutFn;
};

export type ButtonInstance = ReturnType<typeof createButton>;

const defaultButtonProps: DeepPartial<View> = {
  layer: 'UI',
  text: {
    text: '',
    align: 'center-within',
    verticalAlign: 'center-within',
    fontSize: Screen.percent(2).w,
    style: {
      fill: { color: 'black', opacity: 1 },
    },
  },
  geometry: {
    shape: 'roundRect',
    width: Screen.percent(10).w,
    height: Screen.percent(5).h,
    style: {
      fill: { color: 'white', opacity: 0.3 },
      radii: 4,
    },
  },
};

const defaultHoverStyle: DeepPartial<StyleProps> = {
  fill: { opacity: 1 },
};

/**
 * A clickable view. Position, size, shape, style and text are all regular
 * View props, so a button can be placed and styled like any other view.
 *
 * const play = createButton({
 *   text: { text: 'Play' },
 *   layout: () => ({ x: Screen.center.x - 60, y: Screen.center.y - 20 }),
 *   onClick: () => getSceneManager().loadScene('PONG'),
 * });
 */
export const createButton = ({
  onClick,
  hotkeys = [],
  hoverStyle = defaultHoverStyle,
  layout,
  ...viewProps
}: ButtonProps = {}) => {
  const view = createView({
    ...deepMerge(defaultButtonProps, viewProps),
    id: viewProps.id ?? `button-${crypto.randomUUID()}`,
  });

  if (layout) view.addComponent('layout', addLayout(view, layout));

  const click = () => onClick?.(button);

  const setText = (text: string | number) => view.updateText({ text });

  // Style to restore on mouse out, captured on mouse over so later style
  // changes made while not hovered are preserved.
  let styleBeforeHover: StyleProps | null = null;

  const onMouseOver = () => {
    styleBeforeHover = structuredClone(view.geometry.style);
    view.updateGeometryStyle(hoverStyle);
  };

  const onMouseOut = () => {
    if (styleBeforeHover) {
      view.updateGeometryStyle(styleBeforeHover);
      styleBeforeHover = null;
    }
  };

  // Register on the instance stored in game state: that's what the mouse
  // dispatcher reads. Don't return a spread copy of the view, or these are lost.
  view.interactive = true;
  view.handlers.set('click', click);
  view.handlers.set('mouseover', onMouseOver);
  view.handlers.set('mouseout', onMouseOut);

  if (hotkeys.length > 0) {
    // view.events listeners are removed when the view/scene is destroyed
    view.events.addEvent('keydown', (e: KeyboardEvent) => {
      if (!e.repeat && hotkeys.includes(e.key)) click();
    });
  }

  const button = Object.assign(view, { click, setText });
  return button;
};
