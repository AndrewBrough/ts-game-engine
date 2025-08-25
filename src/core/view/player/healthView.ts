import type { DeepPartial } from '../../types';
import { createAnimatedView } from '../animatedView';
import type { InteractiveView } from '../types';

export const createHealthView = (props: DeepPartial<InteractiveView>) => {
  const view = createAnimatedView({
    ...props,
    layer: 'UI',
    fill: {
      color: 'white',
      opacity: 1,
    },
    stroke: {
      color: 'transparent',
      opacity: 0,
      width: 0,
    },
    textProps: {
      ...props.textProps,
      text: props.model?.health,
    },
    geometry: {
      ...props.geometry,
      shape: 'text',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  });

  return view;
};
