import type { DeepPartial } from '../../core/types';
import { Screen } from '../../core/units';
import { deepMerge } from '../../core/utils/deepMerge';
import { addCollisionDamage } from '../../core/view/components/events/addCollisionDamage';
import type { ControlProps } from '../../core/view/components/input';
import { createPlayerView } from '../../core/view/entity/playerView';
import type { View } from '../../core/view/types';
import { addPaddleFlash } from './components/addPaddleFlash';

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

  const givePoint = (points: number = 0) => {
    view.model.score += points;

    if (!view.hasComponent('flashPaddle')) {
      view.addComponent('flashPaddle', addPaddleFlash(view));
    } else {
      view.getComponent('flashPaddle')?.play();
    }
  };

  return { ...view, givePoint };
};

export const basePlayerProps: DeepPartial<View> = {
  model: {
    score: 0,
    speed: 20,
    collisionDamage: -1, // heal the ball, ball goes faster based on health
  },
  geometry: {
    shape: 'rect',
    width: Screen.percent(1).w,
    height: Screen.percent(20).h,
    y: Screen.percent(50).h - Screen.percent(20).h / 2,
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
