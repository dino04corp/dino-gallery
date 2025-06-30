package dto

import (
	"github.com/dino04corp/gallery-api/internal/storage/model"
	"github.com/dino04corp/gallery-api/pkg/constant"
	"gorm.io/datatypes"
)

// CreateStorageRequest represents the request payload for creating a new storage.
type CreateStorageRequest struct {
	Name     string                   `json:"name" binding:"required"`
	Provider constant.StorageProvider `json:"provider" binding:"required"`
	Config   map[string]any           `json:"config" binding:"required"` // hoặc không bắt buộc nếu muốn
}

// ToModel chuyển DTO thành model lưu DB
func (r *CreateStorageRequest) ToModel() *model.Storage {
	return &model.Storage{
		Name:     r.Name,
		Provider: r.Provider,
		Config:   datatypes.JSONMap(r.Config),
	}
}
