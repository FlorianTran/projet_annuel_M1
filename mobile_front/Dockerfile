FROM node:22

# Définir le dossier de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et installer les dépendances
COPY package*.json ./
RUN npm install -g expo-cli @expo/ngrok && npm install

# Copier tout le code
COPY . .

# Exposer les ports nécessaires pour Expo
# Metro bundler (web/app)
EXPOSE 8081  
# App mobile Android
EXPOSE 19000 
# App mobile iOS
EXPOSE 19001 
# Web (browser)
EXPOSE 19002 

# Variables d'environnement pour forcer le non-interactif
ENV EXPO_NO_INTERACTIVE=true

# Commande pour démarrer Expo en mode tunnel sans interaction
CMD ["npx", "expo", "start", "--tunnel", "--non-interactive"]
