// Sweets eaten since the last visit to the dentist (cupcakes in the bakery, cakes in the
// kitchen), kept in the registry for this play session. The dentist finds a crumb more on
// the teeth for each of them, up to a limit, and the count starts again after a check-up.

const KEY = 'sweetsEaten';

export const Sweets = {
    add(scene) {
        scene.registry.set(KEY, Sweets.count(scene) + 1);
    },

    count(scene) {
        return scene.registry.get(KEY) || 0;
    },

    reset(scene) {
        scene.registry.set(KEY, 0);
    }
};
