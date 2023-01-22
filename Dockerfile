FROM node:16

# Working Dir
WORKDIR /usr/src/app

# Copy Package Json files
COPY package*.json ./

# Install Files
RUN npm install

# Copy Source Files
COPY . .

# Build
RUN npm run build

# EXPOSE
EXPOSE 8080

CMD ["node", "build/main.js"]