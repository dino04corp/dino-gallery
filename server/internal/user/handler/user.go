package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/dino04corp/gallery-api/internal/user/service"
)

type UserHandler struct {
	svc *service.UserService
}

func NewUserHandler(s *service.UserService) *UserHandler {
	return &UserHandler{svc: s}
}

func (h *UserHandler) Create(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Create user successful",
	})
	// var user model.User
	// if err := c.ShouldBindJSON(&user); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }
	// if err := h.svc.Create(&user); err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }
	// c.JSON(http.StatusCreated, user)
}

func (h *UserHandler) GetAll(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "List of users",
	})
	// users, err := h.svc.GetAll()
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }
	// c.JSON(http.StatusOK, users)
}
