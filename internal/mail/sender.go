package mail

import (
	"bytes"
	"fmt"
	"github.com/0xERR0R/meterNG/internal/config"
	"github.com/jordan-wright/email"
	"html/template"
	"io/fs"
	"net/smtp"
)

type Sender struct {
	mailConfig config.MailConfig
	templates  fs.FS
}

type Mailer interface {
	SendMail(subject string, tmpl string, data interface{}, file FileAttachment) error
}

type FileAttachment struct {
	FileName    string
	Data        []byte
	ContentType string
}

func NewSender(mailConfig config.MailConfig, templates fs.FS) *Sender {
	return &Sender{mailConfig: mailConfig, templates: templates}
}

func (s *Sender) SendMail(subject string, tmpl string, data interface{}, file FileAttachment) error {
	e := email.NewEmail()
	e.From = fmt.Sprintf("meterNG <%s>", s.mailConfig.Sender)
	e.To = []string{s.mailConfig.Recipient}
	e.Subject = fmt.Sprintf("[meterNG] %s", subject)

	addr := fmt.Sprintf("%s:%d", s.mailConfig.SmtpHost, s.mailConfig.SmtpPort)
	auth := smtp.PlainAuth("", s.mailConfig.SmtpUser, s.mailConfig.SmtpPassword, s.mailConfig.SmtpHost)

	templateContent, err := fs.ReadFile(s.templates, tmpl)
	if err != nil {
		return err
	}

	t, err := template.New(tmpl).Parse(string(templateContent[:]))
	if err != nil {
		return err
	}
	if file.FileName != "" {
		if _, err = e.Attach(bytes.NewBuffer(file.Data), file.FileName, file.ContentType); err != nil {
			return err
		}
	}
	buf := new(bytes.Buffer)
	if err = t.Execute(buf, data); err != nil {
		return err
	}
	body := buf.String()
	e.HTML = []byte(body)
	return e.Send(addr, auth)
}
