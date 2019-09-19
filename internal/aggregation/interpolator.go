package aggregation

import (
	"errors"
	"github.com/shopspring/decimal"
	"meter-go/internal/model"
	"sort"
	"time"
)

type Interpolator struct {
	x, y       []float64
	minX, maxX float64
}

//  Calculates a reading value on a arbitrary date using linear interpolation.
func NewInterpolator(readings []model.Reading) (*Interpolator, error) {

	if len(readings) < 2 {
		return nil, errors.New("interpolation calculation needs at least two values")
	}

	measures := filter(readings, model.MEASURE)
	offsets := filter(readings, model.OFFSET)

	// sort readings by date
	sort.SliceStable(measures, func(i, j int) bool {
		return measures[i].Date.Before(measures[j].Date)
	})
	sort.SliceStable(offsets, func(i, j int) bool {
		return offsets[i].Date.Before(offsets[j].Date)
	})

	x := make([]float64, len(measures))
	y := make([]float64, len(measures))

	for idx, reading := range measures {
		totalOffset := decimal.NewFromFloat(0)

		if idx-1 >= 0 {
			prevReading := measures[idx-1]
			valueSmallerThanPreviousReadingValue := prevReading.Value.GreaterThan(reading.Value)
			for _, offset := range offsets {
				if offset.Date.Before(reading.Date) || (offset.Date.Equal(reading.Date) && valueSmallerThanPreviousReadingValue) {
					totalOffset = totalOffset.Add(offset.Value)
				}
			}

		}

		x[idx] = float64(reading.Date.Unix())
		y[idx], _ = reading.Value.Add(totalOffset).Float64()
	}

	return &Interpolator{
		x:    x,
		y:    y,
		minX: x[0],
		maxX: x[len(measures)-1]}, nil
}

func filter(readings []model.Reading, readingType model.ReadingType) []model.Reading {
	result := make([]model.Reading, 0)
	for _, v := range readings {
		if v.Type == readingType {
			result = append(result, v)
		}
	}
	return result
}

func (ipl *Interpolator) GetValue(date time.Time) decimal.Decimal {
	xVal := float64(date.Unix())
	if xVal < ipl.minX {
		// extrapolation
		return ipl.interpolateBetween(xVal, 0, 1)
	}
	if xVal > ipl.maxX {
		// extrapolation
		return ipl.interpolateBetween(xVal, len(ipl.x)-2, len(ipl.x)-1)
	}

	for i := range ipl.x {
		if xVal == ipl.x[i] {
			return decimal.NewFromFloat(ipl.y[i])
		} else if xVal > ipl.x[i] && (i+1 <= len(ipl.x)) && xVal < ipl.x[i+1] {
			return ipl.interpolateBetween(xVal, i, i+1)
		}
	}
	return decimal.NewFromFloat32(0)
}

// interpolates value between two existing points
func (ipl *Interpolator) interpolateBetween(xVal float64, i int, j int) decimal.Decimal {
	m := (ipl.y[j] - ipl.y[i]) / (ipl.x[j] - ipl.x[i])
	result := ipl.y[i] + (m * (xVal - ipl.x[i]))
	return decimal.NewFromFloat(result)
}
