# ts-game-engine

A small, dependency-free 2D game engine written in TypeScript that renders to an HTML `<canvas>`. Games are built from **views** (renderable entities) that get behaviour from composable **components** (physics, collisions, bounce, damage, input…). Everything talks over browser events dispatched on `window`.

The repo has the engine (`src/core`) and a demo app (`src/demo`) with three scenes, including a two-player paddle game.

> Status: early prototype (`v0.0.1`). The API isn't stable and has known bugs (see [Known issues](#known-issues)).

---

## Quick start

```bash
npm install
npm run dev        # start the Vite dev server, then open the printed URL
```

Once the page loads it is blank. Press a number key to load a scene:

| Key | Scene              | What it shows                                                                                               |
| --- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `1` | `TEST`             | A circular player (WASD) and one enemy, with wall bounce, collision bounce, damage and health-based opacity |
| `2` | `BREAK_THE_ENGINE` | Stress test: one player and 500 enemies, all bouncing and colliding                                         |
| `3` | `PONG`             | Two-player paddle game. Left paddle `W`/`S`, right paddle `↑`/`↓`                                           |
| `0` | —                  | Unload all scenes and tear the game down                                                                    |

Every scene also gets an FPS counter (top left) and a pause button (top right).

### Scripts

| Command                           | Description                                         |
| --------------------------------- | --------------------------------------------------- |
| `npm run dev`                     | Vite dev server with TypeScript and ESLint checking |
| `npm run build`                   | Type-check (`tsc`) and production build             |
| `npm run preview`                 | Serve the production build                          |
| `npm test`                        | Run Vitest tests                                    |
| `npm run lint` / `lint:fix`       | ESLint over `src/`                                  |
| `npm run format` / `format:check` | Prettier                                            |
| `npm run check` / `fix`           | Lint and format check (or fix) together             |

---

## How it works

### Startup

```
index.html (#app) → src/main.ts → demoGame()
   ├─ registers scenes with the SceneManager
   └─ binds number-key shortcuts
         └─ on keypress: createGame() → sceneManager.loadScene(name)
```

`createGame()` ([src/core/game/game.ts](src/core/game/game.ts)) creates the full-window canvas inside `#app`, binds mouse and keyboard listeners, and starts the game loop.

### The game loop

[src/core/loop/loop.ts](src/core/loop/loop.ts) runs on `requestAnimationFrame`. Each frame it dispatches `CustomEvent`s on `window`, each with `detail.deltaTime` (ms since the last frame):

| Event        | When                                                           | Purpose                                       |
| ------------ | -------------------------------------------------------------- | --------------------------------------------- |
| `update`     | every frame, unless logic is paused or `timeScale` is 0        | Game logic: input, physics, movement          |
| `collisions` | same as `update`                                               | Tells the collision manager to run its checks |
| `render`     | every frame while `timeScale > 0`, after the canvas is cleared | Each view draws itself                        |
| `animate`    | right after `render`                                           | Per-frame visual updates (FPS text, etc.)     |

The loop also works out FPS once per second and stores it in game state. Pausing logic (`isLogicPaused`) and stopping time (`timeScale = 0`) are separate switches. `targetFPS` is currently `-1`, so frames are not capped.

### Events

[src/core/events/events.ts](src/core/events/events.ts): `createEvents()` returns a small registry (`addEvent`, `removeEvent`, `cleanup`). Under the hood it uses `window.addEventListener`, so any part of the engine can reach any listener by event name. Every instance is tracked in a global set so `cleanupEventListeners()` can remove all of them at teardown.

Per-view events use the view's id in the name, for example `${view.id}-collide`.

### Views

A **view** ([src/core/view/view.ts](src/core/view/view.ts)) is the basic game object. `createView(props)` deep-merges `props` over `defaultViewConfig` ([src/core/config.ts](src/core/config.ts)) and returns an instance containing:

