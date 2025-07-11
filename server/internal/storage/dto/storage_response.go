package dto

import (
	"gorm.io/datatypes"

	"github.com/dino04corp/gallery-api/internal/storage/model"
	"github.com/dino04corp/gallery-api/pkg/constant"
)

type CloudinaryConfig struct {
	CloudName string `json:"cloudName"`
	APIKey    string `json:"apiKey"`
	APISecret string `json:"apiSecret"`
}

// StorageResponse represents the response structure for storage data.
type StorageResponse struct {
	ID       int                      `json:"id"`
	Name     string                   `json:"name"`
	Provider constant.StorageProvider `json:"provider"`
	Config   datatypes.JSONMap        `json:"config"`
	IsActive bool                     `json:"isActive"`
}

// ToResponse converts a storage model to a StorageResponse DTO.
func ToResponse(storage *model.Storage) *StorageResponse {
	return &StorageResponse{
		ID:       storage.ID,
		Name:     storage.Name,
		Provider: storage.Provider,
		Config:   storage.Config,
		IsActive: storage.IsActive,
	}
}
