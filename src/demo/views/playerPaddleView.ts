import type { DeepPartial } from '../../core/types';
import { Screen } from '../../core/units';
import { deepMerge } from '../../core/utils/deepMerge';
import type { ControlProps } from '../../core/view/components/input';
import { createPlayerView } from '../../core/view/entity/playerView';
import type { View } from '../../core/view/types';

export const playerPaddleView = (
  props: DeepPartial<View>,
  controls: ControlProps
) => {
  const mergedProps = deepMerge(basePlayerProps, props);
  const paddle = createPlayerView(
    {
      ...mergedProps,
    },
    {
      ...controls,
    }
  );

  return paddle;
};

const basePlayerProps: DeepPartial<View> = {
  model: {
    score: 0,
    speed: 20,
  },
  geometry: {
    shape: 'rect',
    width: Screen.percent(1).w,
    height: Screen.percent(20).h,
    style: {
      fill: {
        color: 'white',
        opacity: 0.7,
      },
      stroke: {
        color: 'white',
      },
    },
  },
  physics: {
    bounce: 0,
  },
};
