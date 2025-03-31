FROM node:16

WORKDIR /usr/src/app

# Copier package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./
RUN npm install

# Copier tout le code
COPY . .

# Compiler l'application
RUN npm run build

# Exposer le port
EXPOSE 3000

# Démarrer l'application en mode production (assurez-vous que dist/main.js est généré)
CMD ["node", "dist/main.js"]
