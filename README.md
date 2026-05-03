# EduLearn

Plateforme e-learning en monorepo: frontend React, backend Spring Boot et base PostgreSQL.

## Apercu

Le projet contient:
- `frontend/`: application React (build Vite) servie par Nginx en Docker
- `backend/`: API Spring Boot (Java 21)
- `docker-compose.yml`: orchestration locale (frontend, backend, db)

## Architecture

```text
Browser
	|
	v
Frontend React (Nginx, :5173)
	|
	| HTTP /api/*
	v
Backend Spring Boot (:8080)
	|
	| JPA / JDBC
	v
PostgreSQL (:5432)
```

Flux principal:
- le frontend appelle les endpoints REST du backend (`/api/...`)
- le backend applique la logique metier et la securite
- les donnees sont stockees dans PostgreSQL

## Stack technique

- Frontend: React 19, React Router, Vite 8
- Backend: Spring Boot 3.5, Spring Security, JPA/Hibernate
- Base de donnees: PostgreSQL 15
- Infra locale: Docker Compose

## Ports utilises

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

## Prerequis

- Docker Desktop (recommande)
- (Option local sans Docker) Node.js 20+, Java 21

## Configuration des variables

Le backend lit ses variables depuis `backend/.env`.

Creation rapide:

```powershell
Copy-Item backend/.env.example backend/.env
```

Important:
- ne pas versionner `backend/.env`
- versionner uniquement `backend/.env.example`

## Lancement rapide avec Docker (recommande)

Depuis la racine du repo:

```powershell
docker compose up -d --build
```

Verifier les services:

```powershell
docker compose ps
```

Arreter:

```powershell
docker compose down
```

Arreter + supprimer volumes (efface les donnees DB locales):

```powershell
docker compose down -v
```

## Lancement sans Docker (mode dev)

Backend (terminal 1):

```powershell
Set-Location backend
.\mvnw.cmd spring-boot:run
```

Frontend (terminal 2):

```powershell
Set-Location frontend
npm install
npm run dev
```

## API

- Base URL: `http://localhost:8080`
- Endpoint classes: `GET /api/classes`
- Swagger: `http://localhost:8080/swagger-ui/index.html`

Test rapide:

```powershell
curl.exe -i http://localhost:8080/api/classes
```

## Notes importantes frontend

- En Docker, le frontend est servi par Nginx avec fallback SPA (`try_files ... /index.html`).
- Le refresh direct sur une route React (`/signup`, `/profile`, etc.) ne doit plus renvoyer 404.
- L'API frontend utilise `VITE_API_BASE_URL` et fallback sur `http://localhost:8080`.

## Depannage rapide

### 1) `GET /api/classes` renvoie 403

Verifier la config de securite backend pour autoriser les GET publics sur `/api/classes/**`.

Puis rebuild backend:

```powershell
docker compose up -d --build backend
```

### 2) `Level` vide dans la page Sign Up

Si `GET /api/classes` renvoie `[]`, aucun niveau ne peut etre affiche.

Ajouter des donnees de test:

```powershell
docker exec -it postgres_db psql -U edulearn_user -d edulearn -c "INSERT INTO classes (title, level, created_at) VALUES ('3eme Science', 'COLLEGE', NOW()), ('Bac Math', 'LYCEE', NOW()), ('L1 Info', 'UNIV', NOW());"
```

### 3) 404 Nginx sur refresh route frontend

Rebuild frontend pour prendre la conf Nginx actuelle:

```powershell
docker compose up -d --build frontend
```
