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
