package routing

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/dino04corp/gallery-api/internal/auth"
	"github.com/dino04corp/gallery-api/internal/middleware"
	"github.com/dino04corp/gallery-api/internal/user"
)

type ServerData struct {
	DB     *gorm.DB
	Router *gin.Engine
}

func RegisterRoutes(root ServerData) error {
	router := root.Router
	router.Use(middleware.CORS())

	api := router.Group("/api/v1")
	auth.RegisterRoutes(api, root.DB)
	user.RegisterRoutes(api, root.DB)
	return nil
}
