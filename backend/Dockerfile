FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY server.js ./
COPY models/ ./models/
COPY routes/ ./routes/
COPY controllers/ ./controllers/
COPY middleware/ ./middleware/

EXPOSE 5000
USER node
CMD ["npm", "start"]
