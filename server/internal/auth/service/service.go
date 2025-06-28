package service

import (
	"errors"
	"fmt"

	"strconv"

	"golang.org/x/crypto/bcrypt"

	"github.com/dino04corp/gallery-api/internal/user/model"
	userRepo "github.com/dino04corp/gallery-api/internal/user/repository"
	"github.com/dino04corp/gallery-api/pkg/jwt"
)

type AuthService interface {
	Register(email, password string) (string, error)
	Login(email, password string) (string, error)
}

type authService struct {
	userRepo userRepo.UserRepo
}

func NewAuthService(userRepo userRepo.UserRepo) AuthService {
	return &authService{userRepo}
}

func (s *authService) Register(username, password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("hashing failed: %w", err)
	}

	user := &model.User{Username: username, Password: string(hashed)}
	if err := s.userRepo.Create(user); err != nil {
		return "", fmt.Errorf("create user failed: %w", err)
	}
	jwtToken, err := jwt.GenerateToken(strconv.Itoa(user.ID))
	if err != nil {
		return "", fmt.Errorf("token generation failed: %w", err)
	}

	return jwtToken, nil
}

func (s *authService) Login(username, password string) (string, error) {
	user, err := s.userRepo.FindByUsername(username)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("invalid credentials")
	}
	jwtToken, err := jwt.GenerateToken(strconv.Itoa(user.ID))
	if err != nil {
		return "", errors.New("failed to generate token")
	}

	return jwtToken, nil
}
