// Game settings from the Settings window (gear button, OverlayScene), remembered per
// device in localStorage. Add a setting by giving it a default here and a row in
// OverlayScene.openSettings().

const STORAGE_KEY = 'swiat-siostr-settings';

const DEFAULTS = {
    // Shows the window and screen size in a corner, to tune the stage for a device.
    debug: false,
    // Parental time limit in minutes (0 = off) and when it runs out (ms timestamp, 0 = off).
    // See PlayTime below.
    timeLimit: 0,
    timeLimitEnd: 0
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

// Parental time limit: after the chosen minutes the game shows "KONIEC GRY" over
// everything (OverlayScene). The end is stored as a clock time, so reloading or restarting
// the game doesn't reset it; only choosing again in Settings does.
export const PlayTime = {
    // Minutes offered in Settings.
    OPTIONS: [5, 10, 15, 20, 25, 30],

    // Starts counting `minutes` from now; 0 turns the limit off.
    start(minutes) {
        Settings.set('timeLimit', minutes);
        Settings.set('timeLimitEnd', minutes > 0 ? Date.now() + minutes * 60000 : 0);
    },

    get minutes() {
        return Settings.get('timeLimit');
    },

    // Milliseconds left, or null when there is no limit.
    remainingMs() {
        const end = Settings.get('timeLimitEnd');
        return end ? Math.max(0, end - Date.now()) : null;
    },

    isOver() {
        return PlayTime.remainingMs() === 0;
    }
};
