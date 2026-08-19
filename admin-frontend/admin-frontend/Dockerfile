# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 — dependencies
# ---------------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# Stage 2 — test
# Vitest + RTL, run once on the dev branch.
# ---------------------------------------------------------------------------
FROM deps AS test
WORKDIR /app

COPY . .
RUN npm run test -- --run

# ---------------------------------------------------------------------------
# Stage 3 — build
# No VITE_API_BASE_URL build ARG on purpose.
#
# Build-once means one bundle has to serve dev, test and prod, so the API URL
# cannot be inlined here — Vite would freeze it into the JavaScript. It is
# injected at container start instead (see docker-entrypoint.sh).
# ---------------------------------------------------------------------------
FROM deps AS build
WORKDIR /app

COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Stage 4 — runtime
# nginx + the static bundle + a tiny entrypoint that writes config.js from
# environment variables before the server starts.
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

LABEL org.opencontainers.image.title="admin-frontend" \
      org.opencontainers.image.source="https://github.com/karlsamaha/smart-locker"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker-entrypoint.sh /docker-entrypoint.d/99-app-config.sh
RUN chmod +x /docker-entrypoint.d/99-app-config.sh

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
    CMD wget -qO- http://localhost/config.js >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
