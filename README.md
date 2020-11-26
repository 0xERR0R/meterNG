![Docker Image CI](https://github.com/0xERR0R/meterNG/workflows/Docker%20Image%20CI/badge.svg)

# meterNG

meterNG is a small tool with web UI to record meter readings in a household and track consumptions. This application does not need any cloud for data storage or synchronization.

## Features

- Web UI to record new meter readings, optimized for mobile usage
- Charts in Web UI with consumption over a certain period
- Import and Export to/from a CSV file
- periodical mail with CSV file as backup (Mail configuration necessary, see below)
- periodical reminder mail if X days elapsed since last reading date (Mail configuration necessary, see below)

## Usage

Start meterNG with following `docker-compose.yml`

```yaml
version: "2.1"
services:
  meterng:
    image: ghcr.io/0xerr0r/meterng
    container_name: meterng
    restart: unless-stopped
    environment:
      # comma separated list of meters. Format: meterName(Unit)
      - METER_METERS=Water (m³), Gas (m³)
      # mail configuration
      - METER_EMAIL.RECIPIENT=xxx@gmail.com
      - METER_EMAIL.SENDER=xxx@gmail.com
      - METER_EMAIL.SMTP_HOST=smtp.gmail.com
      - METER_EMAIL.SMTP_PORT=587
      - METER_EMAIL.SMTP_USER=xxx@googlemail.com
      - METER_EMAIL.SMTP_PASSWORD=xxx
      # cron string for backup job
      - METER_TASK.BACKUP.CRON=0 0 7 1 * *
      # cron string for notification job
      - METER_TASK.NOTIFICATION.CRON=0 0 7 * * *
      # Amount of days elapsed since last reading to trigger the email notification
      - METER_TASK.NOTIFICATION.DAYS=7
      # url for record page (used as link in email)
      - METER_TASK.NOTIFICATION.URL=http://external_meter_url/record
      - TZ=Europe/Berlin
```