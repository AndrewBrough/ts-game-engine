import type { DeepPartial } from '../../core/types';
import { Screen } from '../../core/units';
import { deepMerge } from '../../core/utils/deepMerge';
import { addCollisionDamage } from '../../core/view/components/events/addCollisionDamage';
import type { ControlProps } from '../../core/view/components/input';
import { createPlayerView } from '../../core/view/entity/playerView';
import type { View } from '../../core/view/types';

export const playerPaddleView = (
  props: DeepPartial<View>,
  controls: ControlProps
) => {
  const mergedProps = deepMerge(basePlayerProps, props);
  const view = createPlayerView(
    {
      ...mergedProps,
    },
    {
      ...controls,
    }
  );

  return view;
};

export const basePlayerProps: DeepPartial<View> = {
  model: {
    score: 0,
    speed: 30,
    collisionDamage: -0.1, // heal the ball, ball goes faster based on health
  },
  geometry: {
    shape: 'rect',
    width: Screen.percent(1).w,
    height: Screen.percent(20).h,
    style: {
      fill: {
        color: 'white',
        opacity: 1,
      },
      stroke: {
        color: 'white',
        opacity: 0,
      },
    },
  },
  physics: {
    bounce: 0,
  },
};
