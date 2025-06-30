package repository

import (
    "gorm.io/gorm"

    "github.com/dino04corp/gallery-api/internal/storage/model"
)

// StorageRepo defines the interface for storage repository operations.
type StorageRepo interface {
    Create(storage *model.Storage) error
    FindAll() ([]model.Storage, error)
    FindByID(id int) (*model.Storage, error)
    Update(storage *model.Storage) error
    Delete(id int) error
}
// storageRepo implements the StorageRepo interface.
type storageRepo struct {
    db *gorm.DB
}

// NewStorageRepo creates a new instance of storageRepo.
func NewStorageRepo(db *gorm.DB) StorageRepo {
    return &storageRepo{db}
}

// Create inserts a new storage record into the database.
func (r *storageRepo) Create(storage *model.Storage) error {
    return r.db.Create(storage).Error
}

// FindAll retrieves all storage records from the database.
func (r *storageRepo) FindAll() ([]model.Storage, error) {
    var storages []model.Storage
    err := r.db.Find(&storages).Error
    return storages, err
}

// FindByID retrieves a storage record by its ID.
func (r *storageRepo) FindByID(id int) (*model.Storage, error) {
    var storage model.Storage
    if err := r.db.Where("id = ?", id).First(&storage).Error; err != nil {
        return nil, err
    }
    return &storage, nil
}

// Update modifies an existing storage record in the database.
func (r *storageRepo) Update(storage *model.Storage) error {
    return r.db.Save(storage).Error
}

// Delete removes a storage record from the database by its ID.
func (r *storageRepo) Delete(id int) error {
    return r.db.Delete(&model.Storage{}, id).Error
}
