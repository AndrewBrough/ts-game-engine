import { getSceneManager } from '../scene/sceneManager';

export const keyboardShortcuts = () => {
  const shortcuts = new Map<string, () => void>();
  const handlers = new Map<string, void>();

  const addShortcut = (key: string, callback: () => void) => {
    shortcuts.set(key, () => {
      callback();
    });
    const handler = window.addEventListener('keydown', e => {
      if (e.key === key) {
        shortcuts.get(key)?.();
      }
    });
    handlers.set(key, handler);
  };

  const removeShortcut = (key: string) => {
    shortcuts.delete(key);
    window.removeEventListener('keydown', handlers.get(key)!);
    handlers.delete(key);
  };

  return {
    shortcuts,
    addShortcut,
    removeShortcut,
  };
};
