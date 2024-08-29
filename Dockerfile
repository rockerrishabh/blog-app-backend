FROM oven/bun

WORKDIR /api

COPY package*.json bun.lockb ./
RUN bun install
COPY . .

ENV NODE_ENV production

CMD [ "bun", "start" ]