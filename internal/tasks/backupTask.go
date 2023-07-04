package tasks

import (
	"github.com/0xERR0R/meterNG/internal/mail"
	"github.com/0xERR0R/meterNG/internal/storage"
	"log"
)

type BackupTask struct {
	sender mail.Mailer
	repo   *storage.ReadingRepository
	label  string
}

func NewBackupTask(sender mail.Mailer, repo *storage.ReadingRepository, label string) BackupTask {
	return BackupTask{sender: sender, repo: repo, label: label}
}

func (b BackupTask) String() string {
	return "backup task"
}

func (b BackupTask) Run() {
	log.Print("executing backup task")
	content, filename, err := b.repo.GetAsCSVFile()
	if err != nil {
		log.Println("error occurred in backup task", err)
	} else {
		var subject string = "new backup file"
		if len(b.label) > 0 {
			subject = subject + " (" + b.label + ")"
		}
		err := b.sender.SendMail(subject,
			"backup.html",
			nil,
			mail.FileAttachment{FileName: filename, Data: content, ContentType: "application/csv"})
		if err != nil {
			log.Println("error occurred in backup task, couldn't send mail", err)
		}
	}
}
