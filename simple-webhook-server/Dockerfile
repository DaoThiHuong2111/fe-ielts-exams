FROM node:20-alpine

# Install git and docker
RUN apk add --no-cache git docker docker-compose

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S webhook && \
    adduser -S webhook -u 1001

# Change ownership
RUN chown -R webhook:webhook /app

USER webhook

EXPOSE 3122

CMD ["node", "server.js"]