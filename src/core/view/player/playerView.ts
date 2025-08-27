import { Screen } from '../../units';
import { handleMove, type ControlProps } from '../events/handleMove';
import { createEntityView } from './entityView';
import type { DeepPartial } from '../../types';
import type { View } from '../types';

export const createPlayerView = (
  props?: DeepPartial<View>,
  controls?: ControlProps
) => {
  const view = createEntityView({
    ...props,
    id: props?.id ?? 'player',
    layer: props?.layer ?? 'PLAYER',
    model: {
      ...props?.model,
      speed: props?.model?.speed ?? 15,
    },
    geometry: {
      ...props?.geometry,
      style: {
        ...props?.geometry?.style,
        fill: {
          ...props?.geometry?.style?.fill,
          color: props?.geometry?.style?.fill?.color ?? 'blue',
        },
        stroke: {
          ...props?.geometry?.style?.stroke,
          color: props?.geometry?.style?.stroke?.color ?? 'blue',
          opacity: props?.geometry?.style?.stroke?.opacity ?? 1,
          width: props?.geometry?.style?.stroke?.width ?? 2,
        },
      },
    },
  });

  handleMove(view, controls);

  return view;
};
