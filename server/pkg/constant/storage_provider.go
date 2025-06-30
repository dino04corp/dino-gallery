package constant // hoặc package shared

type StorageProvider string

const (
	Cloudinary StorageProvider = "cloudinary"
	Local      StorageProvider = "local"
)

type StorageOption struct {
	Provider            StorageProvider        `json:"provider"`
	ProviderDisplayName string                 `json:"provider_display_name"`
	ProviderDescription string                 `json:"provider_description"`
	DefaultConfig       map[string]interface{} `json:"default_config"`
	ConfigDescription   string                 `json:"config_description"`
}
