// Kociwinda, the cat elevator that rides between the rooms of Gabi's house. Every room
// has one at its side: a tap shows a button for each other room (an icon, no words), and
// picking one walks the character in, shuts the doors and rides there. The house's front
// door shows the same buttons. To add a room: an entry in GABI_ROOMS, its scene in main.js
// and routes.js (parent GabiHouseScene), and addCatElevator in its build().

import { PALETTE, PixelUI, S } from './pixel.js';
import { Icons } from '../gfx/icons.js';
import { playNotes } from '../audio/sfx.js';

export const GABI_ROOMS = [
    {
        scene: 'GabiKitchenScene',
        icon: (g, size) => Icons.cupcake(g, 0, Math.round(size * 0.42), Math.round(size * 0.8), { cream: 0xf59bd0, sprinkles: true })
    },
    {
        scene: 'GabiCraftScene',
        icon: (g, size) => Icons.palette(g, 0, 0, size)
    }
];

// Set while riding, so the room at the other end opens its elevator doors on arrival.
const ARRIVING = 'gabiElevatorArriving';

const COLORS = { frame: 0x9fe6d4, head: 0xf2a6dc, cabin: 0xd8f0ff, doors: 0xd9ccf5 };

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

    const g = scene.add.graphics().setDepth(15);
    PixelUI.drawBox(g, left, top, w, h, COLORS.frame, PALETTE.outline);
    PixelUI.drawBox(g, cabin.x, cabin.y, cabin.w, cabin.h, COLORS.cabin, PALETTE.outline);
    g.fillStyle(0xffffff, 1);
    g.fillRect(cabin.x + S(4), cabin.y + S(4), 2, cabin.h - S(8));

    // Cat head on top: ears, a round crown, eyes and a heart nose.
    const r = Math.round(w / 2);
    [-1, 1].forEach((side) => {
        const ear = [{ x: x + side * r, y: top }, { x: x + side * r * 0.85, y: top - r * 1.05 }, { x: x + side * r * 0.25, y: top - r * 0.75 }];
        g.fillStyle(PALETTE.outline, 1);
        Icons.fillPolygon(g, Icons.grow(ear, 1.5));
        g.fillStyle(COLORS.head, 1);
        Icons.fillPolygon(g, ear);
    });
    g.fillStyle(PALETTE.outline, 1);
    for (let dy = 0; dy <= r * 0.75 + 1; dy++) {
        const half = Math.round((r + 1) * Math.sqrt(Math.max(0, 1 - (dy / (r * 0.75 + 1)) ** 2)));
        g.fillRect(x - half, top + S(4) - dy, half * 2 + 1, 1);
    }
    g.fillStyle(COLORS.head, 1);
    for (let dy = 0; dy <= r * 0.75; dy++) {
        const half = Math.round(r * Math.sqrt(Math.max(0, 1 - (dy / (r * 0.75)) ** 2)));
        g.fillRect(x - half, top + S(4) - dy, half * 2 + 1, 1);
    }
    g.fillRect(left + 2, top + 2, w - 4, S(4));
    g.fillStyle(PALETTE.outline, 1);
    g.fillRect(x - S(9), top - S(6), S(3), S(3));
    g.fillRect(x + S(6), top - S(6), S(3), S(3));
    Icons.heart(g, x, top - S(1), S(7));

    // Doors in front of whoever rides; `open` from 0 (shut) to 1.
    const doors = scene.add.graphics().setDepth(25);
    const state = { open: 1 };
    const drawDoors = () => {
        doors.clear();
        const half = Math.round((cabin.w / 2) * (1 - state.open * 0.85));
        [cabin.x, cabin.x + cabin.w - half].forEach((dx) => {
            PixelUI.drawBox(doors, dx, cabin.y, half, cabin.h, COLORS.doors, PALETTE.outline);
        });
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
                    scene.tweens.add({ targets: [g, doors], y: -S(3), duration: 90, yoyo: true, repeat: 2 });
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
