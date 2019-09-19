package tasks

import (
	"github.com/stretchr/testify/mock"
	"meter-go/internal/config"
	"meter-go/internal/mail"
	"testing"
	"time"
)

type senderMock struct {
	mock.Mock
}

type readingsLastDateLoaderMock struct {
	fakeDate time.Time
}

func (s readingsLastDateLoaderMock) GetReadingsLastDate(meterIds []string) (time.Time, error) {
	return s.fakeDate, nil
}

func (m senderMock) SendMail(subject string, tmpl string, data interface{}, file mail.FileAttachment) error {
	args := m.Called(subject, tmpl, data, file)
	return args.Error(0)
}

func TestNotificationNoMail(t *testing.T) {
	senderMock := new(senderMock)
	sut := NewNotificationTask(senderMock, readingsLastDateLoaderMock{time.Now().AddDate(0, 0, -7)}, config.NotificationTaskConfig{Days: 7})
	sut.Run()
	senderMock.AssertExpectations(t)
}

func TestNotificationMail(t *testing.T) {
	senderMock := new(senderMock)
	senderMock.On("SendMail",
		"Reminder: Please record new meter readings",
		"notification.html",
		NotificationMailData{URL: "myurl", Days: 8},
		mail.FileAttachment{}).Return(nil)
	sut := NewNotificationTask(senderMock,
		readingsLastDateLoaderMock{time.Now().AddDate(0, 0, -8)},
		config.NotificationTaskConfig{Days: 7, Url: "myurl"})
	sut.Run()
	senderMock.AssertExpectations(t)
}