- **Data:** `id`, `layer`, `scale`, `imageUrl`, plus these groups:
  - `model`: game data (`health`, `maxHealth`, `speed`, `maxSpeed`, `collisionDamage`, or any custom key such as `score`)
  - `geometry`: `x`, `y`, `width`, `height`, `shape` (`rect` | `roundRect` | `circle` | `line` | `image`) and `style` (fill, stroke, radii)
  - `text`: text, font settings, `align` / `verticalAlign` (`left|top`, `center`, `center-within`), offset and style
  - `physics`: `speed`, `dampening` (drag), `bounce`
- **Mutators:** `updatePosition` (keeps the view on screen), `updateSize`, `updateScale`, `updateGeometryStyle`, `updateText`, `updateTextStyle`, `updateFontSize`, `updateTextOffset`, `updateTextSize`
- **Component registry:** `addComponent`, `getComponent<T>`, `hasComponent`, `removeComponent`, `getAllComponents`
- **Lifecycle:** `events` (the view's own event registry), `update`, `destroy`

On creation a view subscribes to `render` to draw itself (image, then shape, then text). It also fires a `viewAdded` event, which [gameState](src/core/gameState/gameState.ts) uses to file the view under its layer.

Images: `imageUrl` accepts regular URLs, data URLs and `.svg` files. For SVGs, `currentColor` is replaced with the view's fill and stroke colours, and changing the style reloads the image so it can be recoloured ([src/core/view/loadImage.ts](src/core/view/loadImage.ts)).

#### Preset views

| Factory                                                           | Description                                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [`createEntityView`](src/core/view/entity/entityView.ts)          | A view with the `animations`, `physics` and `collisions` components already added                |
| [`createPlayerView`](src/core/view/entity/playerView.ts)          | An entity on the `PLAYER` layer with keyboard movement (WASD by default; keys can be changed)    |
| [`createEnemyView`](src/core/view/entity/enemyView.ts)            | An entity on the `ENEMY` layer that starts moving in a random direction and keeps moving forward |
| [`createWorldBoundsView`](src/core/view/world/worldBoundsView.ts) | Four invisible collidable walls around the screen                                                |
| [`createFpsView`](src/core/loop/fpsView.ts)                       | FPS readout (added automatically to every scene)                                                 |
| [`createPauseButton`](src/core/view/pauseButton.ts)               | Pause/resume button (added automatically to every scene)                                         |
| [`gridView`](src/core/view/debug/gridView.ts)                     | Debug grid of lines on the `BACKGROUND` layer                                                    |

### Components

Components are functions with the signature `addX(view, options?)`. They attach behaviour by subscribing to the view's events and return an object (often empty) that is stored in the view's component registry:

```ts
const player = createPlayerView({ model: { speed: 50 } });
player.addComponent('wallBounce', addWallBounce(player));
player.addComponent('collisionBounce', addCollisionBounce(player));
player.addComponent('collisionDamage', addCollisionDamage(player));
```

| Component                                                                           | Depends on   | Behaviour                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`addAnimations`](src/core/view/components/addAnimations.ts)                        | —            | Calls `view.update()` on `animate`; `addAnimationEvent(cb)`                                                                                                                                                                               |
| [`addPhysics`](src/core/view/components/addPhysics.ts)                              | —            | Wraps [`createPhysics`](src/core/physics.ts). On `update` it applies drag, caps force at `maxSpeed`, then moves the view by the current force. Exposes `applyForce` (eases toward a target force), `setForce`, `getCurrentForce`, `reset` |
| [`addCollisions`](src/core/view/components/addCollisions.ts)                        | —            | Listens for `${id}-collide` from the collision manager and passes it to callbacks registered with `addCollisionEvent(cb)`                                                                                                                 |
| [`addPlayerInput`](src/core/view/components/input/addPlayerInput.ts)                | `physics`    | Turns held keys into a force each `update`                                                                                                                                                                                                |
| [`addInputHandlers`](src/core/view/components/input/addInputHandlers.ts)            | —            | Map of click / hover / key handlers (used by the pause button)                                                                                                                                                                            |
| [`addForwardMovement`](src/core/view/components/movement/alwaysMoveForward.ts)      | `physics`    | Random starting push, then keeps accelerating along its current direction                                                                                                                                                                 |
| [`addWallBounce`](src/core/view/components/movement/addWallBounce.ts)               | `physics`    | Reverses force at the screen edges                                                                                                                                                                                                        |
| [`addCollisionBounce`](src/core/view/components/movement/addCollisionBounce.ts)     | `collisions` | Pushes away along the collision normal. Options: `forceMultiplier` and `viewIds` (only bounce off these views)                                                                                                                            |
| [`addCollisionDamage`](src/core/view/components/events/addCollisionDamage.ts)       | —            | On collision, subtracts the other view's `model.collisionDamage` from `health` (a negative value heals)                                                                                                                                   |
| [`addHealthOpacityStyle`](src/core/view/components/styles/addHealthOpacityStyle.ts) | —            | Fill opacity follows `health / maxHealth`                                                                                                                                                                                                 |

