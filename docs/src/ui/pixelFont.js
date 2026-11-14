// Bitmap fonts made from Handjet while the game runs, so text is pixel art like everything
// else: each glyph is drawn once in game pixels, every pixel either solid or clear (no
// smoothed, blurry edges), and shown through Phaser's BitmapText at the scene's whole-number
// zoom. One font per text style (size, weight, colour, outline, shadow), made the first
// time a style is used and kept for the whole game. PixelUI.addText uses it for FONT text.

// Every letter a text may use: ASCII, Polish and a few typographic marks. A missing letter
// is skipped and reported in the console.
const CHARS = [
    ...Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)),
    ...'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ„”“‘’–—…·•×°«»'
].join('');

// Pixels of a glyph at least this opaque (of 255) become solid, the rest clear.
const SOLID_ALPHA = 60;
// Width of the canvas the glyphs are packed into, and the empty space between their cells,
// in game pixels.
const ATLAS_WIDTH = 1024;
const CELL_GAP = 2;

const reportedMissing = new Set();

function styleKey(style) {
    const shadow = style.shadow ? [style.shadow.offsetX, style.shadow.offsetY, style.shadow.color, style.shadow.fill, style.shadow.stroke].join(',') : '';
    return ['pixelfont', style.fontSize, style.fontStyle || '', style.color, style.stroke || '', style.strokeThickness || 0, shadow].join('|');
}

// The key of the bitmap font for this Text-like style ({ fontFamily, fontStyle, fontSize,
// color, stroke, strokeThickness, shadow }), making the font if it doesn't exist yet.
export function pixelFont(scene, style) {
    const key = styleKey(style);
    if (scene.cache.bitmapFont.exists(key)) {
        return key;
    }
    const size = Math.round(parseFloat(style.fontSize));
    const font = `${style.fontStyle || ''} ${size}px ${style.fontFamily}`.trim();
    const strokeW = style.strokeThickness || 0;
    const shadow = style.shadow || null;
    const shadowX = shadow ? Math.max(0, shadow.offsetX) : 0;
    const shadowY = shadow ? Math.max(0, shadow.offsetY) : 0;
    const pad = Math.ceil(strokeW / 2) + 1;

    const measure = document.createElement('canvas').getContext('2d');
    measure.font = font;
    const metrics = measure.measureText('ĄŚMgjy|');
    const ascent = Math.ceil(metrics.fontBoundingBoxAscent ?? size * 0.8);
    const descent = Math.ceil(metrics.fontBoundingBoxDescent ?? size * 0.25);
    const lineHeight = ascent + descent;

    // Each glyph's cell holds all of its ink, which in Handjet can reach past its advance
    // and above the line (accents), with a gap to the next cell so no ink leaks across.
    const glyphs = [...CHARS].map((ch) => {
        const m = measure.measureText(ch);
        return {
            ch,
            advance: Math.round(m.width),
            left: Math.max(0, Math.ceil(m.actualBoundingBoxLeft)),
            right: Math.max(Math.ceil(m.width), Math.ceil(m.actualBoundingBoxRight)),
            above: Math.max(0, Math.ceil(m.actualBoundingBoxAscent) - ascent),
            below: Math.max(0, Math.ceil(m.actualBoundingBoxDescent) - descent)
        };
    });
    const top = Math.max(...glyphs.map((g) => g.above)) + pad;
    const cellH = top + lineHeight + Math.max(...glyphs.map((g) => g.below)) + pad + shadowY;

    // Lay the cells out in rows.
    let x = 0;
    let y = 0;
    glyphs.forEach((g) => {
        g.w = g.left + g.right + pad * 2 + shadowX;
        if (x + g.w > ATLAS_WIDTH) {
            x = 0;
            y += cellH + CELL_GAP;
        }
        g.x = x;
        g.y = y;
        x += g.w + CELL_GAP;
    });
    const height = y + cellH;

    const texture = scene.textures.createCanvas(key, ATLAS_WIDTH, height);
    const ctx = texture.getContext();
    ctx.font = font;
    ctx.textBaseline = 'alphabetic';
    ctx.lineJoin = 'round';
    ctx.lineWidth = strokeW;
    // Drawn in the same order as Phaser's Text: shadow, outline, fill.
    glyphs.forEach(({ ch, x: gx, y: gy, left }) => {
        const bx = gx + pad + left;
        const by = gy + top + ascent;
        if (shadow) {
            ctx.fillStyle = shadow.color;
            ctx.strokeStyle = shadow.color;
            if (shadow.stroke && strokeW) {
                ctx.strokeText(ch, bx + shadow.offsetX, by + shadow.offsetY);
            }
            if (shadow.fill) {
                ctx.fillText(ch, bx + shadow.offsetX, by + shadow.offsetY);
            }
        }
        if (strokeW) {
            ctx.strokeStyle = style.stroke;
            ctx.strokeText(ch, bx, by);
        }
        ctx.fillStyle = style.color;
        ctx.fillText(ch, bx, by);
    });
    const image = ctx.getImageData(0, 0, ATLAS_WIDTH, height);
    for (let i = 3; i < image.data.length; i += 4) {
        image.data[i] = image.data[i] >= SOLID_ALPHA ? 255 : 0;
    }
    ctx.putImageData(image, 0, 0);
    texture.refresh();

    // Described as a BMFont file, which Phaser knows how to read.
    const xml = `<font><info face="${key}" size="${size}"/><common lineHeight="${lineHeight}"/><chars>${glyphs
        .map((g) => `<char id="${g.ch.charCodeAt(0)}" x="${g.x}" y="${g.y}" width="${g.w}" height="${cellH}" xoffset="${-(pad + g.left)}" yoffset="${-top}" xadvance="${g.advance}"/>`)
        .join('')}</chars></font>`;
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    const data = Phaser.GameObjects.BitmapText.ParseXMLBitmapFont(doc, texture.get(), 0, 0);
    scene.cache.bitmapFont.add(key, { data, texture: key, frame: null });
    return key;
}

// Reports letters a text uses that the fonts don't have.
export function checkChars(text) {
    [...String(text)].forEach((ch) => {
        if (ch !== '\n' && !CHARS.includes(ch) && !reportedMissing.has(ch)) {
            reportedMissing.add(ch);
            console.warn(`Czcionka pikselowa nie ma litery „${ch}”`);
        }
    });
}
