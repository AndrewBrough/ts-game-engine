import { breakTheGameScene } from "../scene/breakTheGameScene";
import { createScene } from "../scene/scene";

export const devKeyboardShortcuts = () => {
    let shortcutsBound = false;

    const shortcuts: Record<string, () => void> = {
        '1': () => {
            const scene = createScene();
            scene.start();
        },
        '2': () => {
            const scene = breakTheGameScene();
            scene.start();
        },
    }

    const bindShortcuts = () => {
        for(const shortcut in shortcuts) {
            window.addEventListener('keydown', (e) => {
                if(e.key === shortcut) {
                    shortcuts[shortcut]();
                }
            });
        }
    }

    const unbindShortcuts = () => {
        for(const shortcut in shortcuts) {
            window.removeEventListener('keydown', (e) => {
                if(e.key === shortcut) {
                    shortcuts[shortcut]();
                }
            });
        }
    }

    window.addEventListener('keydown', (e) => {
        if(e.key === '0') {
            if(shortcutsBound) {
                unbindShortcuts();
                shortcutsBound = false;
            } else {
                bindShortcuts();
                shortcutsBound = true;
            }
        }
    });

    return { shortcuts, bindShortcuts, unbindShortcuts };
}