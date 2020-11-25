package storage

import (
	"bufio"
	"bytes"
	"encoding/csv"
	"gorm.io/gorm"
	"log"
	"meter-go/internal/model"
	"time"
)

// NewUserStorage initializes the storage
func New(db *gorm.DB) *ReadingRepository {
	return &ReadingRepository{db}
}

// UserStorage stores all users
type ReadingRepository struct {
	db *gorm.DB
}

type ReadingsLastDateLoader interface {
	GetReadingsLastDate(meterIds []string) (time.Time, error)
}

// GetByMeterId returns all readings for this meter
func (s *ReadingRepository) GetReadingsByMeterId(meterIds []string) ([]model.Reading, error) {
	var result []model.Reading

	s.db.Order("date").Where("meter_Id in (?)", meterIds).Find(&result)
	if s.db.Error != nil {
		return nil, s.db.Error
	}

	return result, nil
}

func (s *ReadingRepository) GetReadings() ([]model.Reading, error) {
	var result []model.Reading

	s.db.Order("date").Find(&result)
	if s.db.Error != nil {
		return nil, s.db.Error
	}

	return result, nil
}

func (s *ReadingRepository) GetReadingsLastDate(meterIds []string) (time.Time, error) {
	var max time.Time
	db := s.db.Table("readings").Select("date").Order("date DESC").Limit(1)
	if len(meterIds) > 0 {
		db.Where("meter_Id in (?)", meterIds)
	}
	row := db.Row()
	if s.db.Error != nil {
		return time.Time{}, s.db.Error
	}
	if err := row.Scan(&max); err != nil {
		return time.Time{}, err
	}
	return max, nil
}

func (s *ReadingRepository) StoreReadings(readings []model.Reading) error {
	tx := s.db.Begin()

	for _, reading := range readings {
		if err := tx.Create(&reading).Error; err != nil {
			log.Print(err)
			tx.Rollback()
			return err
		}
	}

	if s.db.Error != nil {
		tx.Rollback()
		return s.db.Error
	}

	return tx.Commit().Error
}

func (s *ReadingRepository) DeleteReadings(id int) error {
	var result model.Reading

	s.db.Where("id = ?", id).First(&result)
	if s.db.Error != nil {
		log.Print("can't find reading with id: ", id)
		return s.db.Error
	}
	s.db.Delete(result)
	return s.db.Error
}

func (s *ReadingRepository) DeleteAllReadings() error {
	s.db.Where("1=1").Delete(&model.Reading{})
	return s.db.Error
}

func (s *ReadingRepository) GetAsCSVFile() ([]byte, string, error) {
	fileName := time.Now().Format("2006-01-02") + ".csv"
	readings, err := s.GetReadings()
	if err != nil {
		return nil, "", err
	} else {
		var b bytes.Buffer
		w := bufio.NewWriter(&b)
		csvWriter := csv.NewWriter(w)
		csvWriter.Comma = ';'
		for _, reading := range readings {
			if err := csvWriter.Write(reading.ToCsv()); err != nil {
				return nil, "", err
			}
		}
		csvWriter.Flush()

		return b.Bytes(), fileName, nil
	}
}
