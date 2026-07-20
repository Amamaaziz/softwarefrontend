FROM node:20-alpine AS base
WORKDIR /app

# Install deps first for better layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Prisma needs the schema present before `generate`
COPY prisma ./prisma
RUN npx prisma generate

# Now bring in the rest of the source
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]