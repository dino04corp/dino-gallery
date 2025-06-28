package model

type User struct {
	ID       int    `gorm:"primaryKey" json:"id"`
	Name     string `gorm:"type:varchar(100)" json:"name"`
	Username string `gorm:"type:varchar(100)" json:"username"`
	Email    string `gorm:"uniqueIndex" json:"email"`                    // Unique email address
	Role     string `gorm:"type:varchar(50);default:'user'" json:"role"` // e.g., 'admin', 'user', etc.
	Password string `gorm:"type:varchar(255)" json:"password"`           // Store hashed password
	IsActive bool   `gorm:"default:true" json:"is_active"`               // Active status of the user
}
