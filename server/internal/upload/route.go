package upload

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/dino04corp/gallery-api/internal/storage/repository"
	"github.com/dino04corp/gallery-api/internal/upload/handler"
	"github.com/dino04corp/gallery-api/internal/upload/service"
)

// RegisterRoutes registers the upload routes with the given Gin router.
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewStorageRepo(db)
	svc := service.NewUploadService(repo)
	h := handler.NewUploadHandler(svc)

	group := rg.Group("/upload")
	group.POST("/storages/:id", h.Upload)
}
