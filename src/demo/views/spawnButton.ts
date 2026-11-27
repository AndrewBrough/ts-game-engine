import { createButton, type ButtonProps } from '../../core/components/button';
import { Screen } from '../../core/units';
import { deepMerge } from '../../core/utils/deepMerge';

// Bottom-right corner; functions so they're recalculated on resize
const bottomRight = () => {
  const width = Screen.percent(12).w;
  const height = Screen.percent(6).h;
  const margin = Screen.percent(1).w;
  return {
    width,
    height,
    x: Screen.w - width - margin,
    y: Screen.h - height - margin,
    fontSize: Screen.percent(1.5).w,
  };
};

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
    text: { text: label() },
    layout: bottomRight,
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
