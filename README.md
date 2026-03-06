# weekly-web

4.  **Deploy**: Click "Deploy".

**Note**: The data generation script (`scripts/build-data.mjs`) depends on an external repository (`../weekly-master`) which is not available on Vercel. Therefore, we commit the generated JSON files in `src/data` to the repository so Vercel can build the site using this pre-generated data.

## Deploy to Cloudflare Pages

Cloudflare Pages also supports Next.js static exports out of the box.

1.  **Push to GitHub**: Same as above, ensure `src/data` is committed.
2.  **Create Project**: Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > Pages > "Connect to Git".
3.  **Select Repository**: Choose your `weekly-web` repository.
4.  **Build Settings**:
    -   **Framework Preset**: Select **Next.js (Static HTML Export)**.
    -   **Build Command**: `npm run build`
    -   **Build Output Directory**: `out`
5.  **Save and Deploy**.

Since `next.config.ts` is already configured with `output: 'export'` and `images: { unoptimized: true }`, no code changes are required.

## Configuration

- **Data Source**: Configured in `scripts/build-data.mjs` (default: `../weekly-master/docs`).

