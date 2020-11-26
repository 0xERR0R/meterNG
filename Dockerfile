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
    CGO_ENABLED=1
ADD . /src
WORKDIR /src

ARG opts
RUN env ${opts} make all

# final stage
FROM scratch
COPY --from=build-env /src/dist/meterNG /app/meterNG

# the timezone data:
COPY --from=build-env /usr/share/zoneinfo /usr/share/zoneinfo
# the tls certificates:
COPY --from=build-env /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
ENTRYPOINT ["/app/meterNG"]
