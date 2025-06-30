package model

import (
	"time"

	"gorm.io/datatypes"
	"gorm.io/gorm"

	"github.com/dino04corp/gallery-api/pkg/constant"
)

type BaseModel struct {
	CreatedAt time.Time      `gorm:"column:created_at;autoCreateTime;<-:create" json:"created_at"`
	UpdatedAt time.Time      `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"column:deleted_at;index" json:"-"`
}

type Storage struct {
	ID       int                      `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Name     string                   `gorm:"column:name;type:varchar(255);not null;index" json:"name"`
	Provider constant.StorageProvider `gorm:"column:provider;type:varchar(255);not null" json:"provider"`
	Config   datatypes.JSONMap        `gorm:"column:config;type:jsonb" json:"config"` // Dành cho PostgreSQL
	BaseModel
}
