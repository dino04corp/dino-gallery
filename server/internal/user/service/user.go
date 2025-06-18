package service

import (
	"github.com/dino04corp/gallery-api/internal/user/model"
	"github.com/dino04corp/gallery-api/internal/user/repository"
)

type UserService interface {
	CreateUser(user *model.User) error
	ListUsers() ([]model.User, error)
	GetUserByID(id uint) (*model.User, error)
	UpdateUser(user *model.User) error
	DeleteUser(id string) error
}

type userService struct {
	repo repository.UserRepo
}

func NewUserService(r repository.UserRepo) UserService {
	return &userService{repo: r}
}

func (s *userService) CreateUser(user *model.User) error {
	return s.repo.Create(user)
}

func (s *userService) ListUsers() ([]model.User, error) {
	return s.repo.FindAll()
}

func (s *userService) GetUserByID(id uint) (*model.User, error) {
	return s.repo.FindByID(id)
}

func (s *userService) UpdateUser(user *model.User) error {
	return s.repo.Update(user)
}

func (s *userService) DeleteUser(id string) error {
	return s.repo.Delete(id)
}
