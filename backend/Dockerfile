FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 app && \
    adduser --system --uid 1001 app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN chown -R app:app /app

USER app

EXPOSE 5000

CMD ["node", "src/server.js"]
