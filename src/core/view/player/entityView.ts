import { createModel } from '../../model/model';
import type { DeepPartial } from '../../types';
import { createInteractiveView } from '../interactiveView';
import type { EntityModel, InteractiveView } from '../types';

export type EntityViewInstance = ReturnType<typeof createEntityView>;

export const createEntityView = (props: DeepPartial<InteractiveView> = {}) => {
  const model = createModel<EntityModel>({
    health: 100,
    speed: 0.5,
    ...props.model,
  });

  const view = createInteractiveView({ ...props, model });

  return view;
};
