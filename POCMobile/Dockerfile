FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Créer le dossier de configuration pour l'utilisateur node
RUN mkdir -p /home/node/.config/react-native && chmod -R 777 /home/node/.config/react-native

ENV HOME=/home/node
USER node

EXPOSE 8081

CMD ["npx", "react-native", "start"]
