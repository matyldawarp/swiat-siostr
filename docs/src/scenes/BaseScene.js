import { PixelUI } from '../ui/pixel.js';
import { getCharacter } from '../data/characters.js';

// Base for every scene. A scene implements build({ width, height }) instead of create():
// BaseScene first sets up the pixel camera (PixelUI.setupView), then calls build with the
// stage size in game pixels (always STAGE, also kept as this.view), then fades in and
// rebuilds on resize. A scene that sets this.fillsWindow = true in its constructor gets
// the whole window instead of the stage (only OverlayScene does).
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
        this.build(this.view);
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

    // The character chosen on the character screen.
    selectedCharacter() {
        return getCharacter(this.registry.get('selectedCharacter'));
    }
}
