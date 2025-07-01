package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	storageRepo "github.com/dino04corp/gallery-api/internal/storage/repository"
	"github.com/dino04corp/gallery-api/internal/upload/dto"
	"github.com/dino04corp/gallery-api/pkg/constant"
)

// UploadService defines the interface for upload services.
type UploadService interface {
	Upload(id string, uploadFile *dto.UploadFile) (string, error)
}

// uploadService implements the UploadService interface.
type uploadService struct {
	// upload  uploadRepo.UploadRepo
	storage storageRepo.StorageRepo
}

// NewUploadService creates a new instance of uploadService.
func NewUploadService(storageRepo storageRepo.StorageRepo) UploadService {
	return &uploadService{
		// upload:  uploadRepo.UploadRepo,
		storage: storageRepo,
	}
}

type CloudinaryConfig struct {
	CloudName string `json:"cloud_name"`
	APIKey    string `json:"api_key"`
	APISecret string `json:"api_secret"`
}

// Upload handles the file upload logic.
func (s *uploadService) Upload(id string, uploadFile *dto.UploadFile) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	storage, err := s.storage.FindByID(id)
	if err != nil {
		return "", fmt.Errorf("Storage dont exists!")
	}

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
		//create cloudinary instance
		cld, err := cloudinary.NewFromParams(cldCfg.CloudName, cldCfg.APIKey, cldCfg.APISecret)
		if err != nil {
			return "", err
		}
		//upload file
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

	return "", nil
}
