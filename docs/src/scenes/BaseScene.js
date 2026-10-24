import { PixelUI, RENDER_SCALE, S, SAFE_AREA } from '../ui/pixel.js';
import { Icons } from '../gfx/icons.js';
import { getCharacter } from '../data/characters.js';
import { SCENE_PARENTS, SCENE_ROUTES, setRoute } from './routes.js';

// Base for every scene. A scene implements build({ width, height }) instead of create():
// BaseScene first sets up the pixel camera (PixelUI.setupView), then calls build with the
// stage size in game pixels (always STAGE, also kept as this.view), then fades in and
// rebuilds on resize. A scene that sets this.fillsWindow = true in its constructor gets
// the whole window instead of the stage (only OverlayScene does). It also puts the
// scene's address after # in the address bar (route(), names in routes.js).
//
// Every screen but the start screen gets a back button in the top-left corner (and Esc),
// leading one level up the screen tree (SCENE_PARENTS in routes.js). It is made before
// build(), so build can already point at this.backButton (e.g. pulse it as a hint).
//
// A scene that needs init(data) must call super.init(data) first.
export class BaseScene extends Phaser.Scene {
    init(data = {}) {
        // Set by PixelUI.fadeTo while the scene fades out, so taps can't start a second exit.
        this.leaving = false;
        // Restarted after a window resize: show the scene at once, without intro animations.
        this.skipIntro = Boolean(data.resized);
    }

    create() {
        // The stage is a fixed size (STAGE in ui/pixel.js), centred in the window.
        this.view = PixelUI.setupView(this, { stage: !this.fillsWindow });
        this.backButton = SCENE_PARENTS[this.scene.key] ? this.createBackButton() : null;
        if (this.backButton) {
            this.input.keyboard.on('keydown-ESC', () => this.goBack());
        }
        this.build(this.view);
        const route = this.route();
        if (route) {
            setRoute(route);
        }
        if (!this.skipIntro) {
            this.intro();
        }
        PixelUI.restartOnResize(this);
    }

    // Lays out the scene; the size changes with the window, so position things relative to it.
    build() {}

    // Runs on a real arrival, not after a resize. Override for a different entrance.
    intro() {
        PixelUI.fadeIn(this);
    }

    // This screen's address after #; override to add detail (ColoringScene adds the page).
    route() {
        return SCENE_ROUTES[this.scene.key] || null;
    }

    // The back button's way one level up. Override to do more on the way (e.g. remember
    // where the hamster stands on the map).
    goBack() {
        PixelUI.fadeTo(this, SCENE_PARENTS[this.scene.key]);
    }

    // In the window's top-left corner, the same size and distance from the edges as the
    // buttons in the top-right corner (OverlayScene), below the iPad's status bar.
    createBackButton() {
        const size = S(22);
        const margin = S(6);
        const toGame = (css) => Math.ceil((css * (window.devicePixelRatio || 1)) / RENDER_SCALE);
        // bleed is the window, reaching one pixel past it on every side.
        const left = this.view.bleed.x + 1 + margin;
        const top = this.view.bleed.y + 1 + margin + toGame(SAFE_AREA.top);
        return PixelUI.createIconButton(this, left + size / 2, top + size / 2, size,
            (g, iconSize) => Icons.back(g, 0, 0, iconSize), () => this.goBack()).setDepth(1000);
    }

    // The character chosen on the character screen.
    selectedCharacter() {
        return getCharacter(this.registry.get('selectedCharacter'));
    }
}
