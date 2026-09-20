# Route Anything

Live site: https://route-anything.vercel.app/

Edit `sites/route-anything/index.html`. The build copies this page, the favicon,
and the theory paper PDF into `route-anything-dist/`.

From the repository root:

```sh
node scripts/build-route-anything.mjs
npx vercel deploy --prod --scope openomnisources-projects
```

The Vercel project is `route-anything`, on the free Hobby plan. Deployments are
currently made through the CLI; automatic GitHub deployments are not connected.
GitHub Pages continues to serve the personal homepage from this repository.
