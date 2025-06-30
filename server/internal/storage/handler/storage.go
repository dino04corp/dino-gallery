package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type StorageHandler struct {
}

func NewStorageHandler() *StorageHandler {
	return &StorageHandler{}
}

type StorageOption struct {
	Provider            string                 `json:"provider"`
	ProviderDisplayName string                 `json:"provider_display_name"`
	ProviderDescription string                 `json:"provider_description"`
	DefaultConfig       map[string]interface{} `json:"default_config"`
	ConfigDescription   string                 `json:"config_description"`
}

var storage_options = []StorageOption{
	{
		Provider:            "cloudinary",
		ProviderDisplayName: "Cloudinary",
		ProviderDescription: "Cloudinary is a cloud-based image and video management service that provides a comprehensive solution for storing, transforming, and delivering media assets.",
		DefaultConfig:       map[string]interface{}{},
		ConfigDescription:   "Cloudinary configuration options",
	},
}

func (h *StorageHandler) GetStorageOptions(c *gin.Context) {
	c.JSON(http.StatusOK, storage_options)
}
