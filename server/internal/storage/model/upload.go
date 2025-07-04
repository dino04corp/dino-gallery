package model

const (
	UploadPending = "pending"
	UploadSuccess = "success"
	UploadFailed  = "failed"

	ResourceActive   = "active"
	ResourceArchived = "archived"
	ResourceDeleted  = "deleted"
)

type Upload struct {
	BaseModel

	// UserID *uint `gorm:"index" json:"user_id,omitempty"` // nếu có đăng nhập
	// User   *User `gorm:"foreignKey:UserID" json:"-"`

	Filename  string  `gorm:"type:varchar(255);not null" json:"filename"`       // tên file user cung cấp
	Status    string  `gorm:"type:varchar(50);default:'pending'" json:"status"` // pending, success, failed
	IPAddress string  `gorm:"type:varchar(45);" json:"ip_address"`              // optional
	ErrorMsg  *string `gorm:"type:text" json:"error_msg,omitempty"`             // nếu upload lỗi
	Source    *string `gorm:"type:varchar(255);" json:"source,omitempty"`       // UI, API, SDK...

	ResourceID *uint     `gorm:"index" json:"resource_id,omitempty"` // nếu upload thành công
	Resource   *Resource `gorm:"foreignKey:ResourceID" json:"resource,omitempty"`
}

type Resource struct {
	BaseModel

	Name       string `gorm:"type:varchar(255);not null;index" json:"name"`
	Type       string `gorm:"type:varchar(100);not null;index" json:"type"`         // MIME type
	Size       int64  `gorm:"not null" json:"size"`                                 // Byte size
	Hash       string `gorm:"type:char(64);uniqueIndex" json:"hash"`                // File hash (SHA256/MD5) để deduplicate
	Path       string `gorm:"type:varchar(512);not null" json:"path"`               // Đường dẫn trong storage (VD: S3 key)
	Storage    string `gorm:"type:varchar(50);default:'local'" json:"storage"`      // local, s3, gcs...
	Status     string `gorm:"type:varchar(50);default:'active'" json:"status"`      // active, deleted, archived
	Visibility string `gorm:"type:varchar(20);default:'private'" json:"visibility"` // public, private, protected
}
