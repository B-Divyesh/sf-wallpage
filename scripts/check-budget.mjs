import { readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const limits = {
  '.js': 200 * 1024,
  '.css': 50 * 1024,
  '.avif': 300 * 1024,
  '.webp': 300 * 1024,
  '.jpg': 300 * 1024,
  '.woff2': 120 * 1024,
};

const assets = resolve('dist/assets');
const files = await readdir(assets);
const failures = [];
let initialJavaScript = 0;

for (const file of files) {
  const extension = file.slice(file.lastIndexOf('.'));
  if (!(extension in limits)) continue;
  const bytes = (await stat(resolve(assets, file))).size;
  // The startup file is intentionally distinct from on-demand scene chunks.
  if (extension === '.js' && file.startsWith('index-')) initialJavaScript += bytes;
  if (bytes > limits[extension]) failures.push(`${file}: ${bytes} B exceeds ${limits[extension]} B`);
}

if (initialJavaScript > limits['.js']) failures.push(`initial JavaScript: ${initialJavaScript} B exceeds ${limits['.js']} B`);
if (failures.length) throw new Error(`Wallpage performance budget failed:\n${failures.join('\n')}`);
console.log(`Wallpage budget passed: initial JavaScript ${initialJavaScript} B (limit ${limits['.js']} B); CSS and poster assets are within limits.`);
