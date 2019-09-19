package storage

import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"log"
	"meter-go/internal/config"
	"meter-go/internal/model"
	"time"
)

// InitDB creates and migrates the database
func InitDB(dbConfig config.DbConfig) (*gorm.DB, error) {
	retryCount := 5
	var err error
	var db *gorm.DB
	for retryCount > 0 {
		db, err = gorm.Open(dbConfig.Dialect, dbConfig.Url)
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
