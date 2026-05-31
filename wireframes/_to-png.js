// Converts every wireframe SVG in ./svg to a PNG in ./png (2x scale).
// Requires: npm install sharp   (temporary build dependency)
// Run: node wireframes/_to-png.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgDir = path.join(__dirname, 'svg');
const pngDir = path.join(__dirname, 'png');
fs.mkdirSync(pngDir, { recursive: true });

const scale = 2; // 1280x860 -> 2560x1720
const files = fs.readdirSync(svgDir).filter((f) => f.endsWith('.svg'));

(async () => {
  for (const f of files) {
    const svg = fs.readFileSync(path.join(svgDir, f));
    const out = path.join(pngDir, f.replace(/\.svg$/, '.png'));
    await sharp(svg, { density: 96 * scale })
      .resize(1280 * scale, 860 * scale, { fit: 'fill' })
      .png()
      .toFile(out);
    console.log('png/' + path.basename(out));
  }
  console.log('done:', files.length, 'PNG files');
})();
