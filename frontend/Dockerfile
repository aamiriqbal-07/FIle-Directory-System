FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source files
COPY . .

# Build the app
RUN npm run build

# Install serve to run the build
RUN npm install -g serve

EXPOSE 3000

# Serve the built application
CMD ["serve", "-s", "dist", "-p", "3000"]