// Game settings from the Settings window (gear button, OverlayScene), remembered per
// device in localStorage. Add a setting by giving it a default here and a row in
// OverlayScene.openSettings().

const STORAGE_KEY = 'swiat-siostr-settings';

const DEFAULTS = {
    // Shows the window and screen size in a corner, to tune the stage for a device.
    debug: false
};

let values = null;

function load() {
    if (!values) {
        try {
            values = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
        } catch {
            // Storage blocked or broken: defaults, for this visit only.
            values = { ...DEFAULTS };
        }
    }
    return values;
}

export const Settings = {
    get(key) {
        return load()[key];
    },

    set(key, value) {
        load()[key] = value;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        } catch {
            // Storage blocked: the setting lasts until the page is closed.
        }
    }
};
