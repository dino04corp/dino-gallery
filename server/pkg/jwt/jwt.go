package jwt

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("change-this")

func SetSecret(key string) {
	secretKey = []byte(key)
}

func GenerateToken(userID string, expHours int) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Duration(expHours) * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

func ValidateToken(tokenStr string) (*jwt.Token, error) {
	return jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})
}

func GetUserIDFromToken(token *jwt.Token) (string, error) {
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims["user_id"].(string), nil
	}
	return "", jwt.ErrInvalidKey
}
