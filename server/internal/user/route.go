package user

import (
	"github.com/gin-gonic/gin"

	"github.com/dino04corp/gallery-api/internal/user/handler"
	"github.com/dino04corp/gallery-api/internal/user/repository"
	"github.com/dino04corp/gallery-api/internal/user/service"
	"github.com/dino04corp/gallery-api/pkg/db"
)

func RegisterRoutes(rg *gin.RouterGroup) {
	repo := repository.NewUserRepo(db.DB)
	svc := service.NewUserService(repo)
	h := handler.NewUserHandler(svc)

	group := rg.Group("/users")
	group.POST("/", h.Create)
	group.GET("/", h.GetAll)
}