Components that depend on `physics` or `collisions` must be added after those components.

### Collisions

- **Layers** ([src/core/gameState/collisionLayers.ts](src/core/gameState/collisionLayers.ts)): `BACKGROUND`, `DEFAULT`, `PLAYER`, `ENEMY`, `UI`. `COLLISION_MATRIX` lists which layers each layer collides with; change it with `setCollisionLayers({...})`. Layers with no entries (by default `BACKGROUND` and `UI`) are skipped completely.
- **Manager** ([src/core/gameState/collisionManager.ts](src/core/gameState/collisionManager.ts)): each scene creates one. On every `collisions` event it tests each collidable view against the views on the layers it collides with, using axis-aligned bounding boxes ([src/core/view/collision.ts](src/core/view/collision.ts)). The collision normal comes from the side with the smallest overlap.
- **Enter-only:** a collision is recorded when two views first overlap, and `${view1.id}-collide` fires once, carrying a `Collision` (`view1`, `view2`, `contactPoint`, `normal`, `deltaTime`). The record is removed once they stop overlapping. There is no "stay" or "exit" event yet.

### Input

- **Keyboard** ([src/core/input/keyboard.ts](src/core/input/keyboard.ts)) keeps track of which keys are held. Gameplay code checks it with `isKeyHeld(key)` or `getHeldKeys()`.
- **Mouse/touch** ([src/core/input/mouse.ts](src/core/input/mouse.ts), [targeting.ts](src/core/input/targeting.ts)) find the view under the pointer by bounding box and call that view's `handlers` for `click`, `mouseover`, `mouseout`, `mousemove`, `touchstart` and `touchend`.
- **Shortcuts** ([src/core/input/keyboardShortcuts.ts](src/core/input/keyboardShortcuts.ts)) map a key to a callback across the whole app (the demo uses them for scene selection).

### Scenes

- [`createScene(name)`](src/core/scene/scene.ts) sets up a scene's events and collision manager, and adds the FPS view and pause button. Its `destroy()` clears all views and resets game state.
- A scene is a factory function that calls `createScene`, creates its views and returns the scene.
- The [`SceneManager`](src/core/scene/sceneManager.ts) is a singleton (`getSceneManager()`) with `addScene`, `loadScene`, `unloadScene` and `unloadAllScenes`.

### Game state

[src/core/gameState/gameState.ts](src/core/gameState/gameState.ts) is a module-level singleton holding `views` (grouped by layer), `score`, `fps`, `isLogicPaused` and `timeScale`, with helpers such as `getAllViews`, `getViewsOnLayer`, `getCollisionLayerViews`, `setLogicPaused` and `setTimeScale`.

### Models

[`createModel(obj)`](src/core/model/model.ts) adds an `id` and a `createdAt` date to a plain object. It is meant to become the base layer for saving game data (see the notes in that file). It is used for game state today and is the only part of the engine with unit tests.

### Utilities

- [`Screen`](src/core/units.ts): window size, center point, and `Screen.percent(n)` for sizes relative to the viewport. Most layout in the engine uses it.
- [`deepMerge`](src/core/utils/deepMerge.ts) and the `DeepPartial` type ([src/core/types.ts](src/core/types.ts)) support the "override only what you need" props pattern.

---

## Writing a scene

