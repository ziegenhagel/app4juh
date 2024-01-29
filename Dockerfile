# Use any Node.js base image that you want (as long as it's Alpine)!
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json file into the working directory before copying the rest of the files to cache the dependencies
COPY package.json /app

# Install the dependencies, you might want to use yarn or pnpm instead
RUN npm install

# Copy the rest of the files into the working directory
COPY . /app

# Build the application, again, use yarn or pnpm if you want
RUN npm run build

EXPOSE 3000/tcp

# Start the application. This is the default command for Nuxt 3
CMD ["node", ".output/server/index.mjs"] 
