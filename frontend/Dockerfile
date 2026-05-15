# syntax=docker/dockerfile:1.7

# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Cache de dependências
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Build do SPA
COPY . .

# VITE_API_URL relativo: em produção o Nginx faz proxy /api → backend:8081,
# então o bundle pode bater em /api/* (same-origin, sem CORS preflight)
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime

# Substitui config default por uma com SPA fallback + proxy /api
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
