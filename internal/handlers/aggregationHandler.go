package handlers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"log"
	"meter-go/internal/aggregation"
	"meter-go/internal/model"
	"meter-go/internal/storage"

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
	params := mux.Vars(r)

	readings, err := repo.GetReadingsByMeterId([]string{params["meterId"]})
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
