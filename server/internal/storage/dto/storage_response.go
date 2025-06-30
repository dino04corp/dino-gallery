package dto

import (
	"gorm.io/datatypes"

	"github.com/dino04corp/gallery-api/internal/storage/model"
	"github.com/dino04corp/gallery-api/pkg/constant"
)

// StorageResponse represents the response structure for storage data.
type StorageResponse struct {
	ID       int                      `json:"id"`
	Name     string                   `json:"name"`
	Provider constant.StorageProvider `json:"provider"`
	Config   datatypes.JSONMap        `json:"config"` // Dành cho PostgreSQL
}

// ToResponse converts a storage model to a StorageResponse DTO.
func ToResponse(storage *model.Storage) *StorageResponse {
	return &StorageResponse{
		ID:       storage.ID,
		Name:     storage.Name,
		Provider: storage.Provider,
		Config:   storage.Config,
	}
}
