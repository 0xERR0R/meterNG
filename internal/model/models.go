package model

import (
	"errors"
	"github.com/shopspring/decimal"
	"time"
)

type ReadingType int

const (
	MEASURE ReadingType = iota
	OFFSET
)

type Reading struct {
	ID      uint            `json:"id" gorm:"primary_key"`
	MeterId string          `json:"meterId"`
	Date    time.Time       `json:"date"`
	Value   decimal.Decimal `json:"value" sql:"type:decimal(10,3);"`
	Type    ReadingType     `json:"type"`
}

func (r *Reading) ToCsv() []string {
	return []string{r.MeterId, r.Date.Format("2006-01-02"), r.Value.String(), r.Type.ToString()}
}

func FromCsv(line []string) Reading {
	d, _ := time.Parse("2006-01-02", line[1])
	val, _ := decimal.NewFromString(line[2])
	readingType, _ := ToReadingType(line[3])

	reading := Reading{
		MeterId: line[0],
		Date:    d,
		Value:   val,
		Type:    readingType,
	}
	return reading
}

type Aggregation struct {
	Value            decimal.Decimal `json:"value"`
	NormalizedPerDay decimal.Decimal `json:"normalizedPerDay"`
	Month            int             `json:"month"`
	Year             int             `json:"year"`
}

type Meter struct {
	Name string `json:"name"`
	Unit string `json:"unit"`
}

func (r ReadingType) ToString() string {
	switch r {
	case MEASURE:
		return "MEASURE"
	}
	return "OFFSET"
}

func ToReadingType(s string) (ReadingType, error) {
	switch s {
	case "MEASURE":
		return MEASURE, nil
	case "OFFSET":
		return OFFSET, nil
	default:
		return -1, errors.New("unknown type " + s)

	}
}
