package route

import (
	"github.com/dino04corp/gallery-api/internal/upload/handler"
	"github.com/dino04corp/gallery-api/internal/upload/repository"
	"github.com/dino04corp/gallery-api/internal/upload/service"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers the upload routes with the given Gin router.
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewUploadRepo(db)
	svc := service.NewUploadService(repo)
	h := handler.NewUploadHandler(svc)

	group := rg.Group("/upload")
	group.POST("/", h.Upload)
}
