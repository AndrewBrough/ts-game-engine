import type { Nullable } from "vitest";
import { createFpsView } from "../loop/fpsView";
import { addViewInstance, removeViewInstance } from "../renderer/renderer";
import { getSceneManager } from "../scene/sceneManager";
import type { ViewInstance } from "../view/view";

export const devKeyboardShortcuts = () => {
    let fpsView: Nullable<ViewInstance> = null;

    const shortcuts: Record<string, () => void> = {
        '1': () => {
            const scene = getSceneManager().loadScene('TEST');
            scene.start();
        },
        '2': () => {
            const scene = getSceneManager().loadScene('BREAK_THE_ENGINE');
            scene.start();
        },
        'o': () => {
            if(fpsView !== null) {
                removeViewInstance(fpsView);
                fpsView = null;
            } else {
                fpsView = createFpsView();
                addViewInstance(fpsView);
            }
        },
    }

    const bindShortcuts = () => {
        // console.log('Binding dev shortcuts - use 1 or 2 to load scenes');
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

    bindShortcuts();

    return { shortcuts, bindShortcuts, unbindShortcuts };
}