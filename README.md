# node-docker

A Docker Compose proof of concept: two Node.js/Express replicas behind nginx, sharing a Redis counter so every replica sees the same visit count.

## Architecture

```
Browser  →  nginx:80  →  web1:5000  ─┐
                      →  web2:5000  ─┴→  redis:6379
```

Direct replica ports are also published (`81` → web1, `82` → web2) so you can compare a single instance against the load-balanced entrypoint.

| Path | Role |
| --- | --- |
| `compose.yaml` | `web1`, `web2`, `nginx`, `redis` |
| `web/` | Express app + Dockerfile (visit counter via Redis) |
| `nginx/` | Upstream `loadbalancer` across `web1` and `web2` |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Compose v2

## Run

```bash
docker compose up --build
```

- Load-balanced app: [http://localhost](http://localhost)
- Replica 1: [http://localhost:81](http://localhost:81)
- Replica 2: [http://localhost:82](http://localhost:82)

Refresh `/` and the visit count should increase across all three URLs because they share the same Redis key (`numVisits`).

Stop with `Ctrl+C` or `docker compose down`.

## Local Node (without Docker)

Redis must be reachable at hostname `redis` (as in Compose) or you need to change `web/server.js`. The intended path is Compose.

```bash
cd web
npm install
npm run dev
```

## Technologies

- **Node.js** and **Express**
- **Redis** (`redis` client, Alpine image)
- **Docker Compose**
- **nginx** round-robin upstream

## Notes

Do not commit SSH keys or `.pem` files into this repo. Keep them out of git (see `.gitignore`).
