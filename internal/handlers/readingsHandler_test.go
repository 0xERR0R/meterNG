package handlers

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestCreateMeter(t *testing.T) {
	meters := createMeters("Electricity(kWh), Gas(m³)")

	assert.Len(t, meters, 2)
	assert.Equal(t, "Electricity", meters[0].Name)
	assert.Equal(t, "kWh", meters[0].Unit)
}
