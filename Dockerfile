# MYG-BACKEND/Dockerfile
FROM node:22.5.1-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5000

# Generate Prisma Client
RUN npx prisma generate

# Migrate and Seed Database
CMD ["sh", "-c", "npm run migrate && npm start"]
