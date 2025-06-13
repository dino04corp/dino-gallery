package main

import (
	"fmt"
	"os"

	"github.com/gin-gonic/gin"

	"github.com/dino04corp/gallery-api/internal/routing"
	"github.com/dino04corp/gallery-api/pkg/config"
	"github.com/dino04corp/gallery-api/pkg/db"
)

func main() {
	config := config.LoadConfig()
	db := db.Init(config.DBHost, config.DBPort, config.DBUser, config.DBPass, config.DBName, config.DBSsl)
	router := gin.Default()
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, World!",
		})
	})
	if err := routing.RegisterRoutes(routing.ServerData{DB: db, Router: router}); err != nil {
		fmt.Printf("registering routes: %v\n", err)
		os.Exit(1)
	}

	router.Run(":8001")
}
