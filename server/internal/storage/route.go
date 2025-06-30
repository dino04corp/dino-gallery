package storage

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/dino04corp/gallery-api/internal/storage/handler"
)

func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	h := handler.NewStorageHandler()

	group := rg.Group("/storages")
	group.GET("/options", h.GetStorageOptions)
}
