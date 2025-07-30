.PHONY: help dev backend frontend superset analytics all up down logs clean status

help:
	@echo "Available targets:"
	@echo "  help        - Show this help message"
	@echo "  dev         - Start development environment (backend services)"
	@echo "  backend     - Start backend services only"
	@echo "  frontend    - Start frontend configuration service"
	@echo "  superset    - Start Apache Superset analytics stack"
	@echo "  analytics   - Start all analytics services (backend + superset)"
	@echo "  all         - Start all services"
	@echo "  up          - Alias for 'all'"
	@echo "  down        - Stop all services"
	@echo "  logs        - Show logs for all running services"
	@echo "  status      - Show status of all services"
	@echo "  clean       - Stop all services and remove volumes"
	@echo "  clean-hard  - Stop all services, remove volumes and images"
	@echo ""
	@echo "Service-specific commands:"
	@echo "  backend-logs    - Show backend services logs"
	@echo "  frontend-logs   - Show frontend services logs"
	@echo "  superset-logs   - Show superset services logs"
	@echo "  restart-backend - Restart backend services"
	@echo "  restart-frontend - Restart frontend services"
	@echo "  restart-superset - Restart superset services"

dev:
	@echo "Starting development environment..."
	@docker-compose -f admin-backend-main/docker-compose-dev.yml up -d
	@echo "Development environment started"
	@echo "   - PostgreSQL: localhost:5400"
	@echo "   - LocalStack S3: localhost:4566"
	@echo "   - DataDog Agent: localhost:8125,8126"

backend:
	@echo "Starting backend services..."
	@docker-compose -f admin-backend-main/docker-compose-dev.yml up -d
	@echo "Backend services started"

frontend:
	@echo "Starting frontend configuration service..."
	@docker-compose -f admin-frontend-main/docker-compose-configuration.yml up -d
	@echo "Frontend configuration service started"
	@echo "   - Configuration Service: localhost:4000"
	@echo "   - Configuration DB: localhost:5432"

superset:
	@echo "Starting Apache Superset analytics stack..."
	@docker-compose -f superset/docker-compose.superset.yml up -d
	@echo "Waiting for Superset to initialize..."
	@sleep 30
	@echo "Superset analytics stack started"
	@echo "   - Superset UI: http://localhost:8088"
	@echo "   - Redis Cache: localhost:6379"
	@echo "   - Superset DB: localhost:5433"
	@echo "   - Default login: admin/admin"

analytics: backend superset
	@echo "Analytics environment ready"

all: backend frontend superset
	@echo "All services started"
	@echo ""
	@echo "Analytics:"
	@echo "   - Superset: http://localhost:8088"
	@echo "Backend:"
	@echo "   - PostgreSQL: localhost:5400"
	@echo "   - LocalStack S3: localhost:4566"
	@echo "Frontend:"
	@echo "   - Configuration Service: localhost:4000"

up: all

down:
	@echo "Stopping all services..."
	@docker-compose -f admin-backend-main/docker-compose-dev.yml down
	@docker-compose -f admin-frontend-main/docker-compose-configuration.yml down
	@docker-compose -f superset/docker-compose.superset.yml down
	@echo "All services stopped"

logs:
	@echo "Showing logs for all services..."
	@echo "=== Backend Services Logs ==="
	@docker-compose -f admin-backend-main/docker-compose-dev.yml logs --tail=50
	@echo "=== Frontend Services Logs ==="
	@docker-compose -f admin-frontend-main/docker-compose-configuration.yml logs --tail=50
	@echo "=== Superset Services Logs ==="
	@docker-compose -f superset/docker-compose.superset.yml logs --tail=50

status:
	@echo "Service Status:"
	@echo ""
	@echo "=== Backend Services ==="
	@docker-compose -f admin-backend-main/docker-compose-dev.yml ps
	@echo ""
	@echo "=== Frontend Services ==="
	@docker-compose -f admin-frontend-main/docker-compose-configuration.yml ps
	@echo ""
	@echo "=== Superset Services ==="
	@docker-compose -f superset/docker-compose.superset.yml ps

clean:
	@echo "Cleaning all services and volumes..."
	@docker-compose -f admin-backend-main/docker-compose-dev.yml down -v
	@docker-compose -f admin-frontend-main/docker-compose-configuration.yml down -v
	@docker-compose -f superset/docker-compose.superset.yml down -v
	@echo "All services and volumes removed"

clean-hard:
	@echo "Hard cleaning - removing services, volumes, and images..."
	@docker-compose -f admin-backend-main/docker-compose-dev.yml down -v --rmi all
	@docker-compose -f admin-frontend-main/docker-compose-configuration.yml down -v --rmi all
	@docker-compose -f superset/docker-compose.superset.yml down -v --rmi all
	@echo "All services, volumes, and images removed"

backend-logs:
	@echo "Backend services logs:"
	@docker-compose -f admin-backend-main/docker-compose-dev.yml logs -f

frontend-logs:
	@echo "Frontend services logs:"
	@docker-compose -f admin-frontend-main/docker-compose-configuration.yml logs -f

superset-logs:
	@echo "Superset services logs:"
	@docker-compose -f superset/docker-compose.superset.yml logs -f

restart-backend:
	@echo "Restarting backend services..."
	@docker-compose -f admin-backend-main/docker-compose-dev.yml restart
	@echo "Backend services restarted"

restart-frontend:
	@echo "Restarting frontend services..."
	@docker-compose -f admin-frontend-main/docker-compose-configuration.yml restart
	@echo "Frontend services restarted"

restart-superset:
	@echo "Restarting superset services..."
	@docker-compose -f superset/docker-compose.superset.yml restart
	@echo "Superset services restarted"

db-migrate:
	@echo "Running database migrations..."
	@cd admin-backend-main && npm run prisma:generate
	@echo "Database migrations completed"

db-seed:
	@echo "Seeding database with dummy data..."
	@cd admin-backend-main && npm run prisma:seed
	@echo "Database seeded successfully"


setup: all db-migrate db-seed
	@echo "Full environment setup completed"
	@echo ""
	@echo "Access Points:"
	@echo "   - Admin Panel (Frontend): http://localhost:3000"
	@echo "   - Admin Panel (Backend): http://localhost:8000"
	@echo "   - Superset Analytics: http://localhost:8088"
	@echo "   - Configuration Service: http://localhost:4000"
	@echo ""
	@echo "Analytics Dashboard URLs:"
	@echo "   - Flow Analytics: http://localhost:8088/superset/dashboard/1/"
	@echo "   - Time Insights: http://localhost:8088/superset/dashboard/2/"

quick-dev: dev
	@echo "Quick development environment ready"

	@echo "   - PostgreSQL: localhost:5400"
	@echo "   - LocalStack S3: localhost:4566"
	@echo "   - Ready for backend development"