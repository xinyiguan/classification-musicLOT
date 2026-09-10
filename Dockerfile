FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the backend
COPY server ./server

# Copy the already-built frontend
COPY dist ./dist

# Data directory
RUN mkdir -p /data

EXPOSE 3000

CMD ["node", "server/server.js"]