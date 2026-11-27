import type { DeepPartial } from '../../core/types';
import { Screen } from '../../core/units';
import { deepMerge } from '../../core/utils/deepMerge';
import { addLayout } from '../../core/view/components/addLayout';
import type { ControlProps } from '../../core/view/components/input';
import { createPlayerView } from '../../core/view/entity/playerView';
import type { View } from '../../core/view/types';
import type { ViewInstance } from '../../core/view/view';
import { addPaddleFlash } from './components/addPaddleFlash';

const EDGE_MARGIN = 20;

/**
 * Keeps the paddle on its side of the screen and sized to it. The player
 * controls y, so on resize it keeps its relative height (a paddle halfway
 * down stays halfway down) instead of being reset.
 */
const paddleLayout = (view: ViewInstance, side: PaddleSide) => {
  let lastScreenH = Screen.h;

  return () => {
    const width = Screen.percent(1).w;
    const height = Screen.percent(20).h;
    const centerRatio =
      (view.geometry.y + view.geometry.height / 2) / lastScreenH;
    lastScreenH = Screen.h;

    return {
      width,
      height,
      x: side === 'left' ? EDGE_MARGIN : Screen.w - width - EDGE_MARGIN,
      y: Math.max(
        0,
        Math.min(Screen.h - height, centerRatio * Screen.h - height / 2)
      ),
    };
  };
};

export type PaddleSide = 'left' | 'right';

export const playerPaddleView = (
  props: DeepPartial<View>,
  controls: ControlProps,
  side: PaddleSide
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
  view.addComponent('layout', addLayout(view, paddleLayout(view, side)));

  const givePoint = (points: number = 0) => {
    view.model.score += points;
  };

  const flashPaddle = () => {
    if (!view.hasComponent('flashPaddle')) {
      view.addComponent('flashPaddle', addPaddleFlash(view));
    } else {
      view.getComponent('flashPaddle')?.play();
    }
  };

  return { ...view, givePoint, flashPaddle };
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
