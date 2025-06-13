package user

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/dino04corp/gallery-api/internal/user/handler"
	"github.com/dino04corp/gallery-api/internal/user/repository"
	"github.com/dino04corp/gallery-api/internal/user/service"
)

func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewUserRepo(db)
	svc := service.NewUserService(repo)
	h := handler.NewUserHandler(svc)

	group := rg.Group("/users")
	group.POST("/", h.Create)
	group.GET("/", h.GetAll)
}
