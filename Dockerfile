# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Генерация Prisma Client + сборка Nest
RUN npx prisma generate
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

# 👉 Prisma schema + client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# 👉 Nest build
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# ⚠️ ВАЖНО: сначала миграции, потом старт
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
