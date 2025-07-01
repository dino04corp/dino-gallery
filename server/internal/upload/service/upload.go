package service

import (
	"context"
	"mime/multipart"

	"github.com/dino04corp/gallery-api/internal/upload/model"
	"github.com/dino04corp/gallery-api/internal/upload/repository"
)

// UploadService defines the interface for upload services.
type UploadService interface {
	Upload(ctx context.Context, file *multipart.FileHeader) (model.Upload, error)
}

// uploadService implements the UploadService interface.
type uploadService struct {
	repo repository.UploadRepository
}

// NewUploadService creates a new instance of uploadService.
func NewUploadService(repo repository.UploadRepository) UploadService {
	return &uploadService{
		repo: repo,
	}
}

// Upload handles the file upload logic.
func (s *uploadService) Upload(ctx context.Context, file *multipart.FileHeader) (model.Upload, error) {
	// Call the repository to save the file.
	uploadedFile, err := s.repo.Upload(ctx, file)
	if err != nil {
		return model.Upload{}, err
	}

	// Return the uploaded file information.
	return uploadedFile, nil
}
