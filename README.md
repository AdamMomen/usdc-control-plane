# USDC Control Plane

**Trust invariants for programmable assets** — a simulated internal engineering console (static SPA).

This repository implements the artifact described in [PRD.md](./PRD.md). See [architecture.md](./architecture.md) for system diagrams and [checklist.md](./checklist.md) for phased delivery and verification gates.

## Stack

- Static HTML/CSS/JavaScript (`index.html`, `styles.css`, `app.js`)
- Docker + nginx for deployment (Coolify-compatible)

There is **no backend**, **no database**, and **no live chain integrations** — simulation only.

## Live review (Coolify)

Deployed build for reviewers:

**https://circle.coolify.momen.earth**

## Local development

Install dependencies with [**pnpm**](https://pnpm.io/) (see `packageManager` in `package.json` — [Corepack](https://nodejs.org/api/corepack.html) can enable it: `corepack enable`).

```bash
pnpm install
pnpm run dev
```

Then open `http://localhost:8080`. The dev script uses [`serve`](https://github.com/vercel/serve).

You can swap in any static file server you prefer, for example:

```bash
php -S localhost:8080 -t .
# or
python3 -m http.server 8080
```

## Checks

```bash
pnpm install
pnpm run check   # syntax check app.js + unit tests
pnpm test        # tests only
```

## Docker

```bash
docker build -t usdc-control-plane .
```

The container listens on port 80.

## License

Private / portfolio — see repository owner.
