package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, World!",
		})
	})
	api := router.Group("/api")
	{
		api.GET("/users", getUsers)
		api.POST("/users", createUser)
	}
	router.Run(":5689")
}
func getUsers(c *gin.Context) {
	// Handler logic for getting users
}

func createUser(c *gin.Context) {
	// Handler logic for creating a user
}
