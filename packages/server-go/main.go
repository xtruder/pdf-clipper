package main

import (
	"github.com/labstack/echo/v4"

	"github.com/xtruder/pdf-clipper/packages/server-go/graph"
	"github.com/xtruder/pdf-clipper/packages/server-go/internal/graphql"
	"github.com/xtruder/pdf-clipper/packages/server-go/internal/router"
)

func main() {
	// client, err := datastore.NewRedisClient("localhost:6379")
	// if !errors.Is(err, nil) {
	// 	log.Fatalln(err)
	// }
	// defer client.Close()

	r := &graph.Resolver{}
	//r.SubscribeRedis()
	srv := graphql.NewGraphQLServer(r)

	e := router.NewRouter(echo.New(), srv)
	e.Logger.Fatal(e.Start(":8080"))
}
