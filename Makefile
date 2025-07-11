# ---------------------------------------------
# Makefile pour gestion de projet Docker (Backend, Frontend, DB)
# Compatible développement et production
# ---------------------------------------------

# Nom du fichier docker-compose à utiliser
COMPOSE_FILE = docker-compose.yml

# ---------------------------------------------
# Commandes principales
# ---------------------------------------------

# Build et démarre tous les conteneurs (frontend, backend, db)
up:
	@docker compose -f $(COMPOSE_FILE) up --build

# Démarre tous les conteneurs en arrière-plan (mode détaché)
up-detach:
	@docker compose -f $(COMPOSE_FILE) up -d

# Arrête tous les conteneurs
down:
	@docker compose -f $(COMPOSE_FILE) down

# Affiche les logs en continu de tous les conteneurs
logs:
	@docker compose -f $(COMPOSE_FILE) logs -f

# Rebuild uniquement les images Docker sans démarrer les conteneurs
rebuild:
	@docker compose -f $(COMPOSE_FILE) build

# Redémarre l'application proprement (stop puis start immédiat)
restart: down up

# ---------------------------------------------
# Commandes individuelles pour chaque service
# ---------------------------------------------

# Démarre uniquement le backend (et ses dépendances)
up-backend:
	@docker compose up backend

# Démarre uniquement le frontend (et ses dépendances)
up-frontend:
	@docker compose up frontend

# Démarre uniquement la base de données
up-db:
	@docker compose up db

# Arrête uniquement le backend
down-backend:
	@docker compose stop backend

# Arrête uniquement le frontend
down-frontend:
	@docker compose stop frontend

# Arrête uniquement la base de données
down-db:
	@docker compose stop db

# ---------------------------------------------
# Commandes avancées
# ---------------------------------------------

# Purge complète : stop tous les conteneurs + supprime les volumes Docker
# (utile pour réinitialiser complètement la base de données PostgreSQL)
purge:
	@docker compose -f $(COMPOSE_FILE) down -v
	@docker volume prune -f

# ---------------------------------------------
# Notes :
# - "make up" => développement local rapide
# - "make purge" => reset complet (⚠️ supprime TOUTES les données)
# - "make logs" => utile en cas de debugging
# - toujours utiliser "purge" avec prudence sur un projet en production
# ---------------------------------------------
