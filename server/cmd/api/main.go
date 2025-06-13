package main

import (
	"github.com/gin-gonic/gin"

	"github.com/dino04corp/gallery-api/internal/user"
)

func main() {
	router := gin.Default()
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, World!",
		})
	})
	api := router.Group("/api/v1")
	user.RegisterRoutes(api)
	router.Run(":8001")
}
