https://medium.com/@carlosedp/cross-building-arm64-images-on-docker-desktop-254d1e0bc1f9
https://github.com/alextanhongpin/go-docker-multi-stage-build
https://www.thepolyglotdeveloper.com/2017/04/cross-compiling-golang-applications-raspberry-pi/


docker buildx build --platform linux/arm/v7,linux/amd64 --push -t spx01/meterng:v1  .


https://medium.com/@bamnet/building-multiarch-docker-images-8a70002b3476

docker build --build-arg opts="GOARCH=arm GOARM=6" --pull -t spx01/meterng:arm32v6 .
docker push spx01/meterng:arm32v6

docker build --build-arg opts="GOARCH=amd64" --pull -t spx01/meterng:amd64 .
docker push spx01/meterng:amd64

docker manifest create spx01/meterng spx01/meterng:amd64 spx01/meterng:arm32v6
docker manifest annotate spx01/meterng spx01/meterng:arm32v6 --os linux --arch arm
docker manifest push --purge spx01/meterng