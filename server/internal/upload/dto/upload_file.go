package dto

import "mime/multipart"

type UploadFile struct {
	FileName string                `json:"file_name" binding:"required"`
	File     *multipart.FileHeader `json:"file" binding:"required"`
}
