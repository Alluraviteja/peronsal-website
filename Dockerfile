FROM golang:1.25.9-alpine3.21 AS builder

WORKDIR /app

COPY go.mod go.sum* ./
RUN go mod download

COPY . .

ARG VERSION=dev
ARG GIT_COMMIT=unknown

RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags="-s -w -X main.version=${VERSION} -X main.gitCommit=${GIT_COMMIT}" \
    -o server .

# ── Final image ──
FROM alpine:3.21

# Upgrade Alpine packages to pick up latest security patches
RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

COPY --from=builder /app/server .
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/static ./static

USER app

ARG CONTAINER_PORT=8080
ENV PORT=${CONTAINER_PORT}

EXPOSE ${CONTAINER_PORT}

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:${PORT}/ || exit 1

ENTRYPOINT ["./server"]
