package handler

import (
	"github.com/gin-gonic/gin"

	"github.com/dino04corp/gallery-api/internal/upload/service"
)

// UploadHandler defines the interface for upload handlers.
type UploadHandler interface {
	Upload(c *gin.Context)
}

// uploadHandler implements the UploadHandler interface.
type uploadHandler struct {
	service service.UploadService
}

// NewUploadHandler creates a new instance of uploadHandler.
func NewUploadHandler(service service.UploadService) UploadHandler {
	return &uploadHandler{service}
}

// Upload handles the file upload request.
func (h *uploadHandler) Upload(c *gin.Context) {
	// Extract the file from the request context.
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(400, gin.H{"error": "File is required"})
		return
	}

	// Call the service to handle the upload.
	uploadedFile, err := h.service.Upload(c.Request.Context(), file)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to upload file"})
		return
	}

	// Return the uploaded file information.
	c.JSON(200, gin.H{"file": uploadedFile})
}
