package dto

type LoginRequest struct {
	Username string `form:"username" binding:"required"`
	Password string `form:"password" binding:"required"`
}
