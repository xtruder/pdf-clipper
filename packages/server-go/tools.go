// +build tools

package main

import (
	_ "github.com/99designs/gqlgen"
	_ "github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/cmd/migrate"
	_ "github.com/jschaf/pggen/cmd/pggen"
)
