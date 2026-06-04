# syntax=docker/dockerfile:1

# ---- Dépendances (utilisateur non-root pour le cache Vite et dist) ----
FROM node:20-alpine AS deps
WORKDIR /app
RUN chown node:node /app
USER node
# npm install (et non npm ci) pour résoudre les dépendances optionnelles propres
# à la plateforme Linux du conteneur (le lock est généré sous Windows).
COPY --chown=node:node package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# ---- Développement : serveur Vite avec hot-reload ----
FROM deps AS dev
COPY --chown=node:node . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---- Build : génère les fichiers statiques optimisés ----
FROM deps AS build
COPY --chown=node:node . .
RUN npm run build

# ---- Production : nginx sert le build et proxifie /api vers le backend ----
FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
