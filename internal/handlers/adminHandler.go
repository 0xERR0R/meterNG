package handlers

import (
	"encoding/csv"
	"fmt"
	"log"
	"meter-go/internal/model"
	"meter-go/internal/storage"
	"net/http"
	"strconv"
)

type AdminHandler struct {
	repo *storage.ReadingRepository
}

func NewAdminHandler(repo *storage.ReadingRepository) *AdminHandler {
	return &AdminHandler{repo}
}

func (h *AdminHandler) ExportCsv(w http.ResponseWriter, r *http.Request) {
	data, fileName, err := h.repo.GetAsCSVFile()
	if err != nil {
		log.Println("can't load readings")
		w.WriteHeader(http.StatusBadRequest)
	} else {
		w.Header().Set("Content-Type", "application/csv")
		w.Header().Set("content-disposition", "attachment; filename=\""+fileName+"\"")
		w.Write(data)
	}
}

func (h *AdminHandler) ImportCsv(w http.ResponseWriter, r *http.Request) {
	file, header, err := r.FormFile("file")
	if err != nil {
		log.Print("file parameter is missing", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	defer file.Close()

	incremental, err := strconv.ParseBool(r.FormValue("incremental"))
	if err != nil {
		log.Print("incremental parameter is missing/wrong", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	log.Printf("File name %s, incremental %t\n", header.Filename, incremental)

	reader := csv.NewReader(file)
	reader.Comma = ';'
	lines, err := reader.ReadAll()
	if err != nil {
		log.Print("couldn't import entries", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	result := make([]model.Reading, 0)
	for _, line := range lines {
		result = append(result, model.FromCsv(line))
	}
	if !incremental {
		if err := h.repo.DeleteAllReadings(); err != nil {
			log.Print("couldn't delete all entries", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	if err := h.repo.StoreReadings(result); err != nil {
		log.Print("couldn't store entities", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	in := fmt.Sprintf("%d", len(result))
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(in))
}
