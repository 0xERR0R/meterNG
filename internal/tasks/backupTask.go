package tasks

import (
	"log"
	"meter-go/internal/mail"
	"meter-go/internal/storage"
)

type BackupTask struct {
	sender mail.Mailer
	repo   *storage.ReadingRepository
}

func NewBackupTask(sender mail.Mailer, repo *storage.ReadingRepository) BackupTask {
	return BackupTask{sender: sender, repo: repo}
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
		err := b.sender.SendMail("new backup file",
			"backup.html",
			nil,
			mail.FileAttachment{FileName: filename, Data: content, ContentType: "application/csv"})
		if err != nil {
			log.Println("error occurred in backup task, couldn't send mail", err)
		}
	}
}
