COMPOSE_FILE = docker-compose.yml

up:
	@docker compose -f $(COMPOSE_FILE) up --build

up-detach:
	@docker compose -f $(COMPOSE_FILE) up -d

down:
	@docker compose -f $(COMPOSE_FILE) down

logs:
	@docker compose -f $(COMPOSE_FILE) logs -f

rebuild:
	@docker compose -f $(COMPOSE_FILE) build

restart: down up
