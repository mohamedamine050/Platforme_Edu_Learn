# EduLearn

Plateforme e-learning en architecture monorepo.

## Apercu

Ce projet contient:
- un frontend React + Vite
- un backend Spring Boot
- une base PostgreSQL via Docker Compose

## Structure du projet

.
|- frontend/
|- backend/
|- docker-compose.yml
|- .gitignore
|- README.md

## Stack technique

- Frontend: React 19, Vite, React Router
- Backend: Java 21, Spring Boot 3, Spring Security, JPA
- Base de donnees: PostgreSQL 15
- Infra locale: Docker Compose

## Prerequis

- Node.js 20+
- Java 21
- Docker Desktop
- Maven Wrapper (deja present dans backend)

## Variables d environnement

Le fichier d environnement backend doit exister ici:

- backend/.env

Creation rapide depuis le modele:

PowerShell:

Copy-Item backend/.env.example backend/.env

Important:
- Ne jamais versionner backend/.env
- Versionner uniquement backend/.env.example

## Lancer le projet avec Docker (recommande)

Depuis la racine du monorepo:

docker compose up --build

Services exposes:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

Pour arreter:

docker compose down

## Lancer en local sans Docker

### 1) Backend

PowerShell:

Set-Location backend
.\mvnw.cmd spring-boot:run

### 2) Frontend

Dans un second terminal:

Set-Location frontend
npm install
npm run dev

Le frontend sera disponible en general sur:
- http://localhost:5173

## Commandes utiles

Frontend:

Set-Location frontend
npm run dev
npm run build
npm run lint

Backend:

Set-Location backend
.\mvnw.cmd test
.\mvnw.cmd -DskipTests package

## API et documentation

Le backend expose l API sous /api.

Swagger UI (si active selon le profil/config):
- http://localhost:8080/swagger-ui/index.html

## Conventions Git

- Branche principale: main
- Branches de travail: feature/nom-fonctionnalite
- Commits clairs et atomiques

Exemple:
- feat(auth): add JWT cookie login
- fix(docker): correct backend env path

## Depannage rapide

Si une commande echoue avec un ancien chemin project:
- utilise backend au lieu de project

Exemple correct:

Set-Location C:/Users/mouha/edulearn/backend
.\mvnw.cmd -q -DskipTests package

Si docker compose ne trouve pas .env:
- verifie que backend/.env existe
- verifie que docker-compose.yml reference bien ./backend/.env
