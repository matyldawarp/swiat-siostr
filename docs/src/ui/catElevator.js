// Kociwinda, the cat elevator that rides between the rooms of Gabi's house. Every room
// has one at its side: a tap shows a button for each other room (an icon, no words), and
// picking one walks the character in, shuts the doors and rides there. The house's front
// door shows the same buttons. To add a room: an entry in GABI_ROOMS, its scene in main.js
// and routes.js (parent GabiHouseScene), and addCatElevator in its build().

import { PALETTE, PixelUI, S } from './pixel.js';
import { addImage, imageTexture } from '../gfx/images.js';
import { playNotes } from '../audio/sfx.js';

// Pictures: docs/assets/gfx/winda/ and the room icons in ikony64/.
export const GABI_ROOMS = [
    { scene: 'GabiKitchenScene', icon: 'ikony64/pokoj-kuchnia' },
    { scene: 'GabiCraftScene', icon: 'ikony64/pokoj-pracownia' }
];

// Set while riding, so the room at the other end opens its elevator doors on arrival.
const ARRIVING = 'gabiElevatorArriving';

// One sliding door: its picture is the narrowest door, and its middle column stretches.
const DOOR_KEY = 'winda/drzwi';
const DOOR_EDGE = 2;

function playDing(scene) {
    playNotes(scene, [{ freq: 1047, duration: 0.25 }, { freq: 1319, duration: 0.45 }], 'sine', 0.1);
}

// Row of room buttons centred on (x, y), above everything; a tap anywhere else closes it
// (and calls onCancel). `exclude` is the scene the player is in.
export function showRoomPicker(scene, x, y, { exclude, onPick, onCancel }) {
    const rooms = GABI_ROOMS.filter((room) => room.scene !== exclude);
    const size = S(40);
    const gap = S(8);
    const w = rooms.length * size + (rooms.length + 1) * gap;
    const h = size + gap * 2;
    const left = Math.round(Math.min(Math.max(x - w / 2, S(4)), scene.view.width - w - S(4)));

    const shield = scene.add.zone(scene.view.bleed.x, scene.view.bleed.y, scene.view.bleed.width, scene.view.bleed.height)
        .setOrigin(0).setDepth(199).setInteractive();
    const box = scene.add.graphics().setDepth(200);
    PixelUI.drawBox(box, left, y - h / 2, w, h, 0xfff7fb, PALETTE.buttonBorder);
    const buttons = rooms.map((room, i) => PixelUI.createIconButton(scene, left + gap + size / 2 + i * (size + gap), y, size,
        room.icon, () => {
            close();
            onPick(room);
        }).setDepth(201));
    buttons.forEach((button) => PixelUI.pulse(scene, button, 0.06));

    const close = () => {
        shield.destroy();
        box.destroy();
        buttons.forEach((button) => button.destroy());
    };
    shield.on('pointerup', () => {
        close();
        if (onCancel) {
            onCancel();
        }
    });
}

// Leaving the house's front door for a room: comes out of that room's elevator.
export function rideTo(scene, room) {
    scene.registry.set(ARRIVING, true);
    PixelUI.fadeTo(scene, room.scene);
}

// The elevator standing on the floor at x: a mint shaft with a pink cat head on top and
// sliding lavender doors. `rider` is the character's container, which walks in when a
// room is picked.
export function addCatElevator(scene, x, floorY, { rider }) {
    const w = S(46);
    const h = S(96);
    const left = Math.round(x - w / 2);
    const top = floorY - h;
    const cabin = { x: left + S(5), y: top + S(16), w: w - S(10), h: h - S(20) };

    // Shaft with the cabin and the cat head on top, standing on (x, floorY).
    const shaft = addImage(scene, x, floorY, 'winda/winda').setDepth(15);
    const r = Math.round(w / 2);

    // Doors in front of whoever rides; `open` from 0 (shut) to 1.
    const doorTexture = imageTexture(scene, DOOR_KEY);
    const doors = [0, 1].map(() => scene.add.nineslice(cabin.x, cabin.y, doorTexture, undefined, DOOR_EDGE * 2, cabin.h, DOOR_EDGE, DOOR_EDGE, 0, 0)
        .setOrigin(0).setDepth(25));
    const state = { open: 1 };
    const drawDoors = () => {
        const half = Math.round((cabin.w / 2) * (1 - state.open * 0.85));
        doors[0].setSize(half, cabin.h);
        doors[1].setSize(half, cabin.h).setX(cabin.x + cabin.w - half);
    };

    if (scene.registry.get(ARRIVING) && !scene.skipIntro) {
        scene.registry.set(ARRIVING, false);
        state.open = 0;
        scene.time.delayedCall(350, () => {
            playDing(scene);
            scene.tweens.add({ targets: state, open: 1, duration: 450, onUpdate: drawDoors });
        });
    }
    drawDoors();

    let riding = false;
    const ride = (room) => {
        riding = true;
        rider.setDepth(20);
        scene.tweens.add({
            targets: rider,
            x,
            y: floorY - S(24),
            duration: 600,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                scene.tweens.add({ targets: state, open: 0, duration: 400, onUpdate: drawDoors });
                scene.time.delayedCall(450, () => {
                    playNotes(scene, [{ freq: 523, duration: 0.15 }, { freq: 659, duration: 0.15 }, { freq: 784, duration: 0.3 }], 'triangle', 0.1);
                    scene.tweens.add({ targets: [shaft, ...doors], y: `-=${S(3)}`, duration: 90, yoyo: true, repeat: 2 });
                    scene.time.delayedCall(500, () => rideTo(scene, room));
                });
            }
        });
    };

    scene.add.zone(left, top - r, w, h + r).setOrigin(0).setDepth(16).setInteractive({ useHandCursor: true })
        .on('pointerup', () => {
            if (riding || scene.leaving) {
                return;
            }
            playDing(scene);
            showRoomPicker(scene, x - S(60), top - S(10), { exclude: scene.scene.key, onPick: ride });
        });
}
