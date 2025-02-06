# Utiliser une image officielle de Node.js comme image de base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers de l'application
COPY . .

# Générer Prisma Client avec les bons binaryTargets
RUN npx prisma generate

# Compiler le code TypeScript
RUN npm run build

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Définir la commande pour démarrer l'application
CMD ["node", "dist/index.js"]