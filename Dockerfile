# Use the official Node.js image
FROM node:22.5.1

# Create and change to the app directory
WORKDIR /app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Ensure Prisma CLI is installed
RUN npm install prisma --save-dev

# Copy app files
COPY . .

# Expose the backend port
EXPOSE 5000

# Run database migrations and start the application
CMD ["sh", "-c", "npx prisma migrate dev --name init && npx nodemon src/index.js"]
