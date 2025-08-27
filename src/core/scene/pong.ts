import type { DeepPartial } from '../types';
import { Screen } from '../units';
import { createEnemyView } from '../view/createEnemyView';
import { createPlayerView } from '../view/player/playerView';
import type { View } from '../view/types';
import { createScene } from './scene';

const basePlayerProps: DeepPartial<View> = {
  geometry: {
    shape: 'rect',
    width: Screen.percent(1).w,
    height: Screen.percent(10).h,
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

  console.log(player.geometry, player2.geometry);

  const ball = createEnemyView();

  return scene;
};
