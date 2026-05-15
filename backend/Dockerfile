# syntax=docker/dockerfile:1.7

# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Cache de dependências (camada separada)
COPY pom.xml ./
RUN mvn -B -q dependency:go-offline

# Build do jar
COPY src ./src
RUN mvn -B -q -DskipTests package && \
    cp target/*.jar app.jar

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app

# Locale UTF-8 (acentos em "Coração Eucarístico" e nomes em PT-BR)
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    SPRING_PROFILES_ACTIVE=docker \
    JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

COPY --from=build /build/app.jar /app/app.jar

# Usuário não-root
RUN useradd -u 1001 -m -s /bin/false spring && \
    chown spring:spring /app/app.jar
USER 1001:1001

EXPOSE 8081

# Healthcheck simples (endpoint público)
HEALTHCHECK --interval=15s --timeout=5s --start-period=40s --retries=5 \
  CMD wget -qO- http://localhost:8081/api/vantagem >/dev/null || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
