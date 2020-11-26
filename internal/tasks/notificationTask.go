package tasks

import (
	"log"
	"meter-go/internal/config"
	"meter-go/internal/mail"
	"meter-go/internal/storage"
	"time"
)

type NotificationTask struct {
	sender mail.Mailer
	repo   storage.ReadingsLastDateLoader
	config config.NotificationTaskConfig
}

type NotificationMailData struct {
	URL  string
	Days uint16
}

func NewNotificationTask(sender mail.Mailer, repo storage.ReadingsLastDateLoader, config config.NotificationTaskConfig) NotificationTask {
	return NotificationTask{sender: sender, repo: repo, config: config}
}

func (n NotificationTask) Run() {
	log.Print("executing notification task")
	lastReadingDate, err := n.repo.GetReadingsLastDate(n.config.MeterNames)
	if err != nil {
		log.Println("error occurred in notification task, can't determine last reading date", err)
	} else {
		diff := uint16(time.Now().Sub(lastReadingDate).Hours() / 24)
		if diff > n.config.Days {
			if err := n.sender.SendMail("Reminder: Please record new meter readings",
				"notification.html",
				NotificationMailData{URL: n.config.Url, Days: diff},
				mail.FileAttachment{}); err != nil {
				log.Println("error occurred in notification task, couldn't send mail", err)
			}
		}
	}
}
