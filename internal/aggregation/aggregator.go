package aggregation

import (
	"errors"
	"meter-go/internal/model"
	"sort"
	"time"
)

type dayOfPeriod func(t time.Time) time.Time
type nextStep func(t time.Time) time.Time

func AggregateYear(readings []model.Reading) ([]model.Aggregation, error) {
	return aggregate(readings, firstDayOfYear, lastDayOfYear, nextYear)
}
func AggregateMonth(readings []model.Reading) ([]model.Aggregation, error) {
	return aggregate(readings, firstDayOfMonth, lastDayOfMonth, nextMonth)
}

func aggregate(readings []model.Reading, fnStart dayOfPeriod, fnEnd dayOfPeriod, fnNextStep nextStep) ([]model.Aggregation, error) {

	if err := checkInput(readings); err != nil {
		return nil, err
	}

	result := make([]model.Aggregation, 0)

	if len(readings) < 2 {
		return result, nil
	}

	if interpolator, err := NewInterpolator(readings); err == nil {
		// sort readings by date
		sort.SliceStable(readings, func(i, j int) bool {
			return readings[i].Date.Before(readings[j].Date)
		})

		firstDate := readings[0].Date
		lastDate := readings[len(readings)-1].Date
		date := fnStart(firstDate)

		for {
			startOfMonth := fnStart(date)
			endOfMonth := fnEnd(date)

			v1 := interpolator.GetValue(startOfMonth)
			v2 := interpolator.GetValue(endOfMonth)

			aggregation := model.Aggregation{
				Month: int(startOfMonth.Month()),
				Year:  startOfMonth.Year(),
				Value: v2.Sub(v1).Round(2),
			}

			result = append(result, aggregation)

			date = fnNextStep(date)
			if date.After(lastDate) {
				break
			}
		}
		return result, nil

	}
	return nil, nil
}

func checkInput(readings []model.Reading) error {
	m := make(map[string]bool)
	for _, reading := range readings {
		m[reading.MeterId] = true
	}
	if len(m) > 1 {
		return errors.New("only readings of one meter cat be aggregated")
	}
	return nil
}

func firstDayOfMonth(t time.Time) time.Time {
	return time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, time.Local)
}

func lastDayOfMonth(t time.Time) time.Time {
	firstOfMonthEndOfDay := time.Date(t.Year(), t.Month(), 1, 23, 59, 59, 0, time.Local)
	return firstOfMonthEndOfDay.AddDate(0, 1, -1)
}

func firstDayOfYear(t time.Time) time.Time {
	return time.Date(t.Year(), 1, 1, 0, 0, 0, 0, time.Local)
}

func lastDayOfYear(t time.Time) time.Time {
	return time.Date(t.Year(), 12, 31, 23, 59, 59, 0, time.Local)
}

func nextMonth(t time.Time) time.Time {
	return t.AddDate(0, 1, 0)
}
func nextYear(t time.Time) time.Time {
	return t.AddDate(1, 0, 0)
}
