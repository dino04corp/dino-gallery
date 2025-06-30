package service

import (
	"strconv"

	"github.com/dino04corp/gallery-api/internal/storage/dto"
	"github.com/dino04corp/gallery-api/internal/storage/model"
	"github.com/dino04corp/gallery-api/internal/storage/repository"
	"github.com/dino04corp/gallery-api/pkg/constant"
)

// StorageService defines the interface for storage service operations.
type StorageService interface {
	CreateStorage(storage *dto.CreateStorageRequest) error
	ListStorages() ([]dto.StorageResponse, error)
	GetStorage(id int) (*model.Storage, error)
	// Update(storage *model.Storage) error
	// Delete(id int) error
	PingStorage(id string) error
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

// GetStorage retrieves a storage record by its ID.
func (s *storageService) GetStorage(id int) (*model.Storage, error) {
	storage, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return storage, nil
}

// PingStorage checks the connectivity of a storage service.
func (s *storageService) PingStorage(id string) error {
	_id, _ := strconv.Atoi(id)
	storage, err := s.repo.FindByID(_id)
	if err != nil {
		return err
	}

	// Here you would implement the logic to ping the storage service.
	// This is a placeholder for demonstration purposes.
	switch storage.Provider {
	case constant.Cloudinary:
		// {
		// 	// Simulate a successful ping for Cloudinary
		// 	service := cloudinary.New(req.CloudName, req.APIKey, req.APISecret)

		// 	message, err := service.Ping()
		// 	if err != nil {
		// 		return err
		// 	}
		// 	return nil
		// }
	default:
		return nil
	}
	return nil
}
