# syntax=docker/dockerfile:1

# ---- Étape de build ----
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app

# 1) Dépendances d'abord : cette couche n'est réinvalidée que si pom.xml change,
#    ce qui accélère fortement les rebuilds quand seul le code source bouge.
COPY pom.xml .
RUN mvn -B dependency:go-offline

# 2) Code source, puis build.
COPY src ./src
RUN mvn -B -DskipTests package

# ---- Étape d'exécution ----
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Exécuter en tant qu'utilisateur non privilégié (bonne pratique de sécurité).
RUN useradd --system --no-create-home --uid 1001 appuser
COPY --from=build /app/target/*.jar app.jar
USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
