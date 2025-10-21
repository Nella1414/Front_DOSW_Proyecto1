FROM node:20-alpine AS development-dependencies-env
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install

FROM node:20-alpine AS production-dependencies-env
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

FROM node:20-alpine AS build-env
WORKDIR /app
COPY . .
COPY --from=development-dependencies-env /app/node_modules ./node_modules
RUN npm install -g pnpm && pnpm run build

FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build
RUN npm install -g pnpm
CMD ["pnpm", "start"]