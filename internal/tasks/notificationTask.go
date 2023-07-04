package tasks

import (
	"github.com/0xERR0R/meterNG/internal/config"
	"github.com/0xERR0R/meterNG/internal/mail"
	"github.com/0xERR0R/meterNG/internal/storage"
	"log"
	"time"
)

type NotificationTask struct {
	sender mail.Mailer
	repo   storage.ReadingsLastDateLoader
	config config.NotificationTaskConfig
	label  string
}

type NotificationMailData struct {
	URL  string
	Days uint16
}

func NewNotificationTask(sender mail.Mailer, repo storage.ReadingsLastDateLoader, config config.NotificationTaskConfig, label string) NotificationTask {
	return NotificationTask{sender: sender, repo: repo, config: config, label: label}
}

func (n NotificationTask) Run() {
	log.Print("executing notification task")
	lastReadingDate, err := n.repo.GetReadingsLastDate(n.config.MeterNames)
	if err != nil {
		log.Println("error occurred in notification task, can't determine last reading date", err)
	} else {
		diff := uint16(time.Now().Sub(lastReadingDate).Hours() / 24)
		if diff > n.config.Days {
			var subject string
			if len(n.label) > 0 {
				subject = "Reminder (" + n.label + "): Please record new meter readings"
			} else {
				subject = "Reminder: Please record new meter readings"
			}
			if err := n.sender.SendMail(subject,
				"notification.html",
				NotificationMailData{URL: n.config.Url, Days: diff},
				mail.FileAttachment{}); err != nil {
				log.Println("error occurred in notification task, couldn't send mail", err)
			}
		}
	}
}
