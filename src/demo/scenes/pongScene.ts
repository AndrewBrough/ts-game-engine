import { createScene } from '../../core/scene/scene';
import type { DeepPartial } from '../../core/types';
import { Screen } from '../../core/units';
import { createEnemyView } from '../../core/view/createEnemyView';
import { createPlayerView } from '../../core/view/player/playerView';
import type { View } from '../../core/view/types';

const basePlayerProps: DeepPartial<View> = {
  geometry: {
    shape: 'rect',
    width: Screen.percent(1).w,
    height: Screen.percent(20).h,
    style: {
      fill: {
        color: 'white',
      },
    },
  },
  physics: {
    bounce: 0,
  },
};

export const pong = () => {
  const scene = createScene('pong');

  const player = createPlayerView(
    {
      ...basePlayerProps,
      geometry: {
        ...basePlayerProps.geometry,
        x: 10,
      },
    },
    {
      up: 'w',
      down: 's',
    }
  );

  const player2 = createPlayerView(
    {
      ...basePlayerProps,
      geometry: {
        ...basePlayerProps.geometry,
        x: Screen.w - (basePlayerProps.geometry?.width ?? 0) - 10,
      },
    },
    {
      up: 'ArrowUp',
      down: 'ArrowDown',
    }
  );

  const ball = createEnemyView();

  ball.updatePosition({
    x: Screen.center.x - ball.geometry.width / 2,
    y: Screen.center.y - ball.geometry.height / 2,
  });

  return scene;
};
