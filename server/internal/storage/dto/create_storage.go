package dto

import (
	"github.com/dino04corp/gallery-api/internal/storage/model"
	"github.com/dino04corp/gallery-api/pkg/constant"
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"gorm.io/datatypes"
)

// CreateStorageRequest represents the request payload for creating a new storage.
type CreateStorageRequest struct {
	Name     string                   `json:"name"`
	Provider constant.StorageProvider `json:"provider"`
	Config   map[string]any           `json:"config"`
}

// ToModel chuyển DTO thành model lưu DB
func (r *CreateStorageRequest) ToModel() *model.Storage {
	return &model.Storage{
		Name:     r.Name,
		Provider: r.Provider,
		Config:   datatypes.JSONMap(r.Config),
	}
}

func (r CreateStorageRequest) Validate() error {
	return validation.ValidateStruct(&r,
		validation.Field(&r.Name, validation.Required),
		validation.Field(&r.Provider, validation.Required),
		validation.Field(&r.Config, validation.When(
			r.Provider == constant.Cloudinary,
			validation.Required.Error("config is required for Cloudinary"),
			validation.Map(
				validation.Key("cloudName", validation.Required.Error("cloud_name is required for Cloudinary")),
				validation.Key("apiKey", validation.Required.Error("api_key is required for Cloudinary")),
				validation.Key("apiSecret", validation.Required.Error("api_secret is required for Cloudinary")),
			),
		)),
	)
}
