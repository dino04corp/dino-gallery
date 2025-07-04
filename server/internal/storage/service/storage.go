package service

import (
	"context"
	"encoding/json"
	"fmt"
	"reflect"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/dino04corp/gallery-api/internal/storage/dto"
	"github.com/dino04corp/gallery-api/internal/storage/model"
	"github.com/dino04corp/gallery-api/internal/storage/repository"
	"github.com/dino04corp/gallery-api/pkg/constant"
)

// StorageService defines the interface for storage service operations.
type StorageService interface {
	CreateStorage(storage *dto.CreateStorageRequest) error
	ListStorages() ([]dto.StorageResponse, error)
	GetStorage(id string) (*model.Storage, error)
	// Update(storage *model.Storage) error
	// Delete(id int) error
	PingStorage(id string) error
	Upload(id string, uploadFile *dto.UploadFile) (string, error)
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
func (s *storageService) GetStorage(id string) (*model.Storage, error) {
	storage, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return storage, nil
}

type CloudinaryConfig struct {
	CloudName string `json:"cloud_name"`
	APIKey    string `json:"api_key"`
	APISecret string `json:"api_secret"`
}

// PingStorage checks the connectivity of a storage service.
func (s *storageService) PingStorage(id string) error {
	storage, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	config := storage.Config

	// Here you would implement the logic to ping the storage service.
	// This is a placeholder for demonstration purposes.
	switch storage.Provider {
	case constant.Cloudinary:
		var cldCfg CloudinaryConfig
		configBytes, err := json.Marshal(config) // Vì datatypes.JSONMap là map[string]interface{}
		if err != nil {
			return fmt.Errorf("failed to marshal config: %w", err)
		}
		if err := json.Unmarshal(configBytes, &cldCfg); err != nil {
			return fmt.Errorf("invalid cloudinary config: %w", err)
		}
		// Simulate a ping to Cloudinary
		cld, err := cloudinary.NewFromParams(cldCfg.CloudName, cldCfg.APIKey, cldCfg.APISecret)
		if err != nil {
			return fmt.Errorf("failed to create Cloudinary client: %w", err)
		}
		_, err = cld.Admin.Ping(context.Background())
		if err != nil {
			return fmt.Errorf("failed to ping Cloudinary: %w", err)
		}
		return nil
	default:
		return fmt.Errorf("unsupported storage provider: %s", storage.Provider)
	}
}

// Upload handles the file upload logic.
func (s *storageService) Upload(id string, uploadFile *dto.UploadFile) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	storage, err := s.repo.FindByID(id)
	if err != nil {
		return "", fmt.Errorf("storage dont exists")
	}

	fmt.Println("storage ", storage.Provider)

	switch storage.Provider {
	case constant.Cloudinary:
		var cldCfg CloudinaryConfig
		configBytes, err := json.Marshal(storage.Config)
		if err != nil {
			return "", fmt.Errorf("failed to marshal config: %w", err)
		}
		if err := json.Unmarshal(configBytes, &cldCfg); err != nil {
			return "", fmt.Errorf("invalid cloudinary config: %w", err)
		}
		// create cloudinary instance
		cld, err := cloudinary.NewFromParams(cldCfg.CloudName, cldCfg.APIKey, cldCfg.APISecret)
		if err != nil {
			return "", err
		}

		fmt.Printf("File: type %v size %d", reflect.TypeOf(uploadFile.File), uploadFile.File.Size)
		if uploadFile.File.Size > 0 {
			// upload file
			uploadParam, err := cld.Upload.Upload(ctx, uploadFile.File, uploader.UploadParams{Folder: "tesssst"})
			if err != nil {
				return "", err
			}
			// // Save metadata to the database.
			// uploadedFile, err := s.repo.Upload(ctx, file)
			// if err != nil {
			// 	return model.Upload{}, err
			// }
			return uploadParam.SecureURL, nil
		}
        return "", fmt.Errorf("empty file")
	default:
		return "", fmt.Errorf("unsupport provider %v", storage.Provider)
	}
}
