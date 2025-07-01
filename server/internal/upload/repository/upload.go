package repository

import (
	"context"
	"mime/multipart"

	"github.com/dino04corp/gallery-api/internal/upload/model"
	"gorm.io/gorm"
)

// UploadRepository defines the interface for upload repositories.
type UploadRepository interface {
	Upload(ctx context.Context, file *multipart.FileHeader) (model.Upload, error)
}

// uploadRepository implements the UploadRepository interface.
type uploadRepository struct {
	db *gorm.DB
}

// NewUploadRepo creates a new instance of uploadRepository.
func NewUploadRepo(db *gorm.DB) UploadRepository {
	return &uploadRepository{
		db: db,
	}
}

// Upload saves the uploaded file to the database.
func (r *uploadRepository) Upload(ctx context.Context, file *multipart.FileHeader) (model.Upload, error) {
	// Use the GORM DB to create the file record in the database.
	if err := r.db.WithContext(ctx).Create(&file).Error; err != nil {
		return model.Upload{}, err
	}

	// Return the created file record.
	return model.Upload{}, nil
}
