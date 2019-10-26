package main

import (
	"fmt"
	rice "github.com/GeertJohan/go.rice"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
	"github.com/robfig/cron"
	"log"
	"meter-go/internal/config"
	"meter-go/internal/handlers"
	"meter-go/internal/mail"
	"meter-go/internal/storage"
	"meter-go/internal/tasks"
	"net/http"
)

func main() {
	printBanner()

	cfg := initializeConfig()
	db := initializeDB(cfg)
	defer func() {
		if err := db.Close(); err != nil {
			log.Print("can't close database connection", err)
		}
	}()
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

	// configure routers
	router := mux.NewRouter()
	router.HandleFunc("/api/reading", readingHandler.GetReadings).Methods("GET")
	router.HandleFunc("/api/reading", readingHandler.CreateReadings).Methods("POST")
	router.HandleFunc("/api/reading/{id:[0-9]+}", readingHandler.DeleteReading).Methods("DELETE")
	router.HandleFunc("/api/lastReadingDate", readingHandler.GetLastReadingDate).Methods("GET")
	router.HandleFunc("/api/aggregation/month/{meterId}", aggregationHandler.GetAggregationsMonth).Methods("GET")
	router.HandleFunc("/api/aggregation/year/{meterId}", aggregationHandler.GetAggregationsYear).Methods("GET")
	router.HandleFunc("/api/meters", readingHandler.GetMeters).Methods("GET")
	router.HandleFunc("/api/admin/export", adminHandler.ExportCsv).Methods("GET")
	router.HandleFunc("/api/admin/import", adminHandler.ImportCsv).Methods("POST")
	router.HandleFunc("/api/admin/buildInfo", adminHandler.GetBuildInfo).Methods("GET")

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

func initializeDB(cfg config.Config) *gorm.DB {
	db, err := storage.InitDB(cfg.Db)
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

func embedWebApplicationFiles(router *mux.Router) {
	box := rice.MustFindBox("web/app/dist/meterNG").HTTPBox()
	if b, err := box.Bytes("index.html"); err != nil {
		log.Fatal("can't find index.html file")
	} else {
		router.PathPrefix("/").Handler(handlers.WrapWith404ContentHandler(http.FileServer(box), b))
	}
}

func registerCronTasks(configuration config.Config, repo *storage.ReadingRepository) {
	taskManager := tasks.NewTaskManager()
	templates, err := rice.FindBox("templates")
	if err != nil {
		log.Fatal(err)
	}
	sender := mail.NewSender(configuration.Email, templates)
	backupTaskCfg := configuration.Task.Backup
	notificationTaskCfg := configuration.Task.Notification

	backupTask := tasks.Task{
		Factory: func() cron.Job {
			return tasks.NewBackupTask(sender, repo)
		},
		Description:          "backup task",
		SchedulingDefinition: backupTaskCfg.Cron,
	}

	notificationTask := tasks.Task{
		Factory: func() cron.Job {
			return tasks.NewNotificationTask(sender, repo, notificationTaskCfg)
		},
		Description:          "notification task",
		SchedulingDefinition: notificationTaskCfg.Cron,
	}
	taskManager.RegisterAndStartCronTask(backupTask, notificationTask)
}
