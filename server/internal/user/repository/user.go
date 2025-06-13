package repository

import (
	"gorm.io/gorm"
    
	"github.com/dino04corp/gallery-api/internal/user/model"
)

type UserRepo struct {
    db *gorm.DB
}

func NewUserRepo(db *gorm.DB) *UserRepo {
    return &UserRepo{db}
}

func (r *UserRepo) Create(user *model.User) error {
    return r.db.Create(user).Error
}

func (r *UserRepo) GetAll() ([]model.User, error) {
    var users []model.User
    err := r.db.Find(&users).Error
    return users, err
}
