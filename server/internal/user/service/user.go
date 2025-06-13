package service

import (
	"github.com/dino04corp/gallery-api/internal/user/model"
	"github.com/dino04corp/gallery-api/internal/user/repository"
)

type UserService struct {
	repo *repository.UserRepo
}

func NewUserService(r *repository.UserRepo) *UserService {
	return &UserService{repo: r}
}

func (s *UserService) Create(user *model.User) error {
	return s.repo.Create(user)
}

func (s *UserService) GetAll() ([]model.User, error) {
	return s.repo.GetAll()
}
