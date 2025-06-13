package model

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"type:varchar(100)"`
	Username string `gorm:"type:varchar(100)"`
	Email    string `gorm:"uniqueIndex"`
	Role     string `gorm:"type:varchar(50);default:'user'"` // e.g., 'admin', 'user', etc.
	Password string `gorm:"type:varchar(255)"`               // Store hashed password
	IsActive bool   `gorm:"default:true"`
}
