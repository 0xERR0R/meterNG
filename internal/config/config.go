package config

import (
	"github.com/spf13/viper"
	"log"
	"sort"
	"strings"
)

type TaskConfig struct {
	Backup       BackupTaskConfig
	Notification NotificationTaskConfig
}

type BackupTaskConfig struct {
	Cron string
}
type NotificationTaskConfig struct {
	Cron       string
	Days       uint16
	Url        string
	MeterNames []string `mapstructure:"meter_names"`
}

type MailConfig struct {
	Recipient    string
	Sender       string
	SmtpHost     string `mapstructure:"smtp_host"`
	SmtpPort     uint16 `mapstructure:"smtp_port"`
	SmtpUser     string `mapstructure:"smtp_user"`
	SmtpPassword string `mapstructure:"smtp_password"`
}

type Config struct {
	Port uint16

	Meters string
	Email  MailConfig
	Task   TaskConfig
}

func New() (Config, error) {
	config, err := initViper()
	if err == nil {
		printConfiguration()
	}

	return config, err
}

func initViper() (Config, error) {
	viper.SetConfigFile("meter.json")
	viper.AddConfigPath(".")

	viper.SetDefault("port", 8080)
	viper.SetDefault("meters", "")
	viper.SetDefault("email.recipient", "")
	viper.SetDefault("email.smtp_host", "")
	viper.SetDefault("email.sender", "")
	viper.SetDefault("email.smtp_port", "0")
	viper.SetDefault("email.smtp_user", "")
	viper.SetDefault("email.smtp_password", "")
	viper.SetDefault("db.dialect", "mysql")
	viper.SetDefault("db.url", "default")
	viper.SetDefault("task.backup.cron", "0 0 7 * * *")
	viper.SetDefault("task.notification.cron", "0 0 * * * *")
	viper.SetDefault("task.notification.days", "7")
	viper.SetDefault("task.notification.url", "http://enter_valid_url:8080/record")
	viper.SetDefault("task.notification.meter_names", "")
	viper.SetEnvPrefix("meter")
	viper.AutomaticEnv()

	_ = viper.ReadInConfig()

	var config Config
	err := viper.Unmarshal(&config)
	return config, err
}

func printConfiguration() {
	log.Println("Current configuration:")
	configKeys := viper.AllKeys()
	sort.Strings(configKeys)
	for _, key := range configKeys {
		value := viper.GetString(key)
		if strings.Contains(strings.ToUpper(key), "PASSWORD") {
			value = strings.Repeat("*", len(value))
		}
		log.Printf(":: \"%s\" = \"%s\"\n", key, value)
	}
}
