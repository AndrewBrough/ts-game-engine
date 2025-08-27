import { getSceneManager } from '../scene/sceneManager';

export const devKeyboardShortcuts = () => {
  const shortcuts: Record<string, () => void> = {
    '1': () => {
      getSceneManager().loadScene('TEST');
    },
    '2': () => {
      getSceneManager().loadScene('BREAK_THE_ENGINE');
    },
    '0': () => {
      getSceneManager().unloadAllScenes();
    },
    '3': () => {
      getSceneManager().loadScene('PONG');
    },
  };

  const bindShortcuts = () => {
    for (const shortcut in shortcuts) {
      window.addEventListener('keydown', e => {
        if (e.key === shortcut) {
          shortcuts[shortcut]();
        }
      });
    }
  };

  const unbindShortcuts = () => {
    for (const shortcut in shortcuts) {
      window.removeEventListener('keydown', e => {
        if (e.key === shortcut) {
          shortcuts[shortcut]();
        }
      });
    }
  };

  bindShortcuts();

  return { shortcuts, bindShortcuts, unbindShortcuts };
};
