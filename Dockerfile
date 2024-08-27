FROM oven/bun:1
WORKDIR /backend
COPY . .
RUN bun install
 
ARG PORT
EXPOSE ${PORT:-5000}
 
CMD ["bun", "src/index.ts"]