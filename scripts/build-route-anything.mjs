import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'route-anything-dist');

await rm(output, { recursive: true, force: true });

for (const [source, target] of [
  ['sites/route-anything/index.html', 'index.html'],
  ['files/about/favicon.ico', 'files/about/favicon.ico'],
  ['files/papers/route_anything/route_anything.pdf', 'files/papers/route_anything/route_anything.pdf'],
]) {
  const destination = resolve(output, target);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(root, source), destination);
}

console.log('Route Anything built in route-anything-dist/');
