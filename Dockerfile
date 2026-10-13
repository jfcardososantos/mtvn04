# syntax=docker/dockerfile:1
# Bolso Estudante - build multi-stage com cache (BuildKit)
# Build:  docker build -t bolso-estudante .
# Run:    docker run -p 8080:80 bolso-estudante

# ---------------------------------------------------------------------------
# 1) Dependências: camada isolada para máximo reaproveitamento de cache.
#    Só é reconstruída quando package.json / lockfile mudam.
# ---------------------------------------------------------------------------
FROM node:24-alpine AS deps
WORKDIR /app

# Lockfile do npm tem prioridade; bun.lock vazio não serve para install determinístico.
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund; \
    else \
      npm install --no-audit --no-fund; \
    fi

# ---------------------------------------------------------------------------
# 2) Build: copia fontes e gera /app/dist
# ---------------------------------------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Typecheck + bundle de produção
RUN npm run lint && npm run build

# ---------------------------------------------------------------------------
# 3) Runtime: nginx servindo os arquivos estáticos
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# Remove a config default e usa a nossa (SPA fallback + gzip + cache)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
