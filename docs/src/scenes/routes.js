// Every screen has its own address after # (e.g. #kuchnia, #kolorowanki/wednesday), so
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

// Scene key -> the screen one level up (the screen tree in README.md), where the back
// button in the top-left corner leads. The start screen has none. A coloring page's
// parent is its group's shelf, and that one's the shelf of groups, in the same scene
// (ColoringScene.goBack).
export const SCENE_PARENTS = {
    CharacterScene: 'StartScene',
    TerrariumScene: 'CharacterScene',
    KitchenScene: 'TerrariumScene',
    MapScene: 'TerrariumScene',
    HospitalScene: 'MapScene',
    BakeryScene: 'MapScene',
    DentistScene: 'MapScene',
    ColoringScene: 'MapScene'
};

// Shows a route ('kuchnia', 'kolorowanki/wednesday') in the address bar, without adding
// a step to the browser's history.
export function setRoute(route) {
    const hash = `#${route}`;
    if (window.location.hash !== hash) {
        window.history.replaceState(null, '', hash);
    }
}

// The scene key and the extra parts (e.g. a coloring group and page id) the address names,
// or null.
export function routeFromAddress() {
    const [name, ...details] = decodeURIComponent(window.location.hash.slice(1)).split('/');
    const scene = Object.keys(SCENE_ROUTES).find((key) => SCENE_ROUTES[key] === name);
    return scene ? { scene, details } : null;
}
