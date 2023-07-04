package aggregation

import (
	"github.com/0xERR0R/meterNG/internal/model"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestOneReadingsShouldReturnEmptyAggregationResult(t *testing.T) {
	result, _ := AggregateMonth([]model.Reading{
		{
			Date:  date("2015-01-11"),
			Value: decimal.NewFromFloat(1000),
		},
	})

	assert.Len(t, result, 0, "result should be empty")
}

func TestSingleMonthResult(t *testing.T) {
	result, _ := AggregateMonth([]model.Reading{
		{
			Date:    date("2016-01-01"),
			Value:   decimal.NewFromFloat(1200),
			MeterId: "Electricity",
		},
		{
			Date:    date("2016-01-10"),
			Value:   decimal.NewFromFloat(1250),
			MeterId: "Electricity",
		},
		{
			Date:    date("2016-01-20"),
			Value:   decimal.NewFromFloat(1300),
			MeterId: "Electricity",
		},
	})

	assert.Len(t, result, 1, "result should have only one month")
	assert.Equal(t, 1, result[0].Month)
	assert.Equal(t, 2016, result[0].Year)
	val, _ := result[0].Value.Float64()
	assert.InDelta(t, float64(160), val, 0.05)
}

func TestAggregationShouldBePossibleOnlyForOneMeter(t *testing.T) {
	result, err := AggregateMonth([]model.Reading{
		{
			Date:    date("2016-01-01"),
			Value:   decimal.NewFromFloat(1200),
			MeterId: "Electricity",
		},
		{
			Date:    date("2016-01-10"),
			Value:   decimal.NewFromFloat(1250),
			MeterId: "Water",
		},
	})

	assert.Error(t, err)
	assert.Nil(t, result)
}

func TestSingleMonthWithDateFromOtherMonthsResult(t *testing.T) {
	result, _ := AggregateMonth([]model.Reading{
		{
			Date:    date("2015-12-25"),
			Value:   decimal.NewFromFloat(1100),
			MeterId: "Electricity",
		},
		{
			Date:    date("2016-01-01"),
			Value:   decimal.NewFromFloat(1200),
			MeterId: "Electricity",
		},
		{
			Date:    date("2016-01-10"),
			Value:   decimal.NewFromFloat(1250),
			MeterId: "Electricity",
		},
		{
			Date:    date("2016-01-20"),
			Value:   decimal.NewFromFloat(1300),
			MeterId: "Electricity",
		},
		{
			Date:    date("2016-02-02"),
			Value:   decimal.NewFromFloat(1400),
			MeterId: "Electricity",
		},
	})

	assert.Len(t, result, 3)
	assert.Equal(t, 1, result[1].Month)
	assert.Equal(t, 2016, result[1].Year)
	val, _ := result[1].Value.Float64()
	assert.InDelta(t, 192.58, val, 0.5)
}

func TestAggregateYearResult(t *testing.T) {
	result, _ := AggregateYear([]model.Reading{
		{
			Date:    date("2016-01-01"),
			Value:   decimal.NewFromFloat(1200),
			MeterId: "Electricity",
		},
		{
			Date:    date("2016-03-10"),
			Value:   decimal.NewFromFloat(1450),
			MeterId: "Electricity",
		},
		{
			Date:    date("2016-01-10"),
			Value:   decimal.NewFromFloat(1250),
			MeterId: "Electricity",
		},
		{
			Date:    date("2016-06-20"),
			Value:   decimal.NewFromFloat(1700),
			MeterId: "Electricity",
		},
		{
			Date:    date("2016-12-02"),
			Value:   decimal.NewFromFloat(2400),
			MeterId: "Electricity",
		},
	})
	assert.Len(t, result, 1)
	assert.Equal(t, 2016, result[0].Year)
	val, _ := result[0].Value.Float64()
	assert.InDelta(t, 1327.33, val, 0.5)
}
