# USDC Control Plane

**Trust invariants for programmable assets** — a simulated internal engineering console (static SPA).

This repository implements the artifact described in [PRD.md](./PRD.md). See [architecture.md](./architecture.md) for system diagrams and [checklist.md](./checklist.md) for phased delivery and verification gates.

## Stack

- Static HTML/CSS/JavaScript (`index.html`, `styles.css`, `app.js`)
- Docker + nginx for deployment (Coolify-compatible)

There is **no backend**, **no database**, and **no live chain integrations** — simulation only.

## Local development

Serve the folder with any static server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Checks

```bash
npm install   # optional; no runtime deps yet — installs nothing extra
npm run check # syntax check app.js + unit tests
```

## Docker

```bash
docker build -t usdc-control-plane .
```

The container listens on port 80.

## License

Private / portfolio — see repository owner.
