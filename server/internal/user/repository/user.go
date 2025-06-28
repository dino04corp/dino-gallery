package repository

import (
	"gorm.io/gorm"

	"github.com/dino04corp/gallery-api/internal/user/model"
)

type UserRepo interface {
	Create(user *model.User) error
	FindAll() ([]model.User, error)
	FindByID(id int) (*model.User, error)
	FindByUsername(username string) (*model.User, error)
	Update(user *model.User) error
	Delete(id string) error
}

type userRepo struct {
	db *gorm.DB
}

func NewUserRepo(db *gorm.DB) UserRepo {
	return &userRepo{db}
}

func (r *userRepo) Create(user *model.User) error {
	return r.db.Create(user).Error
}

func (r *userRepo) FindAll() ([]model.User, error) {
	var users []model.User
	err := r.db.Find(&users).Error
	return users, err
}

func (r *userRepo) FindByID(id int) (*model.User, error) {
	var user model.User
	if err := r.db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil

}

func (r *userRepo) FindByUsername(username string) (*model.User, error) {
	var user model.User
	if err := r.db.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepo) Update(user *model.User) error {
	return r.db.Save(user).Error
}

func (r *userRepo) Delete(id string) error {
	return r.db.Delete(&model.User{}, id).Error
}
