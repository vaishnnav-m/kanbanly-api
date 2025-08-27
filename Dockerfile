# Base Image
FROM node:23-slim AS builder
WORKDIR /app
ENV NODE_ENV=development \ PORT=5000
COPY package*.json ./
RUN npm ci

#Development Stage
FROM builder AS development
COPY ./src ./src
COPY package*.json tsconfig.json ./
CMD ["npm","run","dev"]