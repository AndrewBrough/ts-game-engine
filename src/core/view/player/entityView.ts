import { createModel } from '../../model/model';
import type { DeepPartial } from '../../types';
import { createInteractiveView } from '../interactiveView';
import type { InteractiveView } from '../types';

export type EntityModel = {
  health: number;
  speed: number;
};

export type EntityViewInstance = ReturnType<typeof createEntityView>;

export const createEntityView = (
  props: DeepPartial<InteractiveView> = {},
  entityProps: DeepPartial<EntityModel> = {}
) => {
  const entity = createModel<EntityModel>({
    health: 100,
    speed: 0.5,
    ...entityProps,
  });

  const view = createInteractiveView(props);

  return {
    entity,
    view,
  };
};
