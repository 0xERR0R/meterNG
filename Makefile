build: buildFrontend embedFrontend buildGo

buildGo:
	GOOS=linux go build -ldflags="-w -s" -o dist/meterNG

buildFrontend:
	cd web/app && npm update && ng build --prod

embedFrontend:
	rice embed-go

buildDockerImages:
	docker build --build-arg opts="GOARCH=arm GOARM=6" --pull --tag spx01/meterng:arm32v6 .
	docker build --build-arg opts="GOARCH=amd64" --pull --tag spx01/meterng:amd64 .

dockerManifestAndPush:
	docker push spx01/meterng:arm32v6
	docker push spx01/meterng:amd64
	docker manifest create spx01/meterng spx01/meterng:amd64 spx01/meterng:arm32v6
	docker manifest annotate spx01/meterng spx01/meterng:arm32v6 --os linux --arch arm
	docker manifest push --purge spx01/meterng

runBackend:
	go run cmd/meterNG/main.go

startLocalWeb:
	npm start