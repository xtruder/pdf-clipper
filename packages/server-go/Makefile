DB ?= postgres://postgres@localhost:5432/postgres?sslmode=disable

GO_TAGS := postgres
GO_RUN := go run -tags $(GO_TAGS)

GQLGEN := $(GO_RUN) github.com/99designs/gqlgen
MIGRATE := $(GO_RUN) github.com/golang-migrate/migrate/v4/cmd/migrate
PGGEN := $(GO_RUN) github.com/jschaf/pggen/cmd/pggen
PG_DUMP := pg_dump

.PHONY: download
download:
	@echo Download go.mod dependencies
	@go mod download

.PHONY: install-tools
install-tools:
	@echo Installing tools from tools.go
	@cat tools.go | grep _ | awk -F'"' '{print $$2}' | xargs -tI % go install %

.PHONY: create-migration
create-migration:
	$(MIGRATE) create -ext sql -dir internal/postgres/migrations/ $(name)

.PHONY: migrate-up
migrate-up:
	$(MIGRATE) -source file://internal/postgres/migrations/ -database $(DB) up

.PHONY: migrate-down
migrate-down:
	$(MIGRATE) -source file://internal/postgres/migrations/ -database $(DB) down

.PHONY: gqlgen
gqlgen:
	$(GQLGEN) generate

.PHONY: pggen
pggen:
	$(PGGEN) gen go -query-glob 'internal/postgres/queries/*.sql' \
		--postgres-connection $(DB) \
		--go-type "timestamptz=github.com/jackc/pgtype/zeronull.Timestamptz" \
		--go-type "text=github.com/jackc/pgtype/zeronull.Text" \
		--go-type "uuid=github.com/jackc/pgtype/zeronull.UUID"

.PHONY: dump-seed
dump-seed:
	$(PG_DUMP) --inserts -h localhost -U postgres -a -n public -T schema_migrations -f internal/postgres/pgtest/seed.sql
