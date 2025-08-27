import type { ViewInstance } from '../view';
import { addAnimations } from './addAnimations';
import { addCollisionBounce } from './movement/addCollisionBounce';
import { addCollisionDamage } from './events/addCollisionDamage';
import { addCollisions } from './addCollisions';
import { addPhysics } from './addPhysics';
import { addWallBounce } from './movement/addWallBounce';

export const RegisteredComponents = {
  animations: addAnimations,
  physics: addPhysics,
  collisions: addCollisions,
  wallBounce: addWallBounce,
  collisionBounce: addCollisionBounce,
} as const;

export type ComponentName = keyof typeof RegisteredComponents;

export type Component = {
  [key: string]: any;
};

export type ComponentRegistry = Record<string, Component>;

export const addComponents = () => {
  const components: ComponentRegistry = {};

  const addComponent = (name: string, component: Component) => {
    components[name] = component;
    return component;
  };

  const getComponent = <T extends Component>(name: string): T | undefined => {
    return components[name] as T;
  };

  const hasComponent = (name: string): boolean => {
    return name in components;
  };

  const removeComponent = (name: string) => {
    delete components[name];
  };

  const getAllComponents = (): ComponentRegistry => {
    return { ...components };
  };

  return {
    addComponent,
    getComponent,
    hasComponent,
    removeComponent,
    getAllComponents,
  };
};
