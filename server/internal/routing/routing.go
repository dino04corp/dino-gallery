package routing

import (
	"github.com/dino04corp/gallery-api/internal/user"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ServerData struct {
	DB     *gorm.DB
	Router *gin.Engine
}

func RegisterRoutes(db ServerData) error {
	api := db.Router.Group("/api/v1")
	user.RegisterRoutes(api, db.DB)
	return nil
}
