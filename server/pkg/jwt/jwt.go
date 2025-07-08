package jwt

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("change-this")

func SetSecret(key string) {
	secretKey = []byte(key)
}

func GenerateToken(userID string) (string, error) {
	claims := jwt.MapClaims{
		"userId": userID,
		"exp":     time.Now().Add(time.Duration(24) * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

func ValidateToken(token string) (*jwt.Token, error) {
	return jwt.Parse(token, func(t_ *jwt.Token) (interface{}, error) {
		if _, ok := t_.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method %v", t_.Header["alg"])
		}
		return []byte(secretKey), nil
	})
}

func GetUserIDFromToken(token *jwt.Token) (string, error) {
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims["user_id"].(string), nil
	}
	return "", jwt.ErrInvalidKey
}
