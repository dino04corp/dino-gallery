package storage

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/dino04corp/gallery-api/internal/storage/handler"
	"github.com/dino04corp/gallery-api/internal/storage/repository"
	"github.com/dino04corp/gallery-api/internal/storage/service"
)

func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewStorageRepo(db)
	svc := service.NewStorageService(repo)
	h := handler.NewStorageHandler(svc)

	group := rg.Group("/storages")
	group.GET("/options", h.GetStorageOptions)
	group.POST("/", h.CreateStorage)
	group.GET("/", h.ListStorages)
	// group.GET("/:id", h.GetStorage)
	// group.PUT("/:id", h.UpdateStorage)
	// group.DELETE("/:id", h.DeleteStorage)
}
