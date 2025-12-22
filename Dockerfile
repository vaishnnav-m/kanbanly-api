# Base Image
FROM node:23-alpine AS base
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ---------- Development ----------
FROM deps AS development
ENV NODE_ENV=development
COPY tsconfig.json ./
COPY src ./src
CMD ["npm", "run", "dev"]

# ---------- Build ----------
FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- Production ----------
FROM node:23-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]