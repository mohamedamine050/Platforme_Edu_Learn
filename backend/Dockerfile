FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Copy everything and build the application
COPY . /app
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