```ts
import { createScene } from './core/scene/scene';
import { getSceneManager } from './core/scene/sceneManager';
import { createGame } from './core/game/game';
import { createPlayerView } from './core/view/entity/playerView';
import { createEnemyView } from './core/view/entity/enemyView';
import {
  addWallBounce,
  addCollisionBounce,
} from './core/view/components/movement';
import { addCollisionDamage } from './core/view/components/events/addCollisionDamage';
import type { CollisionComponent } from './core/view/components';

const myScene = () => {
  const scene = createScene('my-scene');

  const player = createPlayerView(
    { model: { speed: 40 }, geometry: { shape: 'circle' } },
    { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' }
  );
  player.addComponent('wallBounce', addWallBounce(player));
  player.addComponent('collisionBounce', addCollisionBounce(player));
  player.addComponent('collisionDamage', addCollisionDamage(player));

  const enemy = createEnemyView({ model: { collisionDamage: 25 } });
  enemy.addComponent('wallBounce', addWallBounce(enemy));

  player
    .getComponent<CollisionComponent>('collisions')
    ?.addCollisionEvent(e => console.log('hit', e.detail.collision.view2.id));

  return scene;
};

getSceneManager().addScene('MY_SCENE', myScene);
createGame();
getSceneManager().loadScene('MY_SCENE');
```

---

## Project layout

```
src/
├── main.ts                 # entry point → demoGame()
├── style.css
├── core/                   # the engine
│   ├── canvas/             # canvas creation, global CANVAS / CTX
│   ├── config.ts           # defaultViewConfig
│   ├── events/             # createEvents, event name constants
│   ├── game/               # createGame / destroyGame
│   ├── gameState/          # global state, collision layers & manager
│   ├── input/              # keyboard, mouse/touch, targeting, shortcuts
│   ├── loop/               # rAF game loop, FPS view
│   ├── model/              # createModel (+ tests)
│   ├── physics.ts          # force / dampening integrator
│   ├── scene/              # createScene, SceneManager
│   ├── units.ts            # Screen helpers
│   ├── utils/              # deepMerge
│   └── view/               # createView, drawing, image loading, collision math
│       ├── components/     # composable behaviours
│       ├── entity/         # entity / player / enemy presets
│       ├── world/          # world bounds
│       └── debug/          # grid view
└── demo/                   # example game built on the engine
    ├── index.ts            # scene registration + number-key shortcuts
    ├── scenes/             # playerEnemy, breakTheGame (stress), pong
    ├── views/              # ball, paddle, scoreboard, paddle flash
    ├── scripts/            # startRound (WIP countdown)
    └── assets/             # bolt.svg
```

Tooling: Vite 7, TypeScript 5.8 (strict), Vitest 3, ESLint 9 (flat config), Prettier.

---

## Known issues

Found while reading the code; none have been fixed yet:

- **Teardown recursion:** `destroyGame()` calls `sceneManager.unloadAllScenes()`, which always calls `destroyGame()` again. Pressing `0`, or loading a scene while another is loaded, can therefore overflow the stack. `game.ts` and `sceneManager.ts` also import each other.
- **Scene switching order:** the demo calls `createGame()` before `loadScene()`, but `loadScene()` then runs `destroyGame()`, which stops the loop that was just created and removes a canvas.
- **Collision removal:** `unregisterCollision` uses `indexOf` on a freshly built `Collision` object. It always returns `-1`, so `splice(-1, 1)` removes the _last_ recorded collision instead of the right one.
- **Pause button input:** `createPauseButton` puts its handlers on a copy of the view. Game state holds the original view, whose `handlers` map is empty, so mouse and keyboard input never reach the button. `keyboard.ts` also looks for an `'onKeyDown'` handler key that nothing registers.
- **Pong scoring:** `givePoint()` is called with no argument and defaults to `0` points, so the score never goes up. It also looks like the wall-to-player mapping may be reversed: a ball reaching the left wall gives player 1 (the left paddle) the point.
- **`deepMerge`:** for each extra source it merges against the original `target` rather than the running result. Nested objects that are only in the target are copied by reference, so views that don't override `model`, `physics` and so on share those objects with `defaultViewConfig`.
- **Resize:** `Screen` is calculated once when the module loads. Resizing the window resizes the canvas, but positions, bounds and wall clamping still use the old size.
- `keyboardShortcuts.removeShortcut` / `cleanup` can't remove their listeners, because they store the `void` return value of `addEventListener`.
- `addForwardMovement` divides by `|force|` for each axis, which gives `NaN` when that axis is 0.
- `drawText` always draws a debug `strokeRect` around the text.
- `DeepRequired` is defined the same way as `DeepPartial`, so it doesn't make anything required.
- `ballView` adds `collisionBounce` twice under the same name. The first listener stays active, but only the second component is kept in the registry.

