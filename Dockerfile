FROM alpine:3.16

LABEL org.opencontainers.image.source="https://github.com/0xERR0R/meterNG" \
      org.opencontainers.image.url="https://github.com/0xERR0R/meterNG" \
      org.opencontainers.image.source=https://github.com/0xERR0R/meterNG \
      org.opencontainers.image.title="meterNG"
      

ENTRYPOINT ["/usr/bin/meterNG"]
COPY meterNG /usr/bin/meterNG
VOLUME /data