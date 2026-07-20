# ── Stage 1: build the customer frontend ────────────────────────────────
FROM node:20-alpine AS build-frontend
WORKDIR /repo/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Optional: override the API base URL baked into the build.
# Set via `docker build --build-arg VITE_API_URL=https://api.yourdomain.com`
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# ── Stage 2: build the admin panel, nested into the frontend's dist ────
FROM node:20-alpine AS build-admin
WORKDIR /repo/admin-panel
COPY admin-panel/package*.json ./
RUN npm ci
COPY admin-panel/ ./
# Bring over the already-built frontend/dist so build:into-site has
# somewhere to write ../frontend/dist/admin
COPY --from=build-frontend /repo/frontend/dist /repo/frontend/dist
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build:into-site

# ── Stage 3: serve the combined static output ───────────────────────────
FROM nginx:alpine AS serve
COPY --from=build-admin /repo/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
