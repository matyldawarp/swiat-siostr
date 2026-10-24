// Every screen has its own address after # (e.g. #kuchnia, #kolorowanki/looney-tunes), so
// reloading the page comes back to the same screen. BaseScene writes it when a scene opens
// (scene.route()), and main.js starts the game on the screen the address names.

// Scene key -> its name in the address. Every scene in main.js except OverlayScene has one.
export const SCENE_ROUTES = {
    StartScene: 'start',
    CharacterScene: 'postacie',
    TerrariumScene: 'terrarium',
    MapScene: 'mapa',
    HospitalScene: 'szpital',
    KitchenScene: 'kuchnia',
    BakeryScene: 'cukiernia',
    DentistScene: 'dentysta',
    ColoringScene: 'kolorowanki'
};

// Shows a route ('kuchnia', 'kolorowanki/looney-tunes') in the address bar, without adding
// a step to the browser's history.
export function setRoute(route) {
    const hash = `#${route}`;
    if (window.location.hash !== hash) {
        window.history.replaceState(null, '', hash);
    }
}

// The scene key and the extra part (e.g. a coloring page id) the address names, or null.
export function routeFromAddress() {
    const [name, detail] = decodeURIComponent(window.location.hash.slice(1)).split('/');
    const scene = Object.keys(SCENE_ROUTES).find((key) => SCENE_ROUTES[key] === name);
    return scene ? { scene, detail: detail || null } : null;
}
