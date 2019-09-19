package aggregation

import (
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"meter-go/internal/model"
	"testing"
	"time"
)

func TestWithWrongParameterLength(t *testing.T) {
	_, err := NewInterpolator([]model.Reading{})

	assert.Error(t, err, "should return error")
}

func TestExtrapolationLower(t *testing.T) {
	interpolator, err := NewInterpolator([]model.Reading{
		{
			Date:  date("2015-01-11"),
			Value: decimal.NewFromFloat(1000),
		},
		{
			Date:  date("2015-01-13"),
			Value: decimal.NewFromFloat(1200),
		},
		{
			Date:  date("2015-01-15"),
			Value: decimal.NewFromFloat(1400),
		},
	})

	assert.NoError(t, err, "should not return error")

	assert.Equal(t, decimal.NewFromFloat(900), interpolator.GetValue(date("2015-01-10")), "wrong result")

}

func TestExtrapolationHigher(t *testing.T) {
	interpolator, err := NewInterpolator([]model.Reading{
		{
			Date:  date("2015-01-11"),
			Value: decimal.NewFromFloat(1000),
		},
		{
			Date:  date("2015-01-13"),
			Value: decimal.NewFromFloat(1200),
		},
		{
			Date:  date("2015-01-15"),
			Value: decimal.NewFromFloat(1400),
		},
	})

	assert.NoError(t, err, "should not return error")

	assert.Equal(t, decimal.NewFromFloat(1500), interpolator.GetValue(date("2015-01-16")), "wrong result")
}

func TestInterpolationBetweenTwoPoints(t *testing.T) {
	interpolator, err := NewInterpolator([]model.Reading{
		{
			Date:  date("2015-01-01"),
			Value: decimal.NewFromFloat(1000),
		},
		{
			Date:  date("2015-01-05"),
			Value: decimal.NewFromFloat(1400),
		},
		{
			Date:  date("2015-01-03"),
			Value: decimal.NewFromFloat(1200),
		},
	})

	assert.NoError(t, err, "should not return error")
	assert.Equal(t, decimal.NewFromFloat(1100), interpolator.GetValue(date("2015-01-02")), "wrong result")
	assert.Equal(t, decimal.NewFromFloat(1300), interpolator.GetValue(date("2015-01-04")), "wrong result")
}

func TestValueEqualsPointValue(t *testing.T) {
	interpolator, err := NewInterpolator([]model.Reading{
		{
			Date:  date("2015-01-01"),
			Value: decimal.NewFromFloat(1000),
		},
		{
			Date:  date("2015-01-03"),
			Value: decimal.NewFromFloat(1200),
		},
	})

	assert.NoError(t, err, "should not return error")
	assert.Equal(t, decimal.NewFromFloat(1000), interpolator.GetValue(date("2015-01-01")), "wrong result")
	assert.Equal(t, decimal.NewFromFloat(1200), interpolator.GetValue(date("2015-01-03")), "wrong result")
}

func TestInterpolationWithOffset(t *testing.T) {
	interpolator, err := NewInterpolator([]model.Reading{
		{
			Date:  date("2015-01-01"),
			Value: decimal.NewFromFloat(1000),
		},
		{
			Date:  date("2015-01-02"),
			Value: decimal.NewFromFloat(1000),
			Type:  model.OFFSET,
		},
		{
			Date:  date("2015-01-03"),
			Value: decimal.NewFromFloat(200),
		},
		{
			Date:  date("015-01-05"),
			Value: decimal.NewFromFloat(400),
		},
	})
	assert.NoError(t, err)
	assert.Equal(t, decimal.NewFromFloat(1100), interpolator.GetValue(date("2015-01-02")))
	assert.Equal(t, decimal.NewFromFloat(1300), interpolator.GetValue(date("2015-01-04")))

}

func TestInterpolationWithOffsetSameDayAsReading(t *testing.T) {
	interpolator, err := NewInterpolator([]model.Reading{
		{
			Date:  date("2015-01-01"),
			Value: decimal.NewFromFloat(1000),
		},
		{
			Date:  date("2015-01-01"),
			Value: decimal.NewFromFloat(500),
			Type:  model.OFFSET,
		},
		{
			Date:  date("2015-01-03"),
			Value: decimal.NewFromFloat(500),
			Type:  model.OFFSET,
		},
		{
			Date:  date("2015-01-03"),
			Value: decimal.NewFromFloat(200),
		},
		{
			Date:  date("015-01-05"),
			Value: decimal.NewFromFloat(400),
		},
	})

	assert.NoError(t, err)
	assert.Equal(t, decimal.NewFromFloat(1100), interpolator.GetValue(date("2015-01-02")))
	assert.Equal(t, decimal.NewFromFloat(1300), interpolator.GetValue(date("2015-01-04")))
}

func date(s string) time.Time {
	date, _ := time.Parse("2006-01-02", s)
	return date
}
