package storage

import (
	"log"

	"github.com/0xERR0R/meterNG/internal/model"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

// InitDB creates and migrates the database
func InitDB() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("/data/meterng.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	db.AutoMigrate(&model.Reading{})
	log.Printf("✓ connected to database")
	return db, nil
}
