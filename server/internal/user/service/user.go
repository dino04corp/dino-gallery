package service

import (
	"strconv"

	"github.com/dino04corp/gallery-api/internal/user/model"
	"github.com/dino04corp/gallery-api/internal/user/repository"
)

type UserService interface {
	CreateUser(user *model.User) error
	ListUsers() ([]model.User, error)
	GetUserByID(id string) (*model.User, error)
	UpdateUser(id string, update *model.User) error
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

func (s *userService) GetUserByID(id string) (*model.User, error) {
	_id, _ := strconv.Atoi(id)
	return s.repo.FindByID(_id)
}

func (s *userService) UpdateUser(id string, update *model.User) error {
	_id, _ := strconv.Atoi(id)
	user, err := s.repo.FindByID(_id)
	if err != nil {
		return err
	}

	user.Name = update.Name
	user.Email = update.Email
	user.Username = update.Username
	return s.repo.Update(user)
}

func (s *userService) DeleteUser(id string) error {
	return s.repo.Delete(id)
}
