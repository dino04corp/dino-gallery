package auth

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/dino04corp/gallery-api/internal/auth/handler"
	"github.com/dino04corp/gallery-api/internal/auth/service"
	"github.com/dino04corp/gallery-api/internal/user/repository"
)

func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	repo := repository.NewUserRepo(db)
	svc := service.NewAuthService(repo)
	h := handler.NewAuthHandler(svc)

	group := rg.Group("/auth")
	// Public Routes
	group.POST("/register", h.Register) // Đăng ký tài khoản mới
	group.POST("/login", h.Login)       // Đăng nhập, trả về access
	// group.POST("/forgot", h.ForgotPassword) // Gửi email reset mật khẩu
	// group.POST("/reset", h.ResetPassword)   // Đổi mật khẩu với token
	// group.GET("/verify", h.CreateUser)      // Xác thực email nếu dùng OTP

	// Protected Routes
	group.POST("/logout", h.Logout) // Đăng xuất, xóa token (nếu lưu)
	// group.GET("/profile", h.CreateUser)  // Lấy thông tin người dùng đã đăng nhập
	// group.PUT("/profile", h.CreateUser)  // Cập nhật thông tin người dùng đã đăng nhập
	// group.PUT("/password", h.CreateUser) // Cập nhật mật khẩu người dùng đã đăng nhập
	// group.PUT("/refresh", h.RefreshToken) // Lấy access token mới (nếu dùng refresh token)

	//  OAuth (Google, Facebook...)
	// group.GET("/oauth/google", h.CreateUser)          // Redirect to Google OAuth
	// group.GET("/oauth/google/callback", h.CreateUser) // Callback from Google OAuth
}
