import { defineConfig } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { releaseIdForShell } from './src/release';

const buildCommit = (() => {
  try { return execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], { encoding: 'utf8' }).trim(); }
  catch { return 'unknown'; }
})();

export default defineConfig({
  define: { __WALLPAGE_BUILD__: JSON.stringify(buildCommit) },
  build: {
    target: 'es2022',
    sourcemap: true,
    assetsInlineLimit: 2048,
  },
  plugins: [{
    name: 'wallpage-release-service-worker',
    apply: 'build',
    async closeBundle() {
      const output = resolve(process.cwd(), 'dist');
      const shell = await readFile(resolve(output, 'index.html'), 'utf8');
      const release = releaseIdForShell(shell);
      const template = await readFile(resolve(process.cwd(), 'src/service-worker.template.js'), 'utf8');
      const manifestPath = resolve(output, 'manifest.webmanifest');
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as Record<string, unknown>;
      const notFoundPath = resolve(output, '404.html');
      const notFound = await readFile(notFoundPath, 'utf8');
      manifest.start_url = `/?release=${release}`;
      await Promise.all([
        writeFile(resolve(output, 'sw.js'), template.replace('__WALLPAGE_RELEASE__', release)),
        writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`),
        writeFile(notFoundPath, notFound.replace('__WALLPAGE_BUILD__', buildCommit)),
      ]);
    },
  }],
});
