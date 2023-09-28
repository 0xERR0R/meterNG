package handlers

import (
	"encoding/json"
	"github.com/0xERR0R/meterNG/internal/config"
	"net/http"
)

type NavHandler struct {
	label string
}

func NewNavHandler(configuration config.Config) *NavHandler {
	return &NavHandler{configuration.Label}
}

func (h *NavHandler) GetLabel(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	content, _ := json.Marshal(h.label)
	w.Write(content)
}
