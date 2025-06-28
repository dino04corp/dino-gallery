package middleware

// import (
// 	"strings"

// 	"github.com/dino04corp/gallery-api/pkg/jwt"
// 	"github.com/gin-gonic/gin"
// )

// func AuthMiddleware(secret []byte) gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		tokenStr := strings.TrimPrefix(c.GetHeader("Authorization"), "Bearer ")
// 		claims, err := jwt.VerifyToken(tokenStr)
// 		if err != nil {
// 			c.AbortWithStatusJSON(401, "Unauthorized")
// 			return
// 		}
// 		c.Set("userID", claims["user_id"])
// 		c.Next()
// 	}
// }
