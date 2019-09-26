.PHONY: help
.DEFAULT_GOAL := help

DOCKER_IMAGE_NAME="spx01/meterng"

all: buildFrontend embedFrontend buildBackend ## Build the final binary, include web frontend

buildBackend: *.go ## Build backend (GO part)
	GOOS=linux go build -ldflags="-w -s" -o dist/meterNG

buildFrontend:  ## Build frontend (Angular part)
	cd web/app && npm update && ng build --prod

embedFrontend: ## Embed frontend into backend
	rice embed-go

testBackend: ## Run backend tests
	go test -v -cover $(shell go list ./...)

buildDockerImages: ## Build docker images
	docker build --build-arg opts="GOARCH=arm GOARM=6" --pull --tag ${DOCKER_IMAGE_NAME}:arm32v6 .
	docker build --build-arg opts="GOARCH=amd64" --pull --tag ${DOCKER_IMAGE_NAME}:amd64 .

dockerManifestAndPush: ## create manifest for multi arch image and push to docker hub
	docker push ${DOCKER_IMAGE_NAME}:arm32v6
	docker push ${DOCKER_IMAGE_NAME}:amd64
	docker manifest create ${DOCKER_IMAGE_NAME} ${DOCKER_IMAGE_NAME}:amd64 ${DOCKER_IMAGE_NAME}:arm32v6
	docker manifest annotate ${DOCKER_IMAGE_NAME} ${DOCKER_IMAGE_NAME}:arm32v6 --os linux --arch arm
	docker manifest push --purge ${DOCKER_IMAGE_NAME}

help:  ## Shows help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
