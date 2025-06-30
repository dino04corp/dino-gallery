package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/dino04corp/gallery-api/internal/storage/dto"
	"github.com/dino04corp/gallery-api/internal/storage/service"
	"github.com/dino04corp/gallery-api/pkg/constant"
)

type StorageHandler struct {
	svc service.StorageService
}

func NewStorageHandler(s service.StorageService) *StorageHandler {
	return &StorageHandler{svc: s}
}

var storage_options = []constant.StorageOption{
	{
		Provider:            constant.Cloudinary,
		ProviderDisplayName: "Cloudinary",
		ProviderDescription: "Cloudinary is a cloud-based image and video management service that provides a comprehensive solution for storing, transforming, and delivering media assets.",
		ConfigDescription:   "Cloudinary configuration options",
	},
}

func (h *StorageHandler) GetStorageOptions(c *gin.Context) {
	c.JSON(http.StatusOK, storage_options)
}

func (h *StorageHandler) CreateStorage(c *gin.Context) {
	var storageRequest dto.CreateStorageRequest
	if err := c.ShouldBindJSON(&storageRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.svc.CreateStorage(&storageRequest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create storage"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Storage created successfully"})
}
