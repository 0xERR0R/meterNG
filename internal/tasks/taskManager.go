package tasks

import (
	"github.com/robfig/cron"
	"log"
	"time"
)

type TaskManager struct {
	cron *cron.Cron
}

type TaskFactory func() cron.Job

type Task struct {
	Factory              TaskFactory
	Description          string
	SchedulingDefinition string
}

func NewTaskManager() TaskManager {
	return TaskManager{cron: cron.New()}
}

func (t *TaskManager) RegisterAndStartCronTask(tasks ...Task) {
	for _, task := range tasks {
		if len(task.SchedulingDefinition) > 0 {
			if schedule, err := cron.Parse(task.SchedulingDefinition); err != nil {
				log.Fatal("can't parse cron string")
			} else {
				if err := t.cron.AddJob(task.SchedulingDefinition, task.Factory()); err != nil {
					log.Fatal("can't initialize periodical task", task.Description, err)
				} else {
					log.Printf("✓ cron task '%s' registered, next planed execution: 🕑 %s", task.Description, schedule.Next(time.Now()))
				}
			}
		}
	}
	t.cron.Start()
}
