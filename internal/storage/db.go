package storage

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"log"
	"meter-go/internal/model"
	"time"
)

// InitDB creates and migrates the database
func InitDB() (*gorm.DB, error) {
	retryCount := 5
	var err error
	for retryCount > 0 {
		db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
		if err != nil {
			log.Printf("connection error, retry again (attempt %d)...", retryCount)
			time.Sleep(3 * time.Second)
			retryCount--
			continue
		} else {
			db.AutoMigrate(&model.Reading{})
			log.Printf("✓ connected to database")
			return db, nil
		}
	}
	return nil, err
}
