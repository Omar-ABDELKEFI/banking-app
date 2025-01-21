# backend/Dockerfile
FROM maven:3.8.4-openjdk-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
COPY --from=builder /app/uploads /app/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]