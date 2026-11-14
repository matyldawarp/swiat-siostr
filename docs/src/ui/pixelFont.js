// The game's text font: Leggie, a bitmap font with Polish letters (by Wiktor Kerr, CC BY
// 4.0; assets/fonts/leggie, made into docs/assets/fonts by tools/make-pixel-font.mjs). It
// comes in 12, 18 and 24 px, regular and bold, and is only ever enlarged by whole numbers,
// so its pixels are as even as the rest of the pixel art. For every text style (size,
// weight, colour, outline, shadow) a Phaser bitmap font is built from the white glyph cells
// the first time the style is used, drawn pixel for pixel, and kept for the whole game.
// PixelUI.addText shows text through it as BitmapText.

const SIZES = [24, 18, 12];

let fonts = null;

// Loads the glyph images and their description; the game starts once this is done (main.js).
export function loadPixelFonts() {
    return fetch('assets/fonts/leggie.json')
        .then((response) => response.json())
        .then((description) => Promise.all(Object.entries(description.fonts).map(([name, font]) => {
            const image = new Image();
            image.src = font.image;
            return image.decode().then(() => [name, { ...font, image }]);
        })).then((entries) => {
            fonts = { columns: description.columns, chars: description.chars, byName: Object.fromEntries(entries) };
        }));
}

// The Leggie size and whole-number enlargement closest to `px` game pixels of line height,
// preferring the larger size (more detail) when two are as close.
function pickSize(px) {
    let best = null;
    SIZES.forEach((size) => {
        const times = Math.max(1, Math.round(px / size));
        const off = Math.abs(size * times - px);
        if (!best || off < best.off) {
            best = { size, times, off };
        }
    });
    return best;
}

function styleKey(style) {
    const shadow = style.shadow ? [style.shadow.offsetX, style.shadow.offsetY, style.shadow.color, style.shadow.fill, style.shadow.stroke].join(',') : '';
    return ['pixelfont', style.fontSize, style.fontStyle || '', style.color, style.stroke || '', style.strokeThickness || 0, shadow].join('|');
}

// A canvas the size of `source` with its ink in `color`.
function tinted(source, color) {
    const canvas = document.createElement('canvas');
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(source, 0, 0);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
}

// The key of the bitmap font for a Text-like style ({ fontSize, fontStyle, color, stroke,
// strokeThickness, shadow }), building the font if it doesn't exist yet.
export function pixelFont(scene, style) {
    const key = styleKey(style);
    if (scene.cache.bitmapFont.exists(key)) {
        return key;
    }
    const { size, times } = pickSize(parseFloat(style.fontSize));
    const bold = style.fontStyle === '700' || style.fontStyle === 'bold';
    const font = fonts.byName[`leggie-${size}${bold ? 'b' : ''}`];
    const cellW = font.cellW * times;
    const cellH = font.cellH * times;
    const outline = style.strokeThickness ? Math.max(1, Math.round(style.strokeThickness / 2)) : 0;
    const shadow = style.shadow || null;
    const sx = shadow ? Math.max(0, shadow.offsetX) : 0;
    const sy = shadow ? Math.max(0, shadow.offsetY) : 0;
    // Room around each glyph for its outline and shadow, and a gap so nothing leaks across.
    const pad = outline + 1;
    const boxW = cellW + pad * 2 + sx;
    const boxH = cellH + pad * 2 + sy;
    const chars = [...fonts.chars];
    const perRow = Math.max(1, Math.floor(1024 / boxW));
    const width = perRow * boxW;
    const height = Math.ceil(chars.length / perRow) * boxH;

    // The glyphs' ink, enlarged by whole numbers, each in its own box.
    const mask = document.createElement('canvas');
    mask.width = width;
    mask.height = height;
    const maskCtx = mask.getContext('2d');
    maskCtx.imageSmoothingEnabled = false;
    chars.forEach((ch, i) => {
        const fx = (i % fonts.columns) * font.cellW;
        const fy = Math.floor(i / fonts.columns) * font.cellH;
        const bx = (i % perRow) * boxW + pad;
        const by = Math.floor(i / perRow) * boxH + pad;
        maskCtx.drawImage(font.image, fx, fy, font.cellW, font.cellH, bx, by, cellW, cellH);
    });

    // The outline: the ink spread by `outline` pixels in a round brush.
    let shape = mask;
    if (outline) {
        shape = document.createElement('canvas');
        shape.width = width;
        shape.height = height;
        const shapeCtx = shape.getContext('2d');
        for (let dy = -outline; dy <= outline; dy++) {
            for (let dx = -outline; dx <= outline; dx++) {
                if (dx * dx + dy * dy <= outline * outline + outline) {
                    shapeCtx.drawImage(mask, dx, dy);
                }
            }
        }
    }

    // Drawn like Phaser's Text: shadow, outline, fill.
    const texture = scene.textures.createCanvas(key, width, height);
    const ctx = texture.getContext();
    if (shadow && (shadow.fill || shadow.stroke)) {
        ctx.drawImage(tinted(shadow.stroke && outline ? shape : mask, shadow.color), shadow.offsetX, shadow.offsetY);
    }
    if (outline) {
        ctx.drawImage(tinted(shape, style.stroke), 0, 0);
    }
    ctx.drawImage(tinted(mask, style.color), 0, 0);
    texture.refresh();

    // Described as a BMFont file, which Phaser knows how to read. Leggie is monospaced.
    const xml = `<font><info face="${key}" size="${cellH}"/><common lineHeight="${cellH}"/><chars>${chars
        .map((ch, i) => `<char id="${ch.codePointAt(0)}" x="${(i % perRow) * boxW}" y="${Math.floor(i / perRow) * boxH}" width="${boxW}" height="${boxH}" xoffset="${-pad}" yoffset="${-pad}" xadvance="${cellW}"/>`)
        .join('')}</chars></font>`;
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    const data = Phaser.GameObjects.BitmapText.ParseXMLBitmapFont(doc, texture.get(), 0, 0);
    scene.cache.bitmapFont.add(key, { data, texture: key, frame: null });
    return key;
}

// The size BitmapText needs to show a font at its own size (no scaling).
export function pixelFontSize(scene, key) {
    return scene.cache.bitmapFont.get(key).data.size;
}

const reportedMissing = new Set();

// Reports letters a text uses that the font doesn't have.
export function checkChars(text) {
    [...String(text)].forEach((ch) => {
        if (ch !== '\n' && fonts && !fonts.chars.includes(ch) && !reportedMissing.has(ch)) {
            reportedMissing.add(ch);
            console.warn(`Czcionka Leggie nie ma litery „${ch}”`);
        }
    });
}
