package pgtest

import (
	"context"
	_ "embed"
	"fmt"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/xtruder/pdf-clipper/packages/server-go/internal/util"
)

//go:embed seed.sql
var seedSQL string

var cleanTables []string = []string{"sessions", "documents", "document_members", "document_highlights", "blob_infos", "accounts"}

func CreateTestDB() (*pgxpool.Pool, func()) {
	url := util.GetEnvOrDefault("DATABASE_URL", "postgres://postgres@localhost/postgres?application_name=pgtest&search_path=public&connect_timeout=5")
	conn, err := pgxpool.Connect(context.Background(), url)
	if err != nil {
		panic(fmt.Errorf("unable to connect to database: %v", err))
	}

	// clean tables
	for _, tblName := range cleanTables {
		if _, err := conn.Exec(context.Background(), "DELETE FROM "+tblName); err != nil {
			panic(fmt.Errorf("error cleaning table '%s': %w", tblName, err))
		}
	}

	_, err = conn.Exec(context.Background(), seedSQL)
	if err != nil {
		panic(err)
	}

	close := func() {
		conn.Close()
	}

	return conn, close
}