---

## Next steps

Suggested order:

1. **Fix the lifecycle.** Untangle `destroyGame` and the `SceneManager` (one owns teardown, the other calls it), make `loadScene` do the full create/destroy itself, and remove the circular import. This unblocks reliable scene switching.
2. **Make collisions correct, then fast.** Fix collision removal by id. Add `collisionStay` and `collisionExit` events. Support circle colliders. Replace the O(n²) check with a uniform grid or quadtree; the `BREAK_THE_ENGINE` scene is a ready-made benchmark.
3. **Fix the input pipeline.** Give views a single handler map that the mouse and keyboard dispatchers actually read, add an `interactive` flag to the `View` type, and get the pause button working.
4. **Fixed-timestep updates.** Run `update` and `collisions` on a fixed step with an accumulator and interpolate rendering, so physics doesn't depend on frame rate. Make `targetFPS` a real setting.
5. **Make the screen reactive.** Recalculate `Screen` on resize and relayout or scale views, or switch to a fixed virtual resolution with letterboxing.
6. **Engine API.** Give views and components a typed interface with `onAdd` / `onRemove` and cleanup. Make `removeComponent` unsubscribe the component's listeners. Export a public `index.ts` so games don't reach into internal paths.
7. **Tests.** Unit-test `deepMerge`, `physics`, collision math (`getOverlap`, `getMinOverlap`) and the `SceneManager`. Use a `jsdom` or `happy-dom` environment for the parts that touch the DOM.

## TODO

### Engine

- [ ] Break the `destroyGame` ↔ `unloadAllScenes` recursion and the circular import
- [ ] `unregisterCollision`: find the record by `id` instead of by object reference
- [ ] Collision stay/exit events; circle-vs-circle and circle-vs-rect checks
- [ ] Spatial partitioning (broad phase) for collisions
- [ ] Wire view `handlers` into the mouse and keyboard dispatch; fix the `'onKeyDown'` lookup
- [ ] Fix `keyboardShortcuts` listener removal
- [ ] Fix `deepMerge` (merge against the running result; clone nested objects that come only from the target)
- [ ] Fix `DeepRequired`
- [ ] Recalculate `Screen` on window resize
- [ ] Fixed-timestep loop; honour `targetFPS`
- [ ] Guard against `NaN` in `addForwardMovement`
- [ ] Remove the debug `strokeRect` in `drawText`, or put it behind a debug flag
- [ ] Global debug mode (bounding boxes, collision normals, grid) instead of the commented-out `draw('debug')`
- [ ] Z-ordering / draw order per layer
- [ ] Rotation support in `geometry` and drawing
- [ ] Sprite sheets and frame animation
- [ ] Audio
- [ ] Persistence for `createModel` (localStorage / IndexedDB) and save/load
- [ ] Gamepad input
- [ ] A public package entry point; consider publishing the engine separately from the demo

### Demo

- [ ] Pong: pass a point value to `givePoint` and check which player scores on which wall
- [ ] Pong: finish the `startRound` countdown and reset the ball after a point
- [ ] Pong: win condition and restart
- [ ] Remove the duplicate `collisionBounce` registration in `ballView`
- [ ] On-screen menu for picking a scene instead of hidden number keys
- [ ] Remove the duplicate import in `main.ts`

### Tooling

- [ ] More test coverage (see Next steps)
- [ ] CI that runs `npm run check`, `npm test` and `npm run build`
- [ ] Add a LICENSE
