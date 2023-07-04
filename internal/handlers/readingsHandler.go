package handlers

import (
	"encoding/json"
	"github.com/0xERR0R/meterNG/internal/config"
	"github.com/0xERR0R/meterNG/internal/model"
	"github.com/0xERR0R/meterNG/internal/storage"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
)

type ReadingHandler struct {
	repo   *storage.ReadingRepository
	meters []model.Meter
}

func NewReadingHandler(repo *storage.ReadingRepository, configuration config.Config) *ReadingHandler {
	return &ReadingHandler{repo, createMeters(configuration.Meters)}
}

func createMeters(configString string) []model.Meter {
	result := make([]model.Meter, 0)
	for _, m := range strings.Split(configString, ",") {
		r := regexp.MustCompile(`(.*)\((.*)\)`)
		groups := r.FindStringSubmatch(m)
		if len(groups) != 3 {
			log.Fatal("wrong meter configuration: please enter valid configuration string (example: 'water (m³)'")
		}
		result = append(result, model.Meter{Name: strings.Trim(groups[1], " "), Unit: strings.Trim(groups[2], " ")})
	}
	return result
}

func (h *ReadingHandler) GetReadingsYears(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	years, err := h.repo.GetReadingsYears()
	if err != nil {
		panic("failed to load years")
	}
	content, _ := json.Marshal(years)
	w.Write(content)
}

func (h *ReadingHandler) GetReadings(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var readings []model.Reading
	var err error

	meterIDs := r.URL.Query()["meter"]
	years := r.URL.Query()["years"]

	if len(meterIDs) < 1 {
		meterIds := make([]string, len(h.meters))
		for _, m := range h.meters {
			meterIds = append(meterIds, m.Name)
		}
		meterIDs = meterIds
	}

	if len(years) > 0 {
		readings, err = h.repo.GetReadingsByMeterIdAndYears(meterIDs, years)
	} else {
		readings, err = h.repo.GetReadingsByMeterId(meterIDs)
	}

	if err != nil {
		panic("failed to load readings")
	}
	content, _ := json.Marshal(readings)
	w.Write(content)
}

func (h *ReadingHandler) DeleteReading(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)

	if readingId, err := strconv.Atoi(params["id"]); err != nil {
		log.Print("id parameter is missing/wrong", err)
		w.WriteHeader(http.StatusBadRequest)
	} else {
		if err := h.repo.DeleteReadings(readingId); err != nil {
			w.WriteHeader(http.StatusBadRequest)
		}
	}
}

func (h *ReadingHandler) GetLastReadingDate(w http.ResponseWriter, r *http.Request) {
	date, err := h.repo.GetReadingsLastDate([]string{})
	if err != nil {
		log.Print("can't retrieve last reading date", err)
		w.WriteHeader(http.StatusBadRequest)
	} else {
		content, _ := json.Marshal(date)
		w.Write(content)
	}
}

func (h *ReadingHandler) CreateReadings(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var readings []model.Reading
	if err := json.NewDecoder(r.Body).Decode(&readings); err != nil {
		log.Print("cant't decode json ", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if err := h.repo.StoreReadings(readings); err != nil {
		log.Print("cant't store readings ", err)
		w.WriteHeader(http.StatusBadRequest)
	}
}

func (h *ReadingHandler) GetMeters(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	content, _ := json.Marshal(h.meters)
	w.Write(content)
}
