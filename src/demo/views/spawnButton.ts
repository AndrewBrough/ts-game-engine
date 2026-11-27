import { createButton, type ButtonProps } from '../../core/components/button';
import { Screen } from '../../core/units';
import { deepMerge } from '../../core/utils/deepMerge';

const WIDTH = Screen.percent(12).w;
const HEIGHT = Screen.percent(6).h;
const MARGIN = Screen.percent(1).w;

/**
 * Bottom-right button (and Space by default) that calls `spawn` with
 * `count`, then shows the running total.
 */
export const createSpawnButton = (
  spawn: (count: number) => void,
  {
    count = 50,
    initialTotal = 0,
    ...props
  }: ButtonProps & { count?: number; initialTotal?: number } = {}
) => {
  let total = initialTotal;
  const label = () => `+${count} (${total})`;

  const defaults: ButtonProps = {
    id: 'spawnButton',
    hotkeys: [' '],
    text: {
      text: label(),
      fontSize: Screen.percent(1.5).w,
    },
    geometry: {
      width: WIDTH,
      height: HEIGHT,
      x: Screen.w - WIDTH - MARGIN,
      y: Screen.h - HEIGHT - MARGIN,
    },
  };

  const { onClick, ...rest } = props;
  return createButton({
    ...deepMerge(defaults, rest),
    onClick: button => {
      spawn(count);
      total += count;
      button.setText(label());
      onClick?.(button);
    },
  });
};
