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

func (h *StorageHandler) ListStorages(c *gin.Context) {
	storages, err := h.svc.ListStorages()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve storages"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": storages})
}

func (h *StorageHandler) PingStorage(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Storage ID is required"})
		return
	}

	err := h.svc.PingStorage(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   gin.H{"code": "PING_FAILED", "message": err.Error()},
			"success": false,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Ping successful",
		"success": true,
	})
}

// Upload handles the file upload request.
func (h *StorageHandler) UploadStorage(c *gin.Context) {
	id := c.Param("id")
	// Extract the file from the request context.
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(400, gin.H{"error": "File is required"})
		return
	}

	// Call the service to handle the upload.
	uploadedFile, err := h.svc.Upload(
		id,
		&dto.UploadFile{
			FileName: file.Filename,
			File:     file,
		})
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to upload file" + err.Error()})
		return
	}

	// Return the uploaded file information.
	c.JSON(200, gin.H{"file": uploadedFile})
}
