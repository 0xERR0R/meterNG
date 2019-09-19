# build stage
FROM golang:alpine AS build-env
RUN apk add --no-cache \
    git \
    make \
    npm \
    gcc \
    libc-dev \
    tzdata \
    zip \
    ca-certificates
RUN npm install -g @angular/cli
RUN go get github.com/GeertJohan/go.rice && \
    go get github.com/GeertJohan/go.rice/rice
ENV GO111MODULE=on \
    CGO_ENABLED=0
ADD . /src
WORKDIR /src
# frontend
RUN cd web/app && \
    npm update && \
    ng build --source-map=false --build-optimizer=false --prod
# embed frontend
RUN rice embed-go

ARG opts
RUN env ${opts} go build -ldflags="-w -s" -o dist/meterNG
WORKDIR /usr/share/zoneinfo
RUN zip -r -0 /zoneinfo.zip .

# final stage
FROM scratch
COPY --from=build-env /src/dist/meterNG /app/meterNG

# the timezone data:
COPY --from=build-env /usr/share/zoneinfo /usr/share/zoneinfo
# the tls certificates:
COPY --from=build-env /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
ENTRYPOINT ["/app/meterNG"]