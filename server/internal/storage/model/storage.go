package model

import (
	"time"

	"gorm.io/datatypes"
	"gorm.io/gorm"

	"github.com/dino04corp/gallery-api/pkg/constant"
)

type BaseModel struct {
	ID        int            `gorm:"primaryKey;autoIncrement"`
	CreatedAt time.Time      `gorm:"column:created_at;autoCreateTime;<-:create"`
	UpdatedAt time.Time      `gorm:"column:updated_at;autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"column:deleted_at;index"`
}

type Storage struct {
	Name     string                   `gorm:"column:name;type:varchar(255);not null;index"`
	Provider constant.StorageProvider `gorm:"column:provider;type:varchar(255);not null"`
	Config   datatypes.JSONMap        `gorm:"column:config;type:jsonb"`
	IsActive bool                     `gorm:"column:is_active;default:true"`
    LastSync time.Time
	BaseModel
}
