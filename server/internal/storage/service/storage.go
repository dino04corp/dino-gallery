package service

import (
	"github.com/dino04corp/gallery-api/internal/storage/dto"
	"github.com/dino04corp/gallery-api/internal/storage/repository"
)

// StorageService defines the interface for storage service operations.
type StorageService interface {
	CreateStorage(storage *dto.CreateStorageRequest) error
	ListStorages() ([]dto.StorageResponse, error)
	// FindByID(id int) (*model.Storage, error)
	// Update(storage *model.Storage) error
	// Delete(id int) error
}

// storageService implements the StorageService interface.
type storageService struct {
	repo repository.StorageRepo
}

// NewStorageService creates a new instance of storageService.
func NewStorageService(r repository.StorageRepo) StorageService {
	return &storageService{repo: r}
}

// Create inserts a new storage record into the database.
func (s *storageService) CreateStorage(storage *dto.CreateStorageRequest) error {
	newStorage := storage.ToModel()
	return s.repo.Create(newStorage)
}

// ListStorages retrieves all storage records from the database.
func (s *storageService) ListStorages() ([]dto.StorageResponse, error) {
	storages, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}

	var storageResponses []dto.StorageResponse
	for _, storage := range storages {
		storageResponses = append(storageResponses, *dto.ToResponse(&storage))
	}

	return storageResponses, nil
}
