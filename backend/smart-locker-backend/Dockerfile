# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1 — dependencies
# Only the pom is copied, so this layer is reused until a dependency changes.
# ---------------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-17 AS deps
WORKDIR /build

COPY pom.xml ./
RUN mvn -B -ntp dependency:go-offline

# ---------------------------------------------------------------------------
# Stage 2 — test
# Off the runtime chain. CI targets it directly on the dev branch:
#   docker build --target test .
# Same image as the build stage, so tests can never pass on a JDK the artifact
# was not compiled with.
# ---------------------------------------------------------------------------
FROM deps AS test
WORKDIR /build

COPY src ./src
RUN mvn -B -ntp verify

# ---------------------------------------------------------------------------
# Stage 3 — build
# Tests already ran in the stage above, so they are skipped here.
# ---------------------------------------------------------------------------
FROM deps AS build
WORKDIR /build

COPY src ./src
RUN mvn -B -ntp clean package -DskipTests \
    && cp target/*.jar target/app.jar

# ---------------------------------------------------------------------------
# Stage 4 — runtime
# JRE only. This image is built once on dev and the exact same digest is what
# reaches test and prod — nothing environment-specific is compiled into it.
# ---------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine AS runtime

LABEL org.opencontainers.image.title="smart-locker-backend" \
      org.opencontainers.image.source="https://github.com/karlsamaha/smart-locker"

RUN apk add --no-cache curl \
    && addgroup -S app \
    && adduser -S app -G app

WORKDIR /app
COPY --from=build /build/target/app.jar app.jar
RUN mkdir -p /app/uploads && chown -R app:app /app

USER app

EXPOSE 8080

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:+UseContainerSupport"

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
