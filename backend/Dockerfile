# ---- Build Stage ----
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# ---- Run Stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Download OpenTelemetry Java Agent
RUN mkdir /otel && \
    wget -O /otel/opentelemetry-javaagent.jar https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar

# Copy the application jar
COPY --from=build /app/target/tweetapp-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Set default OTEL environment variables for Zipkin
ENV OTEL_TRACES_EXPORTER=zipkin \
    OTEL_EXPORTER_ZIPKIN_ENDPOINT=http://zipkin:9411/api/v2/spans \
    OTEL_SERVICE_NAME=tweetapp \
    JAVA_TOOL_OPTIONS=-javaagent:/otel/opentelemetry-javaagent.jar

# Run with OpenTelemetry Java Agent
ENTRYPOINT ["java", "-javaagent:/otel/opentelemetry-javaagent.jar", "-jar", "app.jar"]

