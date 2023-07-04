package main

import (
	"embed"
	"fmt"
	"github.com/0xERR0R/meterNG/internal/config"
	"github.com/0xERR0R/meterNG/internal/handlers"
	"github.com/0xERR0R/meterNG/internal/mail"
	"github.com/0xERR0R/meterNG/internal/storage"
	"github.com/0xERR0R/meterNG/internal/tasks"
	"github.com/gorilla/mux"
	"github.com/robfig/cron"
	"gorm.io/gorm"
	"io/fs"
	"log"
	"net/http"
)

func main() {
	printBanner()

	cfg := initializeConfig()
	db := initializeDB()

	repo := storage.New(db)
	router := initializeRouter(repo, cfg)

	registerCronTasks(cfg, repo)

	log.Print("✓ meterNG is ready")
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", cfg.Port), router))
}

func initializeRouter(repo *storage.ReadingRepository, cfg config.Config) *mux.Router {
	// initialize handlers
	aggregationHandler := handlers.NewAggregationHandler(repo)
	readingHandler := handlers.NewReadingHandler(repo, cfg)
	adminHandler := handlers.NewAdminHandler(repo)
	navHandler := handlers.NewNavHandler(cfg)

	// configure routers
	router := mux.NewRouter()
	router.HandleFunc("/api/reading", readingHandler.GetReadings).Methods("GET")
	router.HandleFunc("/api/readingsYears", readingHandler.GetReadingsYears).Methods("GET")
	router.HandleFunc("/api/reading", readingHandler.CreateReadings).Methods("POST")
	router.HandleFunc("/api/reading/{id:[0-9]+}", readingHandler.DeleteReading).Methods("DELETE")
	router.HandleFunc("/api/lastReadingDate", readingHandler.GetLastReadingDate).Methods("GET")
	router.HandleFunc("/api/aggregation/month", aggregationHandler.GetAggregationsMonth).Methods("GET")
	router.HandleFunc("/api/aggregation/year", aggregationHandler.GetAggregationsYear).Methods("GET")
	router.HandleFunc("/api/meters", readingHandler.GetMeters).Methods("GET")
	router.HandleFunc("/api/admin/export", adminHandler.ExportCsv).Methods("GET")
	router.HandleFunc("/api/admin/import", adminHandler.ImportCsv).Methods("POST")
	router.HandleFunc("/api/admin/buildInfo", adminHandler.GetBuildInfo).Methods("GET")
	router.HandleFunc("/api/nav/label", navHandler.GetLabel).Methods("GET")

	// embed web application files
	embedWebApplicationFiles(router)

	return router
}

func initializeConfig() config.Config {
	cfg, err := config.New()
	if err != nil {
		log.Fatal("Configuration error", err)
	}
	return cfg
}

func initializeDB() *gorm.DB {
	db, err := storage.InitDB()
	if err != nil {
		log.Fatal("failed to connect database", err)
	}
	return db
}

func printBanner() {
	log.Println("                                             ")
	log.Println("                   __            _   ________")
	log.Println("   ____ ___  ___  / /____  _____/ | / / ____/")
	log.Println("  / __ `__ \\/ _ \\/ __/ _ \\/ ___/  |/ / / __  ")
	log.Println(" / / / / / /  __/ /_/  __/ /  / /|  / /_/ /  ")
	log.Println("/_/ /_/ /_/\\___/\\__/\\___/_/  /_/ |_/\\____/   ")
	log.Println("                                             ")
	log.Println("                                             ")
}

//go:embed web/app/www
var www embed.FS
var contentFS, _ = fs.Sub(www, "web/app/www")

//go:embed templates
var templates embed.FS
var templatesFS, _ = fs.Sub(templates, "templates")

func embedWebApplicationFiles(router *mux.Router) {
	c, err := fs.ReadFile(contentFS, "index.html")
	if err != nil {
		log.Fatal("can't find index.html file")
	}

	router.PathPrefix("/").Handler(handlers.WrapWith404ContentHandler(http.FileServer(http.FS(contentFS)), c))
}

func registerCronTasks(configuration config.Config, repo *storage.ReadingRepository) {
	taskManager := tasks.NewTaskManager()
	sender := mail.NewSender(configuration.Email, templatesFS)
	backupTaskCfg := configuration.Task.Backup
	notificationTaskCfg := configuration.Task.Notification
	label := configuration.Label

	backupTask := tasks.Task{
		Factory: func() cron.Job {
			return tasks.NewBackupTask(sender, repo, label)
		},
		Description:          "backup task",
		SchedulingDefinition: backupTaskCfg.Cron,
	}

	notificationTask := tasks.Task{
		Factory: func() cron.Job {
			return tasks.NewNotificationTask(sender, repo, notificationTaskCfg, label)
		},
		Description:          "notification task",
		SchedulingDefinition: notificationTaskCfg.Cron,
	}
	taskManager.RegisterAndStartCronTask(backupTask, notificationTask)
}
