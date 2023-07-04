package handlers

import (
	"encoding/json"
	"github.com/0xERR0R/meterNG/internal/aggregation"
	"github.com/0xERR0R/meterNG/internal/model"
	"github.com/0xERR0R/meterNG/internal/storage"
	"github.com/gorilla/mux"
	"log"

	"net/http"
)

type AggregationHandler struct {
	repo *storage.ReadingRepository
}

func NewAggregationHandler(repo *storage.ReadingRepository) *AggregationHandler {
	return &AggregationHandler{repo}
}

func (h *AggregationHandler) GetAggregationsYear(w http.ResponseWriter, r *http.Request) {
	getAggregationsInternal(w, r, aggregation.AggregateYear, h.repo)
}
func (h *AggregationHandler) GetAggregationsMonth(w http.ResponseWriter, r *http.Request) {
	getAggregationsInternal(w, r, aggregation.AggregateMonth, h.repo)
}

type aggFn func(readings []model.Reading) ([]model.Aggregation, error)

func getAggregationsInternal(w http.ResponseWriter, r *http.Request, fnAgg aggFn, repo *storage.ReadingRepository) {
	w.Header().Set("Content-Type", "application/json")
	var readings []model.Reading
	var err error
	params := mux.Vars(r)

	meterIDs := r.URL.Query()["meter"]
	years := r.URL.Query()["years"]

	if len(years) > 0 {
		readings, err = repo.GetReadingsByMeterIdAndYears(meterIDs, years)
	} else {
		readings, err = repo.GetReadingsByMeterId(meterIDs)
	}

	if err != nil {
		log.Println("can't load readings for meter ", params["meterId"])
		w.WriteHeader(http.StatusBadRequest)
	} else {
		aggregations, err := fnAgg(readings)
		if err != nil {
			log.Println("can't calculate aggregations", err)
			w.WriteHeader(http.StatusBadRequest)
		} else {
			content, _ := json.Marshal(aggregations)
			w.Write(content)
		}
	}
}
