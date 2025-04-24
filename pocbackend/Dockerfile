FROM node:20

WORKDIR /usr/src/app

# Copier les fichiers nécessaires à l'installation
COPY package*.json ./
RUN npm install

# Copier tout le projet Nest
COPY . .

# Compiler l'application NestJS
RUN npm run build

EXPOSE 3000

# Démarrer l'application
CMD ["node", "dist/main.js"]
